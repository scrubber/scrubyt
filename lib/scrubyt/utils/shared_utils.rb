module Scrubyt
  ##
  #=<tt>Utilities shared between the other utility classes (XPathUtils, SimpleExampleLookup,...)</tt>
  #
  class SharedUtils
    #Entities to replace - need to make this more complete, or install htmlentities or similar package
    ENTITIES = {
        'quot'      => '"',
        'apos'      => "'",
        'amp'       => '&',
        'lt'        => '<',
        'gt'        => '>',
        'nbsp'      => ' '}

    def self.prepare_text_for_comparison(text)
      unescape_entities text
      text.strip!
      text
    end

    #Unescape the entities in the HTML!
    def self.unescape_entities(text)
      ENTITIES.each {|e,s| text.gsub!(/\&#{e};/) {"#{s}"} }
      text
    end

    #Entry point for finding the elements specified by examples
    def self.traverse_for_match(node, regexp)
      results = []
      traverse_for_match_inner = lambda { |node, regexp|
        ft = prepare_text_for_comparison(node.inner_html.gsub(/<.*?>/, ''))
        if ft =~ regexp
          node.instance_eval do
            @match_data = $~
            def match_data
              @match_data
            end
          end
          results << node
          results.delete node.parent if node.is_a? Hpricot::Elem
        end
        node.children.each { |child| traverse_for_match_inner.call(child, regexp) if (child.is_a? Hpricot::Elem) }
      }
      traverse_for_match_inner.call(node,regexp)
      results
    end

    def self.get_backtrace
      begin
        raise
      rescue Exception => ex
        backtrace = ex.backtrace
      end
      backtrace.slice!(0)
      backtrace
    end
  end #end of class SharedUtils
end #end of module Scrubyt
