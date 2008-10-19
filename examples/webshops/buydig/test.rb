$:.unshift File.join(File.dirname(__FILE__), '../../..//lib')

require 'scrubyt'

#Example of:
#  Yet another webshop scenario - extract the name and the price of all the items
#  - narrow the result set by using the ensure_presence_of_ancestor_node constraint
#  
#Goal:     For every webshop item on the page, extract it's name and it's price.
#          Since the heuristics matches also some unneeded things, lock those
#          out by observing the source and going for a constraint - concreely
#          ensure_presence_of_ancestor_node.
#  
#Solution: Specify the examples as usual. After running the extractor for the
#          first time, we can observe that the good results are inside a <span>
#          tag which has a 'searchProductBuy' attribute - use this fact to 
#          distinguish the relevant results

camera_data = Scrubyt::Extractor.define do
  #Perform the action(s)
  fetch File.join(File.dirname(__FILE__), "input.html")
  #Construct the wrapper    
  item do
    item_name "Canon Vertical Battery Grip BG-E3 For EOS Digital Rebel XT"
    price "$179.00"
  end.ensure_presence_of_ancestor_node :span, 'class' => 'searchProductBuy'
end
  
camera_data.to_xml.write($stdout, 1)
Scrubyt::ResultDumper.print_statistics(camera_data)  

