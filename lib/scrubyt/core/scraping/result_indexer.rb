module Scrubyt
  ##
  #=<tt>Selecting results based on indices</tt>
  #
  #If the results is list-like (as opposed to a 'hard' result, like a _price_ or a _title_),
  #probably with a variable count of results (like tags, authors etc.), you may need just 
  #specific elements - like the last one, every third one, or at specific indices.
  #In this case you should use the select_indices syntax.
  class ResultIndexer    
    attr_reader :indices_to_extract
    
    def initialize(*args)
      select_indices(*args)
    end
    
    ##
    #Perform selection of the desires result instances, based on their indices
    def select_indices_to_extract(ary)
      return ary if @indices_to_extract == nil
      to_keep = []
      @indices_to_extract.each {|e|
        if e.is_a? Symbol
          case e
          when :first
            to_keep << 0
          when :last
            to_keep << ary.size-1
          when :all_but_last
           (0..ary.size-2).each {|i| to_keep << i} 
          when :all_but_first
           (1..ary.size-1).each {|i| to_keep << i} 
          when :every_even
           (0..ary.size).each {|i| to_keep << i if (i % 2 == 1)}
          when :every_odd
           (0..ary.size).each {|i| to_keep << i if (i % 2 == 0)}
          when :every_second
           (0..ary.size).each {|i| to_keep << i if (i % 2 == 0)}
          when :every_third
           (0..ary.size).each {|i| to_keep << i if (i % 3 == 0)}
          when :every_fourth
           (0..ary.size).each {|i| to_keep << i if (i % 4 == 0)}
          end
        end
      }
      @indices_to_extract.each {|i| to_keep << i if !i.is_a? Symbol}
      to_keep.sort!
      ary.reject! {|e| !to_keep.include? ary.index(e)}
      ary
    end
    
    #    def to_sexp
    #      [:array, *@indices_to_extract.collect { |index| [:lit, index] }]
    #    end
    
    private
    ##
    #Do not return the whole result set, just specified indices - like
    #first,last, every odd index, indices from [1..3] etc.
    #
    #This method can accept:
    #- a range, like (2..3)
    #- an array of indices, like [1,2,3]
    #- specified set of keywords:
    #  - :first
    #  - :last
    #  - :every_even
    #  - :every_odd
    #  (there can be more of these keywords in one select_indices call)
    def select_indices(*args)
      indices_to_grab = args[0]
      case indices_to_grab.class.to_s
      when "Range"
        @indices_to_extract = indices_to_grab.to_a
      when "Array"
        nested_arrays = []
        indices_to_grab.each {|e|
          if e.is_a? Array
            nested_arrays << e
          elsif e.is_a? Range
            nested_arrays << e.to_a
          end
        }
        @indices_to_extract = indices_to_grab
        nested_arrays.each {|a| a.each {|e| @indices_to_extract << e if !@indices_to_extract.include? e }}
        @indices_to_extract.reject! {|e| ((e.is_a? Range) || (e.is_a? Array)) }
      when "Symbol"
        #parse this when  we already have the results
        @indices_to_extract = [indices_to_grab]
      else
        puts "Invalid index specification"
      end
    end #end of function select_indices
  end #end of class ResultIndexer
end #end of module Scrubyt
