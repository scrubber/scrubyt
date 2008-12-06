module Scrubyt
  class ConstantFilter < BaseFilter

    def evaluate(source)
      return @example
    end

  end #End of class ConstantFilter
end #End of module Scrubyt
