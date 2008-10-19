module Scrubyt
  #=<tt>Lookup of simple examples</tt>
  #There are two types of string examples in scRUBYt! right now:
  #the simple example and the compound example.
  #
  #This class is responsible for finding elements matched by simple examples.
  #In the futre probably more sophisticated matching algorithms will be added
  #(e.g. match the n-th which matches the text, or element that matches the
  #text but also contains a specific attribute etc.)
  class SimpleExampleLookup
    #From the example text defined by the user, find the lowest possible node which contains the text 'text'.
    #The text can be also a mixed content text, e.g.
    #
    # <a>Bon <b>nuit</b>, monsieur!</a>
    #
    #In this case, <a>'s text is considered to be "Bon nuit, monsieur"
    def self.find_node_from_text(doc, text, next_link=false, index = 0)
      text.gsub!('»', '&#187;')
      #Process immediate attribute extraction (like "go to google.com/@href")
      if text =~ /.+\/@.+$/
        text = text.scan(/^(.+?)\/@.+$/)[0][0]
      elsif text =~ /.+\[\d+\]$/
        res = text.scan(/(.+)\[(\d+)\]$/)
        text = res[0][0]
        index = res[0][1].to_i
      elsif text =~ /.+\[.+\]$/
        final_element_name = text.scan(/^(.+?)\[/)[0][0]
        text = text.scan(/\[(.+?)\]/)[0][0]
      end
      if final_element_name
        text = Regexp.escape(text) if text.is_a? String
        result = SharedUtils.traverse_for_match(doc,/#{text}/)[index]
        result = XPathUtils.traverse_up_until_name(result,final_element_name)
      else
        text = Regexp.escape(text) if text.is_a? String
        result = SharedUtils.traverse_for_match(doc,/^#{text}$/)[index]
      end
    end
  end #End of class SimpleExampleLookup
end #End of module Scrubyt