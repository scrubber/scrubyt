$:.unshift File.join(File.dirname(__FILE__), '../../../lib')

require 'scrubyt'

#Example of:
#  - scraping stock values from finance.yahoo.com
#  
#Goal:       from finance.yahoo.com. Scrape the actual values found there
#            for the stock information available.
#Solution:   Nothing special here. The examples are defined, and 
#            the ensure_presence_of_pattern constraint is used to filter out
#            stockinfos that do not have a value specified.

stock_data = Scrubyt::Extractor.define do
  #Perform the action(s)
  fetch 'http://finance.yahoo.com/'
  #Construct the wrapper
  stockinfo do
    symbol  'Dow'
    value   '15.54'
  end.ensure_presence_of_pattern('value')    
end


stock_data.to_xml.write($stdout, 1)
Scrubyt::ResultDumper.print_statistics(stock_data)