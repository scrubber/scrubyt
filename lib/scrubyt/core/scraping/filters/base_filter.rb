module Scrubyt
  ##
  #=<tt>Filter out relevant pieces from the parent pattern</tt>
  #
  #A Scrubyt extractor is almost like a waterfall: water is pouring from the top until
  #it reaches the bottom. The biggest difference is that instead of water, a HTML
  #document travels through the space.
  #
  #Of course Scrubyt would not make much sense if the same document would arrive at
  #the bottom that was poured in at the top - since in this case we might use an
  #indentity transformation (i.e. do nothing with the input) as well.
  #
  #This is where filters came in: as they name says, they filter the stuff that is
  #pouring from above, to leave the interesting parts and discard the rest.
  #The working of a filter will be explained most easily by the help of an example.
  #Let's consider that we would like to extract information from a webshop; Concretely
  #we are interested in the name of the items and the URL pointing to the image of the
  #item.
  #
  #To accomplish this, first we select the items with the pattern item (a pattern is
  #a logical grouping of fillters; see Pattern documentation) Then our new
  #context is the result extracted by the 'item' pattern; For every 'item' pattern, further
  #extract the name and the image of the item; and finally, extract the href attribute
  #of the image. Let's see an illustration:
  #
  #   root             --> This pattern is called a 'root pattern', It is invisible to you
  #   |                    and basically it represents the document; it has no filters
  #   +-- item         --> Filter what's coming from above (the whole document) to get
  #       |                relevant pieces of data (in this case webshop items)
  #       +-- name     --> Again, filter what's coming from above (a webshop item) and
  #       |                leave only item names after this operation
  #       +-- image    --> This time filter the image of the item
  #           |
  #           +-- href --> And finally, from the image elements, get the attribute 'href'
  class BaseFilter
    #Type of the example this filter is extracted with

    #XPath example, like html/body/tr/td[1] etc.
    EXAMPLE_TYPE_XPATH = 0
    #String from the document, for example 'Canon EOS 300 D'.
    EXAMPLE_TYPE_STRING = 1
    #Image example, like 'http://www.rubyrailways.com/scrubyt.jpg'
    EXAMPLE_TYPE_IMAGE = 2
    #No example - the actual XPath is determined from the children XPaths (their LCA)
    EXAMPLE_TYPE_CHILDREN = 3

    #Regexp example, like /\d+@*\d+[a-z]/
    EXAMPLE_TYPE_REGEXP = 4
    #Compound example, like :contains => 'goodies'
    EXAMPLE_TYPE_COMPOUND = 5

    attr_accessor(:example_type, :parent_pattern, :temp_sink,
                  :constraints, :xpath, :regexp, :example, :final_result)

    def self.create(parent_pattern, example=nil)
      filter_name = (parent_pattern.type.to_s.split("_").map!{|e| e.capitalize }.join) + 'Filter'
      if filter_name == 'RootFilter'
        BaseFilter.new(parent_pattern, example)
      else
        instance_eval("#{filter_name}.new(parent_pattern, example)")
      end
    end

    #Dispatcher method to add constraints; of course, as with any method_missing, this method
    #should not be called directly

    #TODO still used?
    alias_method :throw_method_missing, :method_missing
    def method_missing(method_name, *args, &block)
      case method_name.to_s
      when /^ensure.+/
        constraints << Constraint.send("add_#{method_name.to_s}".to_sym, self, *args)
      else
        throw_method_missing(method_name, *args, &block)
      end
    end

    private
    #We don't want this to be accessible from outside
    def initialize(parent_pattern, example)
      case parent_pattern.example_type
      when :xpath
        @example_type = EXAMPLE_TYPE_XPATH        
      else
        @example_type = BaseFilter.determine_example_type(example)
      end        
      @parent_pattern = parent_pattern
      @example = example
      @xpath = nil                #The xpath to evaluate this filter
      @constraints = [] #list of constraints
    end

    def self.determine_example_type(example)
      if example.instance_of? Regexp
        EXAMPLE_TYPE_REGEXP
      elsif example.instance_of? Hash
        EXAMPLE_TYPE_COMPOUND
      else
        case example
        when nil
          EXAMPLE_TYPE_CHILDREN
        when /\.(jpg|png|gif|jpeg)(\[\d+\])?$/
          EXAMPLE_TYPE_IMAGE
        when /^\/{1,2}[a-z]+[0-9]?(\[[0-9]+\])?(\/{1,2}[a-z()]+[0-9]?(\[[0-9]+\])?)*(\[@.+=.+\])?(\/@.+)?$/
         (example.include? '/' || example.include?('[')) ? EXAMPLE_TYPE_XPATH : EXAMPLE_TYPE_STRING
        else
          EXAMPLE_TYPE_STRING
        end
      end
    end #end of method
  end #End of class
end #End of module
