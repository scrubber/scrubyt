$:.unshift File.join(File.dirname(__FILE__), '../../../lib')

require 'scrubyt'

event_data = Scrubyt::Extractor.define do
  fetch File.join(File.dirname(__FILE__), "input.html")
  
  group do
    e1 'f1'
  end
end

event_data.to_xml.write($stdout, 1)
Scrubyt::ResultDumper.print_statistics(event_data)