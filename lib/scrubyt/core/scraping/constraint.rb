module Scrubyt
  ##
  #=<tt>Rejecting result instances based on further rules</tt>
  #
  #The two  most trivial problems with a set of rules is that they match either less
  #or more instances than we would like them to. Constraints are a way to remedy the second problem:
  #they serve as a tool to filter out some result instances based on rules. A typical
  #example:
  #
  #* *ensure_presence_of_ancestor_pattern* consider this model:
  #    <book>
  #      <author>...</author>
  #      <title>...</title>
  #    </book>
  #
  #If I attach the *ensure_presence_of_ancestor_pattern* to the pattern 'book' with values
  #'author' and 'title', only those books will be matched which have an author and a
  #title (i.e.the child patterns author and title must extract something). This is a way
  #to say 'a book MUST have an author and a title'.
  class Constraint
    #There are more possible ways of applying/checking constraints in the case of
    #ones that can not be checked in the context node (e.g. ensure_presence_of -
    #since it may require the evaluation of child patterns of the context pattern to
    #arbitray level)
    #
    #In such cases, the possibilities are:
    #
    #1) make a depth-first evaluation from the context pattern until the needed ancestor
    #   pattern is evaluated. This can mess things up, since if any ancestor node uses
    #   the sinks of predecessor(s) other than the context node, those need to be evaluated
    #   too, and we may run into a cyclyc dependency or at least a complicated recursion
    #
    #2) Post processing - evaluate normally and throw out results which do not pass the
    #   constraint
    #
    #2b) Do it on the XML level - most probably this solution will be implemented

    # Different constraint types
    CONSTRAINT_TYPE_ENSURE_PRESENCE_OF_PATTERN = 0
    CONSTRAINT_TYPE_ENSURE_PRESENCE_OF_ATTRIBUTE = 1
    CONSTRAINT_TYPE_ENSURE_ABSENCE_OF_ATTRIBUTE = 2
    CONSTRAINT_TYPE_ENSURE_PRESENCE_OF_ANCESTOR_NODE = 3
    CONSTRAINT_TYPE_ENSURE_ABSENCE_OF_ANCESTOR_NODE = 4


    attr_reader :type, :target

    #Add 'ensure presence of ancestor pattern' constraint

    #If this type of constraint is added to a pattern, it must have an ancestor pattern
    #(child pattern, or child pattern of a child pattern, etc.) denoted by "ancestor"
    #'Has an ancestor pattern' means that the ancestor pattern actually extracts something
    #(just by looking at the wrapper model, the ancestor pattern is always present)
    #Note that from this type of constraint there is no 'ensure_absence' version, since
    #I could not think about an use case for that
    def self.add_ensure_presence_of_pattern(ancestor)
      Constraint.new(ancestor, CONSTRAINT_TYPE_ENSURE_PRESENCE_OF_PATTERN)
    end

    #Add 'ensure absence of attribute' constraint

    #If this type of constraint is added to a pattern, the HTML node it targets
    #must NOT have an attribute named "attribute_name" with the value "attribute_value"
    def self.add_ensure_absence_of_attribute(attribute_hash)
      Constraint.new(attribute_hash,
                     CONSTRAINT_TYPE_ENSURE_ABSENCE_OF_ATTRIBUTE)
    end

    #Add 'ensure presence of attribute' constraint

    #If this type of constraint is added to a pattern, the HTML node it targets
    #must have an attribute named "attribute_name" with the value "attribute_value"
    def self.add_ensure_presence_of_attribute(attribute_hash)
      Constraint.new(attribute_hash,
                     CONSTRAINT_TYPE_ENSURE_PRESENCE_OF_ATTRIBUTE)
    end

    #Add 'ensure absence of ancestor node' constraint

    #If this type of constraint is added to a pattern, the HTML node extracted by the pattern
    #must NOT contain a HTML ancestor node called 'node_name' with the attribute set 'attributes'.
    #
    #"attributes" is an array of hashes, for example
    #[{'font' => 'red'}, {'href' => 'http://www.google.com'}]
    #in the case that more values have to be checked with the same key (e.g. 'class' => 'small' and '
    #class' => 'wide' it has to be written as [{'class' => ['small','wide']}]
    #
    #"attributes" can be empty - in this case just the 'node_name' is checked
    def self.add_ensure_absence_of_ancestor_node(node_name, attributes)
      Constraint.new([node_name, attributes],
                     CONSTRAINT_TYPE_ENSURE_ABSENCE_OF_ANCESTOR_NODE)
    end

    #Add 'ensure presence of ancestor node' constraint

    #If this type of constraint is added to a pattern, the HTML node extracted by the pattern
    #must NOT contain a HTML ancestor node called 'node_name' with the attribute set 'attributes'.
    #
    #"attributes" is an array of hashes, for example
    #[{'font' => 'red'}, {'href' => 'http://www.google.com'}]
    #in the case that more values have to be checked with the same key (e.g. 'class' => 'small' and '
    #class' => 'wide' it has to be written as [{'class' => ['small','wide']}]
    #
    #"attributes" can be empty - in this case just the 'node_name' is checked
    def self.add_ensure_presence_of_ancestor_node(node_name, attributes)
      Constraint.new([node_name, attributes],
                     CONSTRAINT_TYPE_ENSURE_PRESENCE_OF_ANCESTOR_NODE)
    end

    #Evaluate the constraint; if this function returns true,
    #it means that the constraint passed, i.e. its filter will be added to the exctracted
    #content of the pattern
    def check(result)
      case @type
        #checked after evaluation, so here always return true
        when CONSTRAINT_TYPE_ENSURE_PRESENCE_OF_PATTERN
          return true
        when CONSTRAINT_TYPE_ENSURE_PRESENCE_OF_ATTRIBUTE
          attribute_present(result)
        when CONSTRAINT_TYPE_ENSURE_ABSENCE_OF_ATTRIBUTE
          !attribute_present(result)
        when CONSTRAINT_TYPE_ENSURE_PRESENCE_OF_ANCESTOR_NODE
          ancestor_node_present(result)
        when CONSTRAINT_TYPE_ENSURE_ABSENCE_OF_ANCESTOR_NODE
          !ancestor_node_present(result)
      end
    end

  private
    #We would not like these to be called from outside
    def initialize(target, type)
      @target = target
      @type = type
    end

    #Implementation of the ancestor node presence test
    #Check the documentation of the add_ensure_presence_of_ancestor_node method
    #for further information on the result parameter
    def ancestor_node_present(result)
      found = false
      node_name = @target[0]
      node_attributes = @target[1]
      node_attributes.each do |pair|
        return true if !result.search("//#{node_name}[@#{pair[0]}='#{pair[1]}']").empty?
      end
      if node_attributes.empty?
        return true if !result.search("//#{node_name}").empty?
      end
      false
    end

    def attribute_present(result)
      return unless result.is_a? Hpricot::Elem
      match = true
      #If v = nil, the value of the attribute can be arbitrary;
      #Therefore, in this case we just have to make sure that the attribute is
      #present (i.e. != nil), we don't care about the value
      @target.each do |k,v|
        if v == nil
            match &&= (result.attributes[k.to_s] != nil)
          else
            match &&= (result.attributes[k.to_s] == v.to_s)
        end
      end
      match
    end

  end #end of class
end #end of module