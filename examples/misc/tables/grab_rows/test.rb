$:.unshift File.join(File.dirname(__FILE__), '../../../../lib')

require 'scrubyt'

#Example of:
#  - Extracting some (specific) rows from a table
#  - Using the :generalize option
#  - Using the select_indices function
#  
#Goal:      Extract the first, 4th, 5th and last row from the input table
#
#Solution:  Since by default only the root child(ren) of the extractor
#           is/are generalized, and we need every <tr> (so we can select the ones we need)
#           we have to set :generalize => true. 
#           Once we have all the indices, we select the relevant ones with the 'select_indices' 
#           function. 

table_data = Scrubyt::Extractor.define do
  #Perform the action(s)
  fetch File.join(File.dirname(__FILE__), "input.html")
  #Construct the wrapper
  table do
    row :generalize => true do
      value('1', :generalize => true).select_indices([3..4, :first,:last])
    end
  end
end
  
table_data.to_xml.write($stdout, 1)
Scrubyt::ResultDumper.print_statistics(table_data)  
