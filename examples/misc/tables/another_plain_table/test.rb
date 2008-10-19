$:.unshift File.join(File.dirname(__FILE__), '../../../../lib')

require 'scrubyt'

#Example of:
#  - using a regexp pattern
#
#Goal:      Extract the numbers one by one from the pattern 'cell'
#Solution:  Add a regexp pattern to the pattern 'cell'. 

table_data = Scrubyt::Extractor.define do
  #Perform the action(s)
  fetch File.join(File.dirname(__FILE__), "input.html")
  #Construct the wrapper
  table do
    row :generalize => true do
      cell '1, 2, 3', :generalize => true do
        numbers /\d+/
      end
    end
  end
end

table_data.to_xml.write($stdout, 1)
Scrubyt::ResultDumper.print_statistics(table_data)
