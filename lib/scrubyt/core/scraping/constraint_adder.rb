module Scrubyt
  ##
  #=<tt>Utility class for adding constraints</tt>
  #
  #Originally methods of Pattern - but since Pattern was already too heavy (and after 
  #all, adding a constraint (logically) does not belong to Pattern anyway) it was moved
  #to this utility class. In pattern everything that begins with ensure_ 
  #is automatically dispatched here.
  #
  #I will not document the functions since these are just forwarders; See the 'real'
  #functions with their documentation in Scrubyt::Constraint.rb
  class ConstraintAdder
    
    def self.ensure_presence_of_pattern(ancestor_node_name)    
      Constraint.add_ensure_presence_of_pattern(ancestor_node_name)
    end
    
    def self.ensure_presence_of_ancestor_node(ancestor_node_name, attributes=[])
      Constraint.add_ensure_presence_of_ancestor_node(ancestor_node_name, 
                                                          prepare_attributes(attributes))
    end
    
    def self.ensure_absence_of_ancestor_node(ancestor_node_name, attributes=[])
      Constraint.add_ensure_absence_of_ancestor_node(ancestor_node_name, 
                                                         prepare_attributes(attributes))
    end
    
    def self.ensure_presence_of_attribute(attribute_hash)
      Constraint.add_ensure_presence_of_attribute(attribute_hash)
    end
    
    def self.ensure_absence_of_attribute(attribute_hash)
      Constraint.add_ensure_absence_of_attribute(attribute_hash)
    end        

    private
    def self.prepare_attributes(attributes)
      attribute_pairs = []
      attributes.each do |key, value|
        if (value.instance_of? Array)
          value.each {|val| attribute_pairs << [key,val]}
        else
          attribute_pairs << [key, value]
        end
      end
      return attribute_pairs
    end #end of method prepare_attributes      
  end #end of class ConstraintAddere
end #end of module Scrubyt
