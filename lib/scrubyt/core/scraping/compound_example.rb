module Scrubyt
  ##
  #=<tt>Represents a compund example</tt>  
  #
  #There are two types of string examples in scRUBYt! right now:
  #the simple example and the compound example. The simple example
  #is specified by a string, and a compound example is specified with 
  #:contains, :begins_with and :ends_with descriptors - which can be
  #both regexps or strings
  class CompoundExample
  
    DESCRIPTORS = [:contains, :begins_with, :ends_with]
    
    attr_accessor :descriptor_hash

    def initialize(descriptor_hash)
      @descriptor_hash = descriptor_hash
    end
    
    ##
    #Is the hash passed to this function a compound example descriptor hash?
    #Need to decide this when parsing pattern parameters
    def self.compound_example?(hash)
      hash.each do |k,v|
        return false if !DESCRIPTORS.include? k
      end
      true
    end# end of method
  end# #end of class CompoundExample
end# end of module Scrubyt
