$: << File.join(File.dirname(__FILE__), '../../../lib')
require 'scrubyt'
include Scrubyt

data = Extractor.define do
  fetch 'input.html'
  
  stuff 'Identical example[2]', :generalize => false do
    index 'index', :type => :attribute 
  end
end


data.to_xml.write($stdout,1)
data.export(__FILE__)
