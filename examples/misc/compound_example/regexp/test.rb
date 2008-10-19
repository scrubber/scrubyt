$:.unshift File.join(File.dirname(__FILE__), '../../../..lib')

require 'scrubyt'

compo_data = Scrubyt::Extractor.define do
   fetch(File.join(File.dirname(__FILE__),'regexp_compound.html'))
   
   para({:contains => /11\d+/}, :generalize => false)
end

compo_data.to_xml.write($stdout,1)
