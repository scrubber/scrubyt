module Scrubyt
  class HtmlSubtreeFilter < BaseFilter

    def evaluate(source)
      source.inner_html
    end

  end #End of class TreeFilter
end #End of module Scrubyt
