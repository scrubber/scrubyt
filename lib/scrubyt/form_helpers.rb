module Scrubyt
  module Navigation   
    module FormHelpers
   
      private
        def find_form(form_name)
          @current_form = @agent_doc.forms.detect{|f| f.name == form_name }
        end        

        def submit(*args)
          notify(:submit)
          if supplied_form_name?(args)
            find_form(form_name(args)) 
          elsif supplied_button_xpath?(args)
            xpathed_button = parsed_doc.search(args.first).first
            @current_form = @agent_doc.forms.detect{|f| f.buttons.detect{|b| b.name == xpathed_button["name"] && b.value == xpathed_button["value"]}}
            button = @current_form.buttons.detect{|b| b.name == xpathed_button["name"] && b.value == xpathed_button["value"]}
          end
          fix_form_action
          button ||= find_button(args)
          @agent_doc = @agent.submit(current_form, button)
          store_url_helpers(@agent_doc.uri.to_s)
          reset_page_state!
        end

        def form_name(options)        
          options.last[:form_name] if supplied_form_name?(options)  
        end

        def supplied_form_name?(options)
          options.is_a?(Array) && options.last.is_a?(Hash) && options.last.has_key?(:form_name)
        end

        def supplied_button_name?(options)
          options.first.is_a?(String)
        end
        
        def supplied_button_xpath?(options)
          options.first.is_a?(String) && options.first =~ %r{^//[a-zA-Z]}
        end

        def button_name(options)
          options.first if supplied_button_name?(options)
        end

        def find_button(options)
          if supplied_button_name?(options)
            button_text = options.first
            current_form.buttons.detect{|b| b.value == button_text}
          end
        end

        def fill_textfield(field_name, value, options ={})
          notify(:fill_textfield, field_name, value, options)
          @current_form, field = find_form_element(field_name, options)
          field.value = value
        end

        def select_option(field_name, option_text, options ={})          
          notify(:select_option, field_name, option_text, options)
          @current_form, field = find_form_element(field_name, options)
          find_select_option(field, option_text).select
        end

        def find_select_option(select, option_text)
          select.options.detect{|o| o.text == option_text}
        end

        def find_form_element(field_name, options)
          fields = @agent_doc.forms.map do |form|
            next if not_our_form?(form, options[:form])
            if field = form.field(field_name)
              [form, field]
            end
          end
          fields.compact!
          fields.first
        end

        def not_our_form?(form, form_name = nil)
          !form_name.nil? && form.name != form_name
        end
    end
  end
end