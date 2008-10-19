require("rubygems")
require("scrubyt")

data = Scrubyt::Extractor.define do
  fetch("input.html")
  
  stuff("/html/body/table/tr/td", { :generalize => true })
end

data.to_xml.write($stdout, 1)
