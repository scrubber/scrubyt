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
        unless in_detail_block?
          notify(:save_results, name, @results)          
        end
        clear_current_result!
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
          matching_elements = parsed_doc.search(locator)
          return merge_elements(matching_elements, options[:script]) if merge_elements?(locator)
          matching_elements.each do |element|
            result = get_value(element, attribute(options, :text))
            results << process_proc(result, options[:script])
          end
        end
        ## Deals with XPath not always matching nth child properly. Look into
        ## A better solution
        return @current_result = [results.first] if locator.match(%r{\[1\]$})
        ## Shortcut to return the last sibling element 
        return @current_result = [results.last] if locator.match(%r{\[-1\]$})
        ## Return a limited resultset
        return @current_result = results[0...options[:limit]] if options[:limit]
        ## Return only non-nil/empty results. Look at porting rails #blank?
        return @current_result = results.compact.reject{|r| r == ""} if options[:required]
        @current_result = results
      end     
      
      def extract_detail(result_name, *args, &block)
        locator = args.flatten.shift
        parsed_doc.search(locator).map do |element|
          child_extractor_options = @options.merge(:body => element.to_s,
                                                   :detail => true)
          { result_name => Extractor.new(child_extractor_options, &block).results }
        end
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
        options[:attribute] || default
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
        !args.empty? && (args.first.match(%r{//}) || args.first == "current_url")
      end
      
      def process_proc(string_input, proc)
        begin
          string_input = proc.call(string_input) if proc
        rescue
        end
        string_input
      end
      
      def merge_elements?(locator)
        locator.match(%r{/\*$})
      end
  end
end
