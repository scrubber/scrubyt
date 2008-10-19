module Scrubyt
  class TextFilter < BaseFilter

    def evaluate(source)
        return find_string(source) if @example =~ /^find\(/
        final_element_name = @example.scan(/^(.+?)\[/)[0][0]
        text = Regexp.escape(@example.scan(/\[(.+?)\]/)[0][0])

        index = @example.scan(/\]:(.+)/).flatten
        index = 0 if index.empty?
        index = index[0].to_i unless index[0] == "all"
        result = (index.is_a? Fixnum) ? (SharedUtils.traverse_for_match(source,/#{text}/)[index]) : (SharedUtils.traverse_for_match(source,/#{text}/))
        return "" unless result

        if index[0] == "all"
          result.inject([]) {|a,r| a << XPathUtils.traverse_up_until_name(r,final_element_name); a}
        else
          [XPathUtils.traverse_up_until_name(result,final_element_name)]
        end
    end

    def find_string(source)
      str = @example.scan(/find\((.+)\)/).flatten[0]
      strings_to_find = str.include?('|') ? str.split('|') : [str]
      strings_to_find.each do |s|
        result = SharedUtils.traverse_for_match(source,/#{s}/i)
        return [s] unless result.empty?
      end
      return []
    end

    def to_sexp
      [:str, @example]
    end #end of method to_sexp
  end #End of class TextFilter
end #End of module Scrubyt

