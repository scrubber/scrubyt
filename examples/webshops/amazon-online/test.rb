$:.unshift File.join(File.dirname(__FILE__), '../../..//lib')

require 'scrubyt'

#Example of:
#  - Simple amazon book extraction, nothing special
#  It seems that Hpricot (currently 0.4.99) somehow fails to parse
#  amazon com correctly, so this example does not really work as it should
#  at the moment
#  
#Goal:     For every book, extract it's name and it's price
#  
#Solution  Simple Extractor with a 'book' pattern which has 'title' and 'price' 
#          child patterns 


ruby_books = Scrubyt::Extractor.define do
  #Go to amazon.com
  fetch           'http://www.amazon.com'
  #Type 'ruby' into the search textfield
  fill_textfield  'field-keywords', 'ruby'
  #Submit the search
  submit
  click_link 'Books'
  
  #book do
    title "Programming Ruby: The Pragmatic Programmers' Guide, Second Edition"
  #  price "$29.67"
  #end  
end

ruby_books.to_xml.write($stdout, 1)
Scrubyt::ResultDumper.print_statistics(ruby_books)  

