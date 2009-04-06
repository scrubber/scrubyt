$:.unshift File.join(File.dirname(__FILE__), '../../../lib')

require 'scrubyt'
require 'scrubyt/output/result_dumper'

#Example of: Using the next_page command with onclick='' hrefs.

### Doesn't work, as next_page doesn't click links
data = Scrubyt::Extractor.define(:agent => :firefox) do
  fetch("file://"+File.expand_path(File.join(File.dirname(__FILE__), "page_1.html")))

  entry '//div'
  
  next_page 'Next'
end

puts "First results :"
puts data.to_xml

puts "---------------"

### Doesn't work, all the results are the same :(

data = Scrubyt::Extractor.define(:agent => :firefox) do
  fetch("file://"+File.expand_path(File.join(File.dirname(__FILE__), "page_1.html")))

  while(true)
    entry '//div'
  
    begin
      click_link 'Next'
    rescue Watir::Exception::UnknownObjectException
      puts "Reached the end.  Breaking"
      break
    end
  end
end
puts "Second results:"
puts data.to_xml



