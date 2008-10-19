$: << File.join(File.dirname(__FILE__), '../../../lib')
require 'scrubyt'
include Scrubyt

data = Extractor.define do
  fetch 'input.html'
  
  stuff 'Identical example/@index'#, :generalize => false
end


data.to_xml.write($stdout,1)
data.show_stats
data.export(__FILE__)
