module Scrubyt
  class AttributeFilter < BaseFilter

    def evaluate(source)
      elem = XPathUtils.find_nearest_node_with_attribute(source, @example)
      if elem.is_a? Hpricot::Elem
        return [elem.attributes[@example]]
      else
        return nil
      end
    end

  end #End of class AttributeFilter
end #End of module Scrubyt
