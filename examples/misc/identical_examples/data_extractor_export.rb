require("rubygems")
require("scrubyt")

data = Scrubyt::Extractor.define do
  fetch("input.html")
  
  stuff("/html[1]/body[1]/table[1]/tr[2]/td[1]", { :generalize => false }) do
    index("index", { :type => :attribute })
  end
end

data.to_xml.write($stdout, 1)
