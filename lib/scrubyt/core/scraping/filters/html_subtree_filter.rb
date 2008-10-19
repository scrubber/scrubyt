module Scrubyt
  class HtmlSubtreeFilter < BaseFilter

    def evaluate(source)
      source.inner_html
    end

    def to_sexp
      nil
    end #end of method
  end #End of class TreeFilter
end #End of module Scrubyt
