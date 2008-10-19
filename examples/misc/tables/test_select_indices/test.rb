$:.unshift File.join(File.dirname(__FILE__), '../../../../lib')

require 'scrubyt'

#Example of:
#  - Extracting every td from a table 
#  - Using the :generalize option
#  
#Goal:      Extract every td from all tables on the page
#
#Solution:  Since by default only the root child(ren) of the extractor
#           is/are generalized, and we need every <td> in every <tr>, we 
#           need to generalize the patterns that extracted them, too. 
#           To achieve this, use the the :generalize option as shown below!
#

table_data = Scrubyt::Extractor.define do
  #Perform the action(s)
  fetch File.join(File.dirname(__FILE__), "input.html")
  #Construct the wrapper
  row do
    (item 'item 1/1', :generalize => true).select_indices(:every_third)
    (link 'good item 1/2', :generalize => true).select_indices(:every_fourth)
  end
end
    

  
  
table_data.to_xml.write($stdout, 1)
#puts table_data.table[1].row[0].value[0].to_text
Scrubyt::ResultDumper.print_statistics(table_data)  

#table_data.export(__FILE__)

=begin
  <root>
    <row>
      <item>item 1/1</item>
      <item>item 2/1</item>
      <item>item 3/1</item>
      <item>item 4/1</item>
    </row>
  </root>

  <root>
    <row>
      <link>item 1/1</link>
      <link>good item 2/2</link>
      <link>crap</link>
    </row>
  </root>
=end

  