$:.unshift File.join(File.dirname(__FILE__), '../../..//lib')

require 'scrubyt'

#Example of:
#  - Barnes and Noble book extraction scenario
#  I did this example instead of amazon, because that's not 
#  correctly parsable with the current version (0.5) of Hpricot
#  
#Goal:     For every book, extract it's name and it's price.
#          Since some books's prices are at a different XPath,
#          need to define two examples to capture every possibility.
#  
#Solution: Simple Extractor with a 'book' pattern which has 'title' and 'price' 
#          child patterns, with multiple examples.
#          Crawling is also involved - all the records are wrapped this way!


b_and_n_data = Scrubyt::Extractor.define do
  fetch File.join(File.dirname(__FILE__), "_finewines.html")
  
  record do
    wine_name 'LE CLOS JORDANNE LE CLOS JORDANNE VINEYARD CHARDONNAY  2004', 'CAVE SPRING GAMAY RESERVE  2004', 'CLOS PEGASE MITSUKOS VINEYARD CHARDONNAY  2005'
    price '$35', '$19.95', '$32.95'
  end.ensure_presence_of_pattern('price')
end

b_and_n_data.to_xml.write($stdout, 1)
Scrubyt::ResultDumper.print_statistics(b_and_n_data)
b_and_n_data.export(__FILE__)