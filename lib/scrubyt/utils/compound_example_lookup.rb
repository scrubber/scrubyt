module Scrubyt
  #=<tt>Lookup of compund examples</tt>
  #There are two types of string examples in scRUBYt! right now:
  #the simple example and the compound example.
  #
  #This class is responsible for finding elements matched by compound examples.
  #In the futre probably more sophisticated matching algorithms will be added
  #(e.g. match the n-th which matches the text, or element that matches the
  #text but also contains a specific attribute etc.)
  class CompoundExampleLookup
    def self.find_node_from_compund_example(doc, compound_example, next_link=false, index = 0)
      @partial_results = []
      self.lookup_compound_example(doc, compound_example, index)
    end

private
    #Lookup the first element which is matched by this compund example
    #
    #A compound example is specified with :contains, :begins_with and
    #:ends_with descriptors - which can be both regexps or strings
    #
    #Example:
    #
    #flight_info :begins_with => 'Arrival', :contains => /\d\d-\d+/, :ends_with => '20:00'
    def self.lookup_compound_example(doc, compound_example, index)
      compound_example.each do |k,v|
        v = Regexp.escape(v) if v.is_a? String
        case k
          when :contains
            v = /#{v}/
          when :begins_with
            v = /^\s*#{v}/
          when :ends_with
            v = /#{v}\s*$/
        end
        if (@partial_results.empty?)
          @partial_results = SharedUtils.traverse_for_match(doc, v)
        else
          refine_partial_results(v)
        end
      end
      @partial_results[index]
    end

    def self.refine_partial_results(regexp)
      @partial_results = @partial_results.select {|pr| pr.inner_html.gsub(/<.*?>/, '') =~ regexp}
    end

  end #End of class CompoundExampleLookup
end #End of module Scrubyt