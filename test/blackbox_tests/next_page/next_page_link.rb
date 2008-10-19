lambda do
  fetch(File.join(File.dirname(__FILE__), "page_1.html"))

  entry '1'
  
  next_page 'Next'
end