require 'rubygems'
require 'firewatir'
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
    module Firewatir

      def self.included(base)
        base.module_eval do 
          @@agent = FireWatir::Firefox.new
          @@current_doc_url = nil
          @@current_doc_protocol = nil
          @@base_dir = nil
          @@host_name = nil
          @@history = []
          @@current_form = nil

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
              resolve = args[0][:resolve]
              basic_auth = args[0][:basic_auth]
              #Refactor this whole stuff as well!!! It looks awful...
              parse_and_set_basic_auth(basic_auth) if basic_auth
            else
              mechanize_doc = nil
              resolve = :full
            end

            @@current_doc_url = doc_url
            @@current_doc_protocol = determine_protocol
            if mechanize_doc.nil?
              handle_relative_path(doc_url) unless @@current_doc_protocol == 'xpath'
              handle_relative_url(doc_url, resolve)
              Scrubyt.log :ACTION, "fetching document: #{@@current_doc_url}"
              case @@current_doc_protocol
                when 'file': @@agent.goto("file://"+ @@current_doc_url)
                else @@agent.goto(@@current_doc_url)
              end
              @@mechanize_doc = "<html>#{@@agent.html}</html>"
            else
              @@mechanize_doc = mechanize_doc
            end
            @@hpricot_doc = Hpricot(PreFilterDocument.br_to_newline(@@mechanize_doc))
            store_host_name(@@agent.url)   # in case we're on a new host
          end

          ##
          #Submit the last form;
          def self.submit(current_form, button=nil, type=nil)
            @@agent.element_by_xpath(@@current_form).submit
            @@agent.wait
            @@current_doc_url = @@agent.url
            @@mechanize_doc = "<html>#{@@agent.html}</html>"
            @@hpricot_doc = Hpricot(PreFilterDocument.br_to_newline(@@mechanize_doc))
          end

          ##
          #Click the link specified by the text
          def self.click_link(link_spec,index = 0,wait_secs=0)
            Scrubyt.log :ACTION, "Clicking link specified by: %p" % link_spec
            if link_spec.is_a?(Hash)
              elem = XPathUtils.generate_XPath(CompoundExampleLookup.find_node_from_compund_example(@@hpricot_doc, link_spec, false, index), nil, true) 
              result_page = @@agent.element_by_xpath(elem).click
            else
              @@agent.link(:innerHTML, Regexp.escape(link_spec)).click
            end            
            sleep(wait_secs) if wait_secs > 0
            @@agent.wait
            @@current_doc_url = @@agent.url
            @@mechanize_doc = "<html>#{@@agent.html}</html>"
            @@hpricot_doc = Hpricot(PreFilterDocument.br_to_newline(@@mechanize_doc))
            Scrubyt.log :ACTION, "Fetching #{@@current_doc_url}"
          end          

          def self.click_by_xpath(xpath)
            Scrubyt.log :ACTION, "Clicking by XPath : %p" % xpath        
            @@agent.element_by_xpath(xpath).click
            @@agent.wait
            @@current_doc_url = @@agent.url
            @@mechanize_doc = "<html>#{@@agent.html}</html>"
            @@hpricot_doc = Hpricot(PreFilterDocument.br_to_newline(@@mechanize_doc))
            Scrubyt.log :ACTION, "Fetching #{@@current_doc_url}"            
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
            @@host_name = doc_url.match(/.*\..*?\//)[0] if doc_url.match(/.*\..*?\//)
            @@original_host_name ||= @@host_name
          end #end of method store_host_name

          def self.determine_protocol
            old_protocol = @@current_doc_protocol
            new_protocol = case @@current_doc_url
              when /^\/\//
                'xpath'
              when /^https/
                'https'
              when /^http/
                'http'
              when /^www\./
                'http'
              else
                'file'
              end
            return 'http' if ((old_protocol == 'http') && new_protocol == 'file')
            return 'https' if ((old_protocol == 'https') && new_protocol == 'file')
            new_protocol
          end

          def self.parse_and_set_basic_auth(basic_auth)
            login, pass = basic_auth.split('@')
            Scrubyt.log :ACTION, "Basic authentication: login=<#{login}>, pass=<#{pass}>"
            @@agent.basic_auth(login, pass)
          end

          def self.handle_relative_path(doc_url)
            if @@base_dir == nil || doc_url[0..0] == "/"
              @@base_dir = doc_url.scan(/.+\//)[0] if @@current_doc_protocol == 'file'
            else
              @@current_doc_url = ((@@base_dir + doc_url) if doc_url !~ /#{@@base_dir}/)
            end
          end

          def self.handle_relative_url(doc_url, resolve)
            return if doc_url =~ /^(http:|javascript:)/
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
        
          def self.fill_textfield(textfield_name, query_string)
            @@current_form = "//input[@name='#{textfield_name}']/ancestor::form"
            @@agent.text_field(:name,textfield_name).set(query_string)
          end

          ##
          #Action to fill a textarea with text
          def self.fill_textarea(textarea_name, text)
            @@current_form = "//input[@name='#{textarea_name}']/ancestor::form"
            @@agent.text_field(:name,textarea_name).set(text)
          end

          ##
          #Action for selecting an option from a dropdown box
          def self.select_option(selectlist_name, option)
            @@current_form = "//select[@name='#{selectlist_name}']/ancestor::form"
            @@agent.select_list(:name,selectlist_name).select(option)
          end

          def self.check_checkbox(checkbox_name)
            @@current_form = "//input[@name='#{checkbox_name}']/ancestor::form"
            @@agent.checkbox(:name,checkbox_name).set(true)
          end

          def self.check_radiobutton(checkbox_name, index=0)
            @@current_form = "//input[@name='#{checkbox_name}']/ancestor::form"
            @@agent.elements_by_xpath("//input[@name='#{checkbox_name}']")[index].set
          end

          def self.click_image_map(index=0)
            raise 'NotImplemented'
          end
          
          def self.wait(time=1)
            sleep(time)
            @@agent.wait
          end
        end
      end   
    end
  end
end
