$:.unshift File.join(File.dirname(__FILE__), '../../../lib')

require 'scrubyt'

#Example of: - logging to an account - rubyforge.org this time
#            - submitting the form with a button
#
#Goal:       Go to 'http://rubyforge.org/' and login. Once you are inside,
#            scrape something not really interesting just to show you are in!
#Solution:   Go to rubyforge.org and click on the 'Log In' link. This gets you to the
#            login page, where you fill in the appropriate textfields.
#            Submitting the textfield once everything is setup up for the show is a bit
#            different this time - since a simple form.submit does not work. You have 
#            to submit the form by pressing a button. The solution is to specify the index
#            of the button which should be pressed.

rubyforge_data = Scrubyt::Extractor.define do
  fetch          'http://rubyforge.org/'
  click_link     'Log In'
  fill_textfield 'form_loginname', '*login_here*'
  fill_textfield 'form_pw', '*pass_here*'
  submit 0

  stuff 'My Personal Page'

end

rubyforge_data.to_xml.write($stdout, 1)
Scrubyt::ResultDumper.print_statistics(rubyforge_data)

