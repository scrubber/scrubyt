module Scrubyt
  class ScriptFilter < BaseFilter

    def evaluate(source)
      param = source
      param = source.inner_html.gsub(/<.*?>/, "") unless source.is_a? String
      @example.call param
    end

  end #End of class ConstantFilter
end #End of module Scrubyt
