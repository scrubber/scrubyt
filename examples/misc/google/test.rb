$:.unshift File.join(File.dirname(__FILE__), '../../../lib')

require 'scrubyt'

#The compulsory google example :) 
#Don't you have the feeling that a google.com example in web programming 
#is becoming something like 'Hello World' in desktop programming?
#
#Example of:
#  - filling and submitting a textfield
#  - using a href attribute
#  - recursively crawling to the next page(s)
#  
#Goal:       Go to google.com. Enter 'ruby' into the search textfield and
#            submit the form. Extract the url of the first 20 pages.
#Solution:   Use the navigational commands 'fetch', 'fill_textfield', 'submit'
#            to navigate to the page of interest. There, extract the links with 
#            the pattern 'link'. The URLs should be extracted with 'link''s child
#            pattern, 'url' which is an attribute pattern.
#            This will extract the first 10 results, but you need the first 20.
#            To achieve this, the 'next_page' idiom should be used, with :limit set
#            to 2.

google_data = Scrubyt::Extractor.define do
  #Perform the action(s)
  fetch 'http://www.google.com/ncr'
  fill_textfield 'q', 'ruby'
  submit
  #Construct the wrapper
  link "Ruby Programming Language" do
    url "href", :type => :attribute                   
  end
  next_page "Next", :limit => 2
end

google_data.to_xml.write($stdout, 1)
Scrubyt::ResultDumper.print_statistics(google_data)


