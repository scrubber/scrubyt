$:.unshift File.join(File.dirname(__FILE__), '../../../lib')

require 'scrubyt'

result = Scrubyt::Extractor.define do
  fetch          'index.html'

  stuff 'detail link!' do
    stuff_detail do
      other_stuff 'Here is one detail paragraph!'
    end
  end

end

puts result.to_xml
result.export('test')