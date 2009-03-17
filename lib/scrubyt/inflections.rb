require "#{File.dirname(__FILE__)}/inflector.rb"
module Scrubyt
  module CoreExtensions
    module String
      module Inflections
        def self.included(klass)
          unless klass.respond_to?(:camelize) || klass.respond_to?(:classify) || klass.respond_to?(:constantize)
            klass.class_eval do 
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
    end
  end  
end

class String
  include Scrubyt::CoreExtensions::String::Inflections
end