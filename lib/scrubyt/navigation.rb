require "#{File.dirname(__FILE__)}/form_helpers.rb"
module Scrubyt
  module Navigation   
    include FormHelpers
    private
      def fetch(url)
        sleep(@options[:rate_limit]) if @options[:rate_limit]
        full_url = resolve_url(url)
        notify(:fetch, full_url)        
        @agent_doc = @agent.get(full_url)
        store_url_helpers(@agent_doc.uri.to_s)
      rescue WWW::Mechanize::ResponseCodeError => err
      rescue EOFError
      end
    
      def fetch_next(result_name, *args, &block)        
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
            notify(:next_page, url)
            fetch(url)
            reset_page_state!
            fetch_detail(@detail_definition[0], *@detail_definition[1], &@detail_definition[2])
          end
        end        
      rescue ArgumentError
        raise RuntimeError.new("You need to specify a detail page before being able to navigate to a next link")
      end
    
      # fetch_detail is called when there is a detail block
      # Detail blocks accept the following options
      #   :required if set to true, will not be saved if one of the fields is missing
      #   :if takes a proc that accepts the url as argument. If the proc return falses the url is skipped
      def fetch_detail(result_name, *args, &block)
        reset_required_failure!
        clear_current_result!
        locator = args.shift
        opts = args.first || {}
        all_required = opts[:required] == :all
        parsed_doc.search(locator).each do |element|
          url = get_value(element, attribute(args))
          next if opts[:if] && !opts[:if].call(url)
          full_url = resolve_url(url)
          result_name = result_name.to_s.gsub(/_detail$/,"").to_sym
          notify(:next_detail, result_name, full_url, args)
          child_extractor_options = @options.merge(:url => full_url, 
                                                   :detail => true)
          detail_result = Extractor.new(child_extractor_options, &block).results
          if should_return_result?(detail_result, all_required)
            @results = { result_name => detail_result }
            notify(:save_results, result_name, @results)
          end
        end        
      end
      
      def resolve_url(url)
        case url
        when %r{^http[s]*:}
          return url
        when %r{^/}
          return previous_base_path + url
        when %r{^\.}
          return append_relative_path(url)
        when /^\?/
          return append_query_string(url)
        when /^\&/
          return previous_page + "?" + replace_querystring_values(url)
        else
          previous_path + url
        end
      end
      
      def append_relative_path(url)
        if previous_was_server_root?
          return previous_base_path + url.sub(%r{^(../)*}, "/")
        end
        append_path(url)
      end

      def key_already_exists?(key)
        previous_query.match(%r{#{key}=[^&]*})
      end

      def previous_was_server_root?
        previous_base_path.sub(%r{/$},"") == previous_path.sub(%r{/$},"")
      end
      
      def append_query_string(url)
        previous_page + url
      end
      
      def append_path(url)
        previous_path + url
      end
      
      def replace_querystring_values(url)
        new_querystring = previous_query
        url.split("&").each do |param|
          if !param.empty?
            key, value = param.split("=")
            if key_already_exists?(key)
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
        @previous_query = url.match(/\?(.*)/)[1] if has_query_string?(url)
        @previous_base_path = url.match(%r{.*://[^/]*})[0]
        @previous_path = url.match(%r{.*/})[0]
      end
      
      def has_query_string?(url)
        url.match(/\?(.*)/)
      end

  end
end