$:.unshift File.join(File.dirname(__FILE__), '../../../../lib')

require 'scrubyt'

#Example of:
#  - Sepecyfying multiple examples
#  - Narrowig the results by requiring the presence of some patterns
#  
#Goal:      We want to extract all movies, containing their title and their
#           main_character. Moreover, we need only those movies which
#           have both the title and the main_character specified
#
#Solution:  See the ambigous_records example on why to use multiple examples.
#           Use the ensure_presence_of_pattern constraint to extract only 
#           those movies which have child patterns named 'title' and
#           'main_character'

table_data_comp = Scrubyt::Extractor.define do
  #Perform the action(s)
  fetch File.join(File.dirname(__FILE__), "input.html")
  #Construct the wrapper
    movie do
      title 'The Matrix', 'Kill Bill'
      main_character 'Neo', 'The Bride'
    end.ensure_presence_of_pattern('title').
        ensure_presence_of_pattern('main_character')          
end
  
table_data_comp.to_xml.write($stdout, 1)
Scrubyt::ResultDumper.print_statistics(table_data_comp)
