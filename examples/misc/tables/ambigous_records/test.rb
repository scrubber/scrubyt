$:.unshift File.join(File.dirname(__FILE__), '../../../../lib')

require 'scrubyt'

#Example of: 
#  - Sepecyfiing multiple examples
#
#Goal:       From this simple table, scrape the languages and their rivals, into
#            a structure like 
#            
#            <language_war>
#              <lang>Ruby</lang>
#              <rival>Python</rival>
#            </language_war>
#            
#            Try it as you would normally - i.e. just supply lang the example 'Ruby'
#            and rival the example 'Python' and it won't work. This is because
#            in the document, the other two semantically similar records (Java and
#            C#) are contained at different places in the structure. This is a dummy
#            example, but in the real life you have this with a lot of webshops
#            and other pages as well.
#            
#Solution:   Specify multiple examples as in the example below - until you get 
#            everything you need (i.e. theoretically you can specify even 
#            12345 examples, however that would be unmaintainable :-))
  
ambigous_data = Scrubyt::Extractor.define do
  fetch File.join(File.dirname(__FILE__), "input.html")
  #Construct the wrapper
  language_war do
    lang  'Ruby', 'Java'
    rival 'Python', 'C#'
  end
end

ambigous_data.to_xml.write($stdout, 1) 
Scrubyt::ResultDumper.print_statistics(ambigous_data)