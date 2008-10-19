$:.unshift File.join(File.dirname(__FILE__), '../../../..lib')

require 'scrubyt'

compo_data = Scrubyt::Extractor.define do
   fetch(File.join(File.dirname(__FILE__),'tricky_compound.html'))
   
   para({:contains => '4, 5, 6', :begins_with => '3', :ends_with => '6'}, :generalize => false)
end

compo_data.to_xml.write($stdout,1)
