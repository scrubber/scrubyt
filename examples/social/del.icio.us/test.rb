$:.unshift File.join(File.dirname(__FILE__), '../../..//lib')

require 'scrubyt'

#Will comment later

del_icio_us_data = Scrubyt::Extractor.define do
  fetch "http://del.icio.us/search/?p=ruby"

  item do
    title 'Why’s (Poignant) Guide to Ruby'
    title_url 'Why’s (Poignant) Guide to Ruby' do
      url 'href', :type => :attribute
    end      
    bookmarks 'saved by 6687 people', :generalize => true do
      votes /\d+/
    end.select_indices(:all_but_last)
  end
end

del_icio_us_data.to_xml.write($stdout, 1)
del_icio_us_data.export(__FILE__)
