$:.unshift File.join(File.dirname(__FILE__), '../../..//lib')

require 'scrubyt'

#Example of:
#  - filling and submitting a textfield
#  - filling a text area
#  - submitting the form
#
#Goal:       Automatically sending a comment to a wordpress blog
#Solution:   After fetching the page, fill the 'author' and 'email' textfields,
#            then enter your comment to the 'comment' textarea and submit the form.
#            This example does not use a scraper - it's an example of an extractor
#            which uses just navigation to accomplish the goal.
#            Please don't run this too much (or change the name,email and comment 
#            to something menaningful) - I would not like to have a horde of comments
#            from Bruce Lee :-)
#
#Credit: Zaheed Haque

post_comment = Scrubyt::Extractor.define do
  fetch 'http://scrubyt.org/your-first-extractor/'
  fill_textfield 'author', 'Bruce Lee'
  fill_textfield 'email', 'bruce@kung-foo.com'
  fill_textarea 'comment', 'Yet another test comment from Bruce!'
  submit
end 
