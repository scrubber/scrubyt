module Scrubyt
  ##
  #=<tt>Describing actions which interact with the page</tt>
  #
  #This class contains all the actions that are used to navigate on web pages;
  #first of all, *fetch* for downloading the pages - then various actions
  #like filling textfields, submitting formst, clicking links and more
  module NavigationActions
    
    def self.extend_object(obj)
      super(obj)
      obj.instance_eval do
        @current_form = nil
      end
    end
    
    ##
    #Action to fill a textfield with a query string
    #
    ##*parameters*
    #
    #_textfield_name_ - the name of the textfield (e.g. the name of the google search
    #textfield is 'q'
    #
    #_query_string_ - the string that should be entered into the textfield
    def fill_textfield(textfield_name, query_string)
      FetchAction.fill_textfield(textfield_name, query_string)
    end
    
    ##
    #Action to fill a textarea with text
    def fill_textarea(textarea_name, text)
      FetchAction.fill_textarea(textarea_name, text)
    end
    
    ##
    #Action for selecting an option from a dropdown box
    def select_option(selectlist_name, option)
      FetchAction.select_option(selectlist_name, option)
    end
    
    def check_checkbox(checkbox_name)
      FetchAction.check_checkbox(checkbox_name)
    end
    
    def check_radiobutton(checkbox_name, index=0)
      FetchAction.check_radiobutton(checkbox_name, index=0)
    end
    
    ##
    #Fetch the document
    def fetch(*args)
      FetchAction.fetch(*args)
    end
    ##
    #Submit the current form
    def submit(index=nil, type=nil)
      FetchAction.submit(index, type)
    end
    
    ##
    #Click the link specified by the text
    def click_link(link_spec,index=0, sleep_secs=0)
      FetchAction.click_link(link_spec,index, sleep_secs)
    end
    
    def click_link_and_wait(link_spec, sleep_secs=0)
      FetchAction.click_link(link_spec, 0, sleep_secs)      
    end
    
    def click_by_xpath(xpath)
      FetchAction.click_by_xpath(xpath)
    end
    
    def click_image_map(index=0)
      FetchAction.click_image_map(index)
    end
    
    def wait(time=1)
      FetchAction.wait(time)
    end
  end
end