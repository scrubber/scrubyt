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
  table do
    row :generalize => true do
      value '1', :generalize => true 
    end.ensure_presence_of_pattern('value')
  end
end
    

  
  
table_data.to_xml.write($stdout, 1)
#puts table_data.table[1].row[0].value[0].to_text
Scrubyt::ResultDumper.print_statistics(table_data)  

#table_data.export(__FILE__)
