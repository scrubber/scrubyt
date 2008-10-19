module Scrubyt
  class ConstantFilter < BaseFilter

    def evaluate(source)
      return @example
    end

    def to_sexp
      [:str, @example]
    end #end of method to_sexp
  end #End of class ConstantFilter
end #End of module Scrubyt
