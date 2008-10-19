$:.unshift File.join(File.dirname(__FILE__), '../../../lib')

require 'scrubyt'

extractor = Scrubyt::Extractor.define do
  fetch File.join(File.dirname(__FILE__), "input.html")

  root '//table' do
    parent '/tr[2]', :generalize=>false do
      name '/td'
      child '../tr[1]', :example_type=>:xpath, :generalize=>false, :type=>:tree do
        name './td'
      end
    end
  end
end

extractor.to_xml.write($stdout, 1)