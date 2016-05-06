require 'rubygems'
require 'mechanize'
module Scrubyt
  ##
  #=<tt>Fetching pages (and related functionality)</tt>
  #
  #Since lot of things are happening during (and before)
  #the fetching of a document, I decided to move out fetching related
  #functionality to a separate class - so if you are looking for anything
  #which is loading a document (even by submitting a form or clicking a link)
  #and related things like setting a proxy etc. you should find it here.
  module Navigation
    module Mechanize

      def self.included(base)
        base.module_eval do 
          @@agent = Mechanize::Mechanize.new
          @@current_doc_url = nil
          @@current_doc_protocol = nil
          @@base_dir = nil
          @@host_name = nil
          @@history = []

          ##
          #Action to fetch a document (either a file or a http address)
          #
          #*parameters*
          #
          #_doc_url_ - the url or file name to fetch
          def self.fetch(doc_url, *args)
            #Refactor this crap!!! with option_accessor stuff
            if args.size > 0
              mechanize_doc = args[0][:mechanize_doc]
              html = args[0][:html]
              resolve = args[0][:resolve]
              basic_auth = args[0][:basic_auth]
              parse_and_set_basic_auth(basic_auth) if basic_auth
              proxy = args[0][:proxy]
              parse_and_set_proxy(proxy) if proxy
              if html
                @@current_doc_protocol = 'string'
                mechanize_doc = page = WWW::Mechanize::Page.new(nil, {'content-type' => 'text/html'}, html) 
              end
            else
              mechanize_doc = nil
              resolve = :full
            end

            @@current_doc_url = doc_url
            @@current_doc_protocol = determine_protocol

            if mechanize_doc.nil? && @@current_doc_protocol != 'file'
              handle_relative_path(doc_url)
              handle_relative_url(doc_url, resolve)
              Scrubyt.log :ACTION, "fetching document: #{@@current_doc_url}"

              unless 'file' == @@current_doc_protocol
                @@mechanize_doc = @@agent.get(@@current_doc_url)
              end
            else
              @@mechanize_doc = mechanize_doc
            end

            if @@current_doc_protocol == 'file'
              @@hpricot_doc = Hpricot(PreFilterDocument.br_to_newline(open(@@current_doc_url).read))
            else
              @@hpricot_doc = Hpricot(PreFilterDocument.br_to_newline(@@mechanize_doc.body))
              store_host_name(self.get_current_doc_url) #if self.get_current_doc_url   # in case we're on a new host
            end
          end

          ##
          #Submit the last form;
          def self.submit(index=nil, sleep_time=nil, type=nil)
            Scrubyt.log :ACTION, 'Submitting form...'
            if index == nil
              #result_page = @@agent.submit(@@current_form)
              result_page = process_submit(@@current_form)
              #----- added by nickmerwin@gmail.com -----
            elsif index.class == String && !type.nil?
              button = @@current_form.buttons.detect{|b| b.name == index}
              #result_page = @@current_form.submit(button)
              result_page = process_submit(@@current_form, button,type)
              #-----------------------------------------
            else
              result_page = @@agent.submit(@@current_form, @@current_form.buttons[index])
            end
            @@current_doc_url = result_page.uri.to_s
            Scrubyt.log :ACTION, "Fetching #{@@current_doc_url}"
            fetch(@@current_doc_url, :mechanize_doc => result_page)
          end

          ##
          #Click the link specified by the text
          def self.click_link(link_spec,index = 0,wait_secs=0)
            Scrubyt.log :ACTION, "Clicking link specified by: %p" % link_spec
            if link_spec.is_a? Hash
              clicked_elem = CompoundExampleLookup.find_node_from_compund_example(@@hpricot_doc, link_spec, false, index)
            else
              clicked_elem = SimpleExampleLookup.find_node_from_text(@@hpricot_doc, link_spec, false, index)
            end
            clicked_elem = XPathUtils.find_nearest_node_with_attribute(clicked_elem, 'href')
            result_page = @@agent.click(clicked_elem)
            @@current_doc_url = result_page.uri.to_s
            Scrubyt.log :ACTION, "Fetching #{@@current_doc_url}"
            fetch(@@current_doc_url, :mechanize_doc => result_page)
          end

          def self.click_image_map(index = 0)
            Scrubyt.log :ACTION, "Clicking image map at index: %p" % index
            uri = @@mechanize_doc.search("//area")[index]['href']
            result_page = @@agent.get(uri)
            @@current_doc_url = result_page.uri.to_s
            Scrubyt.log :ACTION, "Fetching #{@@current_doc_url}"
            fetch(@@current_doc_url, :mechanize_doc => result_page)
          end

          def self.store_host_name(doc_url)
            @@host_name = 'http://' + @@mechanize_doc.uri.to_s.match(%r{http://(.+?)/+})[0] if @@current_doc_protocol == 'http'
            @@host_name = 'https://' + @@mechanize_doc.uri.to_s.match(%r{https://(.+?)/+})[0] if @@current_doc_protocol == 'https'
            @@host_name = doc_url if @@host_name == nil
            @@host_name = @@host_name[0..-2] if @@host_name[-1].chr == '/'
            @@original_host_name ||= @@host_name
          end #end of method store_host_name

          def self.parse_and_set_proxy(proxy)
            @@proxy_user = @@proxy_pass = nil  
            if proxy.downcase.include?('localhost')
              @@host = 'localhost'
              @@port = proxy.split(':').last
            else
              parts = proxy.split(':')
              if (parts.size > 2)
                user_pass = parts[1].split('@')
                  @@proxy_user = parts[0]
                  @@proxy_pass = user_pass[0]
                  @@host = user_pass[1]
                  @@port = parts[2]  
              else
                if (parts[0].include?('@'))
                  user_host = parts[0].split('@')
                    @@proxy_user = user_host[0]
                    @@host = user_host[1]
                    @@port = parts[1]                  
                else
                  @@host = parts[0]
                  @@port = parts[1]
                end
              end

              if (@@host == nil || @@port == nil)# !@@host =~ /^http/)
                puts "Invalid proxy specification..."
                puts "neither host nor port can be nil!"
                exit
              end
            end
            Scrubyt.log :ACTION, "[ACTION] Setting proxy: host=<#{@@host}>, port=<#{@@port}>, username=<#{@@proxy_user}>, password=<#{@@proxy_pass}>"
            @@agent.set_proxy(@@host, @@port, @@proxy_user, @@proxy_pass)
          end

          def self.determine_protocol
            old_protocol = @@current_doc_protocol
            new_protocol = case @@current_doc_url
              when /^https/
                'https'
              when /^http/
                'http'
              when /^www/
                'http'
              else
                'file'
              end
            return 'http' if ((old_protocol == 'http') && new_protocol == 'file')
            return 'https' if ((old_protocol == 'https') && new_protocol == 'file')
            new_protocol
          end

          def self.handle_relative_path(doc_url)
            if @@base_dir == nil
              @@base_dir = doc_url.scan(/.+\//)[0] if @@current_doc_protocol == 'file'
            else
              @@current_doc_url = ((@@base_dir + doc_url) if doc_url !~ /#{@@base_dir}/)
            end
          end

          def self.handle_relative_url(doc_url, resolve)
            return if doc_url =~ /^http/
            if doc_url !~ /^\//
              first_char = doc_url[0..0]
              doc_url = ( first_char == '?'  ? '' : '/'  ) + doc_url
              if first_char == '?' #This is an ugly hack... really have to throw this shit out and go with mechanize's
                current_uri = @@mechanize_doc.uri.to_s
                current_uri = @@agent.history.first.uri.to_s if current_uri =~ /\/popup\//
                if (current_uri.include? '?')
                  current_uri = current_uri.scan(/.+\//)[0]
                else
                  current_uri += '/' unless current_uri[-1..-1] == '/'
                end
                @@current_doc_url = current_uri + doc_url
                return
              end
            end
            case resolve
              when :full
                @@current_doc_url = (@@host_name + doc_url) if ( @@host_name != nil && (doc_url !~ /#{@@host_name}/))
                @@current_doc_url = @@current_doc_url.split('/').uniq.join('/')
              when :host
                base_host_name = (@@host_name.count("/") == 2 ? @@host_name : @@host_name.scan(/(http.+?\/\/.+?)\//)[0][0])
                @@current_doc_url = base_host_name + doc_url
              else
                #custom resilving
                @@current_doc_url = resolve + doc_url
            end
          end
        
          def self.fill_textfield(textfield_name, query_string, *unused)
            lookup_form_for_tag('input','textfield',textfield_name,query_string)
            if(@@current_form)
              eval("@@current_form['#{textfield_name}'] = '#{query_string}'")
            else
              Scrubyt.log :ERROR, "Couldn't find the form that contains this textfield. Please report a bug!"
            end
          end

          ##
          #Action to fill a textarea with text
          def self.fill_textarea(textarea_name, text)
            lookup_form_for_tag('textarea','textarea',textarea_name,text)
            eval("@@current_form['#{textarea_name}'] = '#{text}'")
          end

          ##
          #Action for selecting an option from a dropdown box
          def self.select_option(selectlist_name, option)
            lookup_form_for_tag('select','select list',selectlist_name,option)
            select_list = @@current_form.fields.find {|f| f.name == selectlist_name}
            searched_option = select_list.options.find{|f| f.text.strip == option}
            searched_option.click
          end

          def self.check_checkbox(checkbox_name)
            lookup_form_for_tag('input','checkbox',checkbox_name, '')
            @@current_form.checkboxes.name(checkbox_name).check
          end

          def self.check_radiobutton(checkbox_name, index=0)
            lookup_form_for_tag('input','radiobutton',checkbox_name, '',index)
            @@current_form.radiobuttons.name(checkbox_name)[index].check
          end

          #private
          def self.process_submit(current_form, button=nil, type=nil)
            if button == nil
              result_page = @@agent.submit(current_form)
            elsif type
              result_page = current_form.submit(button)
            else
              result_page = @@agent.submit(current_form, button)
            end
            #@@current_doc_url = result_page.uri.to_s
            #Scrubyt.log :ACTION, "Fetching #{@@current_doc_url}"
            #fetch(@@current_doc_url, :mechanize_doc => result_page)
            result_page
          end
          
          def self.lookup_form_for_tag(tag, widget_name, name_attribute, query_string, index=0)
            Scrubyt.log :ACTION, "typing #{query_string} into the #{widget_name} named '#{name_attribute}'"
            widget = (FetchAction.get_hpricot_doc/"#{tag}[@name=#{name_attribute}]").map()[index]
            form_tag = Scrubyt::XPathUtils.traverse_up_until_name(widget, 'form')
            puts "=" * 100            
            puts ">>#{Scrubyt::XPathUtils.generate_XPath(form_tag, nil, true)}<<"
            puts "=" * 100                   
            xp = Scrubyt::XPathUtils.generate_XPath(form_tag, nil, true)      
            form_element =  FetchAction.get_mechanize_doc/xp
            
            FetchAction.get_mechanize_doc.forms.each do |f|
              @@current_form = f
              break if f.form_node == form_element 
            end

            
            #find_form_based_on_tag(form_tag, ['name', 'id', 'action'])
          end

          def self.find_form_based_on_tag(tag, possible_attrs)
            lookup_attribute_name = nil
            lookup_attribute_value = nil

            possible_attrs.each { |a|
              lookup_attribute_name = a
              lookup_attribute_value = tag.attributes[a]
              break if lookup_attribute_value != nil
            }

            #puts lookup_attribute_name
            #puts lookup_attribute_value

            i = 0
            loop do
              @@current_form = FetchAction.get_mechanize_doc.forms[i]
              #p @@current_form.form_node
              return nil if @@current_form == nil
              #puts  ">>#{@@current_form.form_node.attributes[lookup_attribute_name].to_s}<< :: >>#{lookup_attribute_value}<<"
              break if @@current_form.form_node.attributes[lookup_attribute_name].to_s == lookup_attribute_value
              i+= 1
            end
          end
        end
      end   
    end
  end
end
