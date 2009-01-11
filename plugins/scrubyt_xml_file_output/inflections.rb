module Scrubyt
  module CoreExtensions
    module Xml
      module Inflections
        def to_xml(node_name = nil)          
          node_name ||= self if self.is_a?(String) 
          Scrubyt::Inflector.to_xml(self, node_name)
        end
      end
    end
  end  
end

class Array
  include Scrubyt::CoreExtensions::Xml::Inflections
end

class Hash
  include Scrubyt::CoreExtensions::Xml::Inflections
end

class String
  include Scrubyt::CoreExtensions::Xml::Inflections
end