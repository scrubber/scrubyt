$:.unshift File.join(File.dirname(__FILE__), '../../..//lib')

require 'scrubyt'

#Example of:
#  An ebay scenario
#  - navigate to the page of interest by filling a search filed and further 
#    narrowing the results by clicking on the 'Apple iPod' link
#  - extract the name and the price of all the items
#  - crawl to the next page
#  
#Goal:     For every webshop item on the page, extract it's name and it's price.
#          Please see the other examples if this is not yet clear how to do and
#          why to do so.
#  
#Solution: Please see the other examples if this is not yet clear how to do and
#          why to do so.
ebay_data = Scrubyt::Extractor.define do
  fetch 'http://www.ebay.com/'
  fill_textfield 'satitle', 'ipod'
  submit
  click_link 'Apple iPod'
  
  record do
    item_name 'New! Apple 4GB Blue iPod Nano MP3 Photo Music Player'
    price '$189.99'
  end
end

ebay_data.to_xml.write($stdout, 1)
Scrubyt::ResultDumper.print_statistics(ebay_data)
ebay_data.export(__FILE__)
