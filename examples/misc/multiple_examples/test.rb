$:.unshift File.join(File.dirname(__FILE__), '../../../lib')

require 'scrubyt'

#Example of:
#Goal:       
#Solution:

multiple_example_data = Scrubyt::Extractor.define do
  fetch File.join(File.dirname(__FILE__), "input.html")
  
  first_info 'However, we would like to match this paragraph, and also the following span: ' do
    additional_info 'hi there!'
  end
end

multiple_example_data.to_xml.write($stdout, 1)
multiple_example_data.export(__FILE__)
Scrubyt::ResultDumper.print_statistics(multiple_example_data)



