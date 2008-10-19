$:.unshift File.join(File.dirname(__FILE__), '../../..//lib')

require 'scrubyt'

#Example of:
#  - Scraping a digg page; otherwise nothing special
#  
#Goal: Extract every main item contained on the front page - an item
#      should containt the title and the number of diggs.
#
#Solution:  Well, nothing special - this could even be a 'Hello, world!'
#           type of example. However, it is far from that - since digg
#           is changing so fast that it is practically impossible to 
#           capture an example before it gets at least one more digg on
#           the frontpage. Solution: go to the 10th or so page, and select
#           an example there (with the lowest possible digg, since that lowers
#           the risk of being digged up even more) and export the stuff immediately
#           then use the production extractor.
# !!! NOTE !!! to run this example, you will need to change the example!
# it is totally impossible that there is something on the frontpage with 1 diggs!

digg_data = Scrubyt::Extractor.define do
  fetch 'http://digg.com/'
  fill_textfield 's', 'ruby'
    submit

    item do
      title "Free Dog Training Tips" 
      diggs "1"
    end
end

digg_data.to_xml.write($stdout, 1)
Scrubyt::ResultDumper.print_statistics(digg_data)
digg_data.export(__FILE__)


