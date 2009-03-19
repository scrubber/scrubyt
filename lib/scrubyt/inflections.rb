unless "".respond_to?(:camelize) && "".respond_to?(:classify) && "".respond_to?(:constantize)
  require 'extlib'
  
  class String
    def classify
      Extlib::Inflection.classify(self)
    end
    
    def camelize
      Extlib::Inflection.camelize(self)
    end
    
    def constantize
      Extlib::Inflection.constantize(self)      
    end
  end
end
