require 'rexml/document'
module Skimr
  class Extractor
    
    attr_accessor :options, :previous_url, :previous_base_path, 
                  :previous_page, :previous_path, :previous_query,
                  :agent_doc, :current_form, :detail

    def initialize(options = {}, &extractor_definition)
      defaults = { :agent => :standard,
                   :output => :hash,
                   :child => true,
                   :log => nil,
                   :log_level => :info }
      @options = defaults.merge(options)
      setup_agent
      clear_results!
      @detail = {}
      @detail_definition = []
      @log = @options[:log]
      log("initialized_extractor") unless options[:child]
      if @options[:file] && !options[:child]
        @options[:file].write "<root>"
      end
      instance_eval(&extractor_definition)
      if @options[:file] && !options[:child]
        @options[:file].write "</root>"
        clear_results!
      end
      log("finished_extractor") unless options[:child]
    end
    
    def results
      @results.flatten
    end
    
    private    
      def log(event, output = nil)
        @log.log(event, output) if @log
      end
      
      def method_missing(method_name, *args, &block)
        return fetch_next(method_name, *args, &block) if next_page?(method_name)
        return fetch_detail(method_name, *args, &block) if detail_block?(method_name, *args, &block)        
        return @results << extract_detail(method_name, *args, &block) if result_block?(&block)
        return required_failure! if missing_required_results?(method_name, *args)
        unless required_failure?
          return save_result(:current_url, previous_url) if wants_current_url?(method_name)
          return if drop_empty_result?(method_name, *args)
          return save_result(method_name, extract_result(method_name, *args)) if result_node?(method_name, *args)
          return save_result(method_name, extract_result(method_name, *args)) if result_set?(method_name, *args)
          super
        end
      end
            
      def save_result(name, result)
        log("save_result", "#{name}: #{result}") if @options[:log_level] == :debug        
        if @options[:file]
          result.each do |r| 
            xml_node = REXML::Element.new name.to_s
            xml_node.text = r
            @options[:file].write xml_node.to_s
          end
        else
          @results << {} unless @results.first
          if result.is_a?(Array) && result.size > 1
            @results << result.map{|r| {name => r} }
          elsif result.is_a?(Array)
            @results.first[name] = result.first
          else
            @results.first[name] = result
          end
        end
        clear_current_result!
      end
      
      def next_page?(method_name)
        method_name == :next_page
      end
      
      def detail_block?(method_name, *args, &block)
        if method_name.to_s =~ /_detail$/
          @detail_definition = [method_name, args.clone, block]
          true
        end
      end
      
      def result_block?(&block)
        ! block.nil?
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
    
      def fetch(url)
        sleep(@options[:rate_limit]) if @options[:rate_limit]
        full_url = resolve_url(url)
        log("fetch", full_url)
        @agent_doc = @agent.get(full_url)
        store_url_helpers(@agent_doc.uri.to_s)
      rescue WWW::Mechanize::ResponseCodeError => err
      rescue EOFError
      end
      
      def fetch_next(result_name, *args, &block)        
        #TODO: Refactor the commonality between this and extract_result & fetch
        reset_required_failure!
        clear_current_result!
        locator = args.shift
        options = args.first || {}
        options[:limit] ||= 500
        options[:limit].times do
          link = parsed_doc.search(locator).first
          if link
            url = get_value(link, attribute(options))
            url = process_proc(url,options[:script])
            log("fetch_next_page", url)
            fetch(url)
            reset_page_state!
            fetch_detail(@detail_definition[0], *@detail_definition[1], &@detail_definition[2])  
          end
        end        
      rescue ArgumentError
        raise RuntimeError.new("You need to specify a detail page before being able to navigate to a next link")
      end
      
      def fetch_detail(result_name, *args, &block)
        #TODO: Refactor the commonality between this and extract_result & fetch
        reset_required_failure!
        clear_current_result!
        locator = args.shift
        all_required = args.first && args.first[:required] == :all
        parsed_doc.search(locator).each do |element|
          url = get_value(element, attribute(args))
          full_url = resolve_url(url)
          result_name = result_name.to_s.gsub(/_detail$/,"").to_sym
          if @options[:file]
            @options[:file].write "<#{result_name.to_s}>"
          end
          detail_result = Extractor.new(@options.merge(:url => full_url), &block).results
          if should_return_result?(detail_result, all_required)
            @results << { result_name => detail_result } 
          end
          if @options[:file]
            @options[:file].write "</#{result_name.to_s}>"
            clear_results!
          end
        end        
      end
      
      def extract_detail(result_name, *args, &block)
        locator = args.flatten.shift
        parsed_doc.search(locator).map do |element|
          { result_name => Extractor.new(@options.merge(:body => element.to_s), &block).results }
        end
      end
      
      def submit(*args)
        log("submit")
        ## TODO: Needs better structure and readability
        if args.last.is_a?(Hash)
          form_name = args.last[:form_name]
        end
        if args.first.is_a?(String)
          button_name = args.first
        end
        ## TODO: make it clearer why we are finding form
        find_form(form_name) if form_name
        fix_form_action
        ## TODO: make it clearer why we are finding a button
        button = current_form.buttons.detect{|b| b.value == "Submit"} if button_name
        @agent_doc = @agent.submit(current_form, button)
        store_url_helpers(@agent_doc.uri.to_s)
        reset_page_state!
      end
      
      def fill_textfield(field_name, value, options ={})
        log("form_textfield", "#{field_name}: #{value}") if @options[:log_level] == :debug
        @current_form, field = find_form_element(field_name, options)
        field.value = value
      end
      
      def select_option(field_name, option_text, options ={})
        log("form_select_option", "#{field_name}: #{option_text}") if @options[:log_level] == :debug
        @current_form, field = find_form_element(field_name, options)
        find_select_option(field, option_text).select
      end
      
      def find_select_option(select, option_text)
        select.options.detect{|o| o.text == option_text}
      end
      
      def find_form_element(field_name, options)
        @agent_doc.forms.map do |form|
          ## TODO: Make it clearer why we are trying to skip next early
          next if !options[:form].nil? && form.name != options[:form]
          if field = form.field(field_name)
            [form, field]
          else
            false
          end
        end.detect{|x| x }
      end
      
      def resolve_url(url)
        ## TODO: See if we can pass the when clauses into methods
        ## to make it more descriptive of intention
        case url
        when %r{^http[s]*:}
          return url
        when %r{^/}
          return previous_base_path + url
        when %r{^\.}
          ## TODO: What the hell is this equality match checking? More desc
          if previous_base_path.sub(%r{/$},"") == previous_path.sub(%r{/$},"")
            return previous_base_path + url.sub(%r{^(../)*}, "/")
          end
          return previous_path + url
        when /^\?/
          return previous_page + url
        when /^\&/
          return previous_page + "?" + replace_querystring_values(url)
        else
          previous_path + url
        end
      end
      
      def replace_querystring_values(url)
        new_querystring = previous_query
        url.split("&").each do |param|
          if !param.empty?
            key, value = param.split("=")
            ## TODO: What are we trying to match here? When do we end in the else?
            if new_querystring.match(%r{#{key}=[^&]*})
              new_querystring.gsub!(%r{#{key}=[^&]*},"#{key}=#{value}")
            else
              new_querystring += "&#{key}=#{value}"
            end
          end
        end
        new_querystring
      end
      
      def store_url_helpers(url)
        @previous_url = url
        @previous_page = url.match(/[^\?]*/)[0]
        @previous_query = nil
        # TODO: If URL match that why?
        @previous_query = url.match(/\?(.*)/)[1] if url.match(/\?(.*)/)
        @previous_base_path = url.match(%r{.*://[^/]*})[0]
        @previous_path = url.match(%r{.*/})[0]
      end
      
      def find_form(form_name)
        @current_form = @agent_doc.forms.detect{|f| f.name == form_name }
      end
      
      def current_form
        return @current_form unless @current_form.nil?
        @current_form = @agent_doc.forms.detect{|f| f}
      end
      
      def parsed_doc
        @parsed_doc ||= Hpricot(@agent_doc.body)
        rescue NoMethodError
          @parsed_doc = Hpricot("")
      end
    
      def setup_agent
        case @options[:agent]
        when :standard
          log("initialize_agent", "mechanize")
          require "mechanize"
          Hpricot.buffer_size = 262144
          @agent = WWW::Mechanize.new
        end
        ## TODO: Clearer distinction between requesting url and processing body for detail
        if @options[:url]
          fetch(@options[:url]) 
        elsif @options[:body]
          @parsed_doc = Hpricot(@options[:body])
        end
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
            
      def clear_current_result!
        @current_result = nil
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
        ## TODO: Consider making a missing_a_result?()
        return false if (all_required && result.reject!{|fields| fields.reject!{|k,v| v.nil?}})
        true
      end
      
      def fix_form_action
        current_form.action = resolve_url(current_form.action)
      end
      
      def reset_page_state!
        @current_form = nil
        @parsed_doc = nil
      end
      
      def clear_results!
        @results = []
      end
  end
end