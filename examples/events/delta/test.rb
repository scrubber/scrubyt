$:.unshift File.join(File.dirname(__FILE__), '../../../lib')

require 'scrubyt'

event_data = Scrubyt::Extractor.define do
  fetch File.join(File.dirname(__FILE__), "input.html")
  
  event do
    title 'Frühlingsgefühle'
    begin_time '22.00'
    admission_fee '4,00'
  end
end

event_data.to_xml.write($stdout, 1)
Scrubyt::ResultDumper.print_statistics(event_data)