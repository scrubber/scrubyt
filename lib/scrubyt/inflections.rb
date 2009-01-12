module Scrubyt
  module CoreExtensions
    module String
      module Inflections
        def camelize
          Scrubyt::Inflector.camelize(self, true)
        end

        def classify
          Scrubyt::Inflector.classify(self)
        end

        def constantize
          Scrubyt::Inflector.constantize(self)
        end
      end
    end
  end  
end

class String
  include Scrubyt::CoreExtensions::String::Inflections
end