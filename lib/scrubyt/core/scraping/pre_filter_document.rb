module Scrubyt
  ##
  #=<tt>Apply different functions on the input document</tt>
  #Before the document is passed to Hpricot for parsing, we may need
  #to do different stuff with it which are clumsy/not appropriate/impossible
  #to do once the document is loaded.
  class PreFilterDocument
     #Replace <br/> tags with newlines
     def self.br_to_newline(doc)
       doc.gsub(/<br[ \/]*>/i, "\r\n")
       doc = doc.tr("\240"," ")
     end #end of function  br_to_newline
  end #end of class PreFilterDocument
end #end of module Scrubyt
