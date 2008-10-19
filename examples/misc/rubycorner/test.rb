$:.unshift File.join(File.dirname(__FILE__), '../../../lib')

require 'scrubyt'

#Example of: Collecting blog addresses from rubycorner.com
#            - extracting href attribute from an <a> tag
#            - crawling to all of the pages
#
#Goal:       Go to http://rubycorner.com/blogs/lang/en. This listing
#            contains all the English blogs aggregated by rubycorner.
#            Scrape all of them!
#Solution:   Extract all <a> patterns as you would normally. To further
#            extract the href from the 'link' pattern, use an attrinute 
#            pattern (specified by :type => :attribute)
#            Finally, crawl to all of the pages with next_page - this time
#            without a limit since we need all the pages.

rubycorner_data = Scrubyt::Extractor.define do
  #Perform the action(s)
  fetch 'http://rubycorner.com/blogs/lang/en'
  #Construct the wrapper
  link "Boston BarCamp Day 1" do
    url "href", :type => :attribute                   
  end
  next_page ">"
end

rubycorner_data.to_xml.write($stdout, 1)
Scrubyt::ResultDumper.print_statistics(rubycorner_data)
