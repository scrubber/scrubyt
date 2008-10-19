$:.unshift File.join(File.dirname(__FILE__), '../../../../lib')

require 'scrubyt'

#Example of:
#  - Extracting every td from a table 
#  - Using the :generalize option
#  - Crawling to 2 next pages
#  
#Goal:      Extract every td from every table on the page, and also from
#           2 other pages linked to this document by a 'next' link
#
#Solution:  This example is very similar to the 'plain_table' one (so I will
#           not describe what's going on there once more) with one exception -
#           crawling to the next 2 pages. This is achieved by the 'next_page' 
#           idiom.
#

ambigous_data = Scrubyt::Extractor.define do
  #Perform the action(s)
  fetch File.join(File.dirname(__FILE__), "input.html")
  #Construct the wrapper
  table do
    row :generalize => true do
      value '1', :generalize => true 
    end
  end
  next_page "Next"
end

  ambigous_data.to_xml.write($stdout, 1)

