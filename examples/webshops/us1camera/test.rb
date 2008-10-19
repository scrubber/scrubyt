$:.unshift File.join(File.dirname(__FILE__), '../../..//lib')

require 'scrubyt'

#Example of:
#  Yet another webshop scenario 
#  - extract the name and the price of all the items, 
#    as well as the url pointing to the item image.
#  - narrow the result set by using the ensure_absence_of_ancestor_node constraint
#  
#Goal:     For every webshop item on the page, extract it's name and it's price
#          and the url of the image. To achieve the last one, use a combination
#          of an image pattern and an attribute pattern.
#          Since the heuristics matches also some unneeded things, lock those
#          out by observing the source and going for a constraint - concreely
#          ensure_absence_of_ancestor_node. The constraint uses a list of attribute
#          values
#  
#Solution: Specify the examples as usual. After running the extractor for the
#          first time, we can observe that the wrongly matched results are inside 
#          an <a> tag which has a 'class' attribute  with values either srNewCat
#          or srNewMfg - use this fact to distinguish the relevant results.
camera_data = Scrubyt::Extractor.define do
  #Perform the action(s)
  fetch File.join(File.dirname(__FILE__), "input.html")
  #Construct the wrapper
  item do
    image "1_files/Images50.gif" do
      image_src "src", :type => :attribute
    end
    item_name "Canon EOS 20D SLR Digital Camera (Lens sold separately)"
    price "$1,123.77"
  end.ensure_absence_of_ancestor_node :a, :class => ['srNewCat', 'srNewMfg']
end
  
camera_data.to_xml.write($stdout, 1)
Scrubyt::ResultDumper.print_statistics(camera_data) 
