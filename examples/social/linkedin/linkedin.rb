require 'rubygems'
require 'scrubyt'


property_data = Scrubyt::Extractor.define :agent => :firefox do
  fetch          'https://www.linkedin.com/secure/login'
  fill_textfield 'session_key', 'peter@rubyrailways.com'
  fill_textfield 'session_password', 'peter1980'
  submit

  click_link_and_wait 'Connections', 5
  
  vcard "//li[@class='vcard']" do    
    first_name  "//span[@class='given-name']"
    second_name "//span[@class='family-name']"
    email       "//a[@class='email']"
  end
end

puts property_data.to_xml



