$:.unshift File.join(File.dirname(__FILE__), '../../..//lib')

require 'scrubyt'

#Example of:
#  - Simple offline amazon book extraction, nothing special
#  What is maybe interesting here, opposed to the on-line version is that this
#  actually works - for some reason, it is parsed correctly when loaded from an
#  offline file. It seems that Hpricot (currently 0.4.99) somehow fails to parse
#  amazon com correctly
#
#Goal:     For every book, extract it's name and it's price
#
#Solution  Simple Extractor with a 'book' pattern which has 'title' and 'price'
#          child patterns

amazon_books = Scrubyt::Extractor.define do
  #Perform the action(s)
  fetch File.join(File.dirname(__FILE__), "002-8212888-3924065.html")
  #Construct the wrapper
  book do
    title "Programming Ruby: The Pragmatic Programmers' Guide, Second Edition"
    price "$24.72"
  end.ensure_presence_of_pattern("title")
end

amazon_books.to_xml.write($stdout, 1)
