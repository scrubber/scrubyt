module ScrubytClassLevelInheritableAttributes
  def self.included(base)
    base.extend(ClassMethods)    
  end

  module ClassMethods
    def scrubyt_inheritable_attributes(*args)
      if @inheritable_attributes.nil? || !@inheritable_attributes.is_a?(Array)
        @inheritable_attributes = [:inheritable_attributes]
      end
      @inheritable_attributes += args
      args.each do |arg|
        class_eval %(
          class << self; attr_accessor :#{arg} end
        )
      end
      @inheritable_attributes
    end

    def scrubyt_inherited(subclass)
      @inheritable_attributes.each do |inheritable_attribute|
        instance_var = "@#{inheritable_attribute}" 
        subclass.instance_variable_set(instance_var, instance_variable_get(instance_var))
      end
    end
  end
end