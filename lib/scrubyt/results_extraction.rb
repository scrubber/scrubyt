require 'ruby-debug'
require 'nokogiri'
module Scrubyt
  module ResultsExtraction 
    private
      def save_result(name, result)
        if array_of_strings?(result)
          @results << result.map{|r| {name => r} }
        elsif nested_result_set?(result)
          @results = result
        elsif appending_to_results?
          @results.first << { name => result.empty? ? nil : result }
        elsif result.is_a?(Array)
          @results << {} unless @results.first
          @results.first[name] = result.first
        else
          @results << {} unless @results.first
          @results.first[name] = result
        end
        if parent_result?
          notify(:save_results, name, @results)
        end
        clear_current_result!
      end

      def parent_result?
        @options[:parent]
      end
      
      def in_block?
        @options[:body]
      end
      
      def first_child?
        @options[:first_child]
      end
      
      def appending_to_results?
        @results.first.is_a?(Array)
      end
      
      def extract_result(result_name, locator, options = {})
        return @current_result if @current_result  
        results = []
        if locator == "current_url"
          results << process_proc(previous_url, options[:script])
          return results
        else 
          debugger if options[:debug]          
          if locator.is_a?(Array)
            if options[:compound]
              all_matched_elements = locator.map{|l| evaluate_xpath(l).to_a}
              matching_elements = []
              while(!all_matched_elements.empty?) do
                merged_element = Nokogiri::HTML.parse("")
                all_matched_elements.size.times do |i|
                  merged_element.add_child all_matched_elements[i].shift
                end
                matching_elements << merged_element
                all_matched_elements.reject!{|e| e.size < 1}
              end
            else
              matching_elements = locator.map{|l| evaluate_xpath(l)}.flatten
            end
          else
            matching_elements = evaluate_xpath(locator)
          end
          return merge_elements(matching_elements, options[:script]) if merge_elements?(locator)
          matching_elements.each do |element|
            element = process_proc(element, options[:hpricot_script])
            result = get_value(element, attribute(options, :text))
            results << process_proc(result, options[:script])
          end
        end
        ## Deals with XPath not always matching nth child properly. Look into
        ## A better solution
        return @current_result = [results.first] if locator.is_a?(String) && locator.match(%r{\[1\]$})
        ## Shortcut to return the last sibling element 
        return @current_result = [results.last] if locator.is_a?(String) && locator.match(%r{\[-1\]$})
        ## Return a limited resultset
        return @current_result = results[0...options[:limit]] if options[:limit]
        ## Return only non-nil/empty results. Look at porting rails #blank?
        return @current_result = results.compact.reject{|r| r == ""} if options[:required]
        @current_result = results
      end  
      
      def evaluate_xpath(xpath)
        if(xpath =~ /frameset/i)
          xpath = clean_xpath(xpath)
          ## split up the cleaned XPath to 2 parts:
          ## - frame_path - just to grab the src attribute of the frame to navigate there
          ## - element_path - the 'real' XPath pointing into the frame document
          frame_path = xpath.scan(/.+frame.+?\]/)[0]
          element_path = xpath[frame_path.size..-1]
          
          ## go there
          ## TODO - how do we know whether we are still in that frame or not?!!?!?!?!?!
          ## if we navigate away to a detail page, that's cool - however, what about the case
          ##
          ## parent1    ----> frames
          ##   - child1
          ##   - child2
          ## parent2    ----> this is *not* in a frame, so the original doc should be re-loade
          ##   - child 3
          ##
          ## I think this case is highly unlikely to ever come up 
          ## and btw an easy workaround is to put parent2 before parent1
          ## but there might be another cases?
          ## dunno and don't want to spend too much time w/ it now
          p parsed_doc
          p frame_path
          frame_src = parsed_doc.search(frame_path)[0].attributes["src"]
          fetch(frame_src)
          reset_page_state!
          
          ## and evaluate the XPath
          parsed_doc.search(element_path)
        else
          parsed_doc.search(clean_xpath(xpath))
        end
      end
      
      def extract_detail(result_name, *args, &block)
        locators = args.shift
        unless locators.is_a?(Array)
          is_simple_match = true
          locators = [locators] 
        end
        if args.include?({:compound => true})
          all_matched_elements = locators.map{|l| evaluate_xpath(l).to_a}
          matching_elements = []
          while(!all_matched_elements.empty?) do
            merged_element = Nokogiri::HTML.parse("")
            all_matched_elements.size.times do |i|
              merged_element.add_child all_matched_elements[i].shift
            end
            matching_elements << merged_element
            all_matched_elements.reject!{|e| e.size < 1}
          end
          results = matching_elements.map do |element|
            options = @options
            options.delete(:hash)
            child_extractor_options = options.merge(:body => element.to_s,
                                                    :detail => true, 
                                                    :parent_url => previous_url,
                                                     :first_child => options[:parent])
            result = { result_name => Extractor.new(child_extractor_options, &block).results }
            notify(:save_results, name, result) if first_child?
            result
          end
        else
          results = locators.map do |locator|
            evaluate_xpath(locator).map do |element|
              options = @options
              options.delete(:json)
              options[:json] = args.detect{|h| h.has_key?(:json)}[:json].to_json if args.detect{|h| h.has_key?(:json)}
              element_body = is_simple_match ? element.children.to_s : element.to_s
              child_extractor_options = options.merge(:body => element_body,
                                                       :detail => true, 
                                                       :parent_url => previous_url,
                                                       :first_child => options[:parent])
              result = { result_name => Extractor.new(child_extractor_options, &block).results }
              notify(:save_results, name, result) if first_child?
              result
            end
          end.flatten
        end
        return results unless first_child?
      end
      
      def merge_results(results, proc)
        process_proc(results.to_s, options[:script])
      end
      
      def get_value(element, attribute)
        attribute == :text ? element.inner_text : element.get_attribute(attribute.to_s)
      end
      
      def attribute(options, default = :href)
        options = options.first if options.is_a?(Array)
        return default if options.nil? || options.empty?        
        options[:attribute] || options["attribute"] || default
      end
      
      def should_return_result?(result, all_required)
        return false if result.empty?
        return false if (all_required && missing_a_result?(result))
        true
      end
      
      def missing_a_result?(result)
        return true if result.detect{|fields| fields.detect{|k,v| v.nil?}}
      end
      
      def array_of_strings?(results)
        results.is_a?(Array) && results.first.is_a?(String)
      end
      
      def nested_result_set?(results)
        results.is_a?(Array) && results.first && results.first.values.first.is_a?(Array)
      end
      
      def wants_current_url?(method_name)
        method_name == :current_url
      end
      
      def missing_required_results?(method_name, *args)
        if has_result_definition?(*args)
          result = extract_result(method_name, *args)
          return result.compact.empty? && args.last[:required]
        end
      end

      def drop_empty_result?(method_name, *args)
        if has_result_definition?(*args)
          result = extract_result(method_name, *args)
          return result.compact.empty? && args.last[:remove_blank]
        end
      end
      
      def result_node?(method_name, *args)
        if has_result_definition?(*args)
          result = extract_result(method_name, *args)
          return true if result.size < 2
        end
      end
      
      def result_set?(method_name, *args)
        result = extract_result(method_name, *args)
        return true if has_result_definition?(*args) && result.size > 1
      end
      
      def reset_required_failure!
        @required_failure = false
      end
      
      def required_failure!
        clear_results!
        @required_failure = true
      end
      
      def required_failure?
        @required_failure ||= false
      end

      def has_result_definition?(*args)
        return false if args.empty?
        return true if args.first == "current_url"
        return true if args.first.is_a?(Array) && args.first.first.match(%r{(^//)|(^/[a-zA-Z])|(^\./)})
        args.first.match(%r{(^//)|(^/[a-zA-Z])|(^\./)})
      end
      
      def process_proc(string_input, proc)
        begin
          string_input = proc.call(string_input) if proc
        rescue
        end
        string_input
      end
      
      def merge_elements?(locator)
        return false if locator.is_a?(Array)
        locator.match(%r{/\*$})
      end
      
      def clean_xpath(xpath)
        xpath = xpath.sub(%r{^\./},"//").gsub(%r{/tbody},"")
        xpath = xpath.sub(%r{^/([a-zA-Z])},"/html/body/\\1") if in_block?
        xpath
      end
  end
end
