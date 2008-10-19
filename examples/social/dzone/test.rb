$:.unshift File.join(File.dirname(__FILE__), '../../..//lib')

require 'scrubyt'

#Example of:
#  - Scraping a dzone page; otherwise nothing special
#  
#Goal: Extract every main item contained on the front page - an item
#      should containt the title and the number of votes.
#
#Solution:  Check out the comment on the digg example - everything
#           written there applies. (Well in practice dzone is more 'example friendly' -
#           the votes are not rising that fast).
#           If you think 'hey, why do we need one more digg like example, they are all the same'
#           then check out reddit and del.icio.us, and you will see they are not the same at all :-)

dzone_data = Scrubyt::Extractor.define do
  fetch 'http://www.dzone.com/search.html?query=ruby'

  item do
    title "Deconstructing generic components"
    votes "1"
  end
end

dzone_data.to_xml.write($stdout, 1)
Scrubyt::ResultDumper.print_statistics(dzone_data)
dzone_data.export(__FILE__)