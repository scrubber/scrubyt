$:.unshift File.join(File.dirname(__FILE__), '../../../../lib')

require 'scrubyt'

compo_data = Scrubyt::Extractor.define do
   fetch(File.join(File.dirname(__FILE__),'compound.html'))
   
   para({:contains => 'said'}, :generalize => false)
end

compo_data.to_xml.write($stdout,1)
