module Scrubyt
  class ResultNode < Array
    OUTPUT_OPTIONS = [:write_text]

    attr_accessor :name, :result, :options, :generated_by_leaf

    def initialize(name, result=nil, options={})
      @name = name
      @result = result
      @options = options
    end

    def write_text
      @options[:write_text].nil? ? @generated_by_leaf : @options[:write_text]
    end

    def has_content?
      return true if result.is_a? String
      write_text || (inject(false) { |one_child_has_content, child| one_child_has_content || child.has_content? })
    end

    def to_s
      text = (@result.is_a? String) ? @result : @result.inner_html.gsub(/<.*?>/, '')
      text = SharedUtils.unescape_entities(text)
      text.strip!
      if (@options[:default] && ((text == '') || (text == @options[:default])))
        @options[:default]
      else
        text
      end
    end

    def to_libxml
      libxml_node = XML::Node.new(name)
      self.each { |child| libxml_node << child.to_libxml if child.has_content? }
      libxml_node << to_s if write_text
      libxml_node
    end

    #note: see ruby_extensions.rb for String#write
    def to_xml
      to_xml_lines.join("\n")
    end

    def to_hash(delimiter=',')
      result = []
      flat_hash_inner = lambda {|e, hash|
        hash[e.name.to_sym] = hash[e.name.to_sym] ? hash[e.name.to_sym] + delimiter + e.to_s : e.to_s  if ((e.write_text && !e.to_s.empty?) || e.options[:default])
        e.each {|c| flat_hash_inner.call(c, hash)  }
        hash
      }
      self.each {|e| result << flat_hash_inner.call(e, {}) }
      result
    end
    
    def to_flat_hash()
      hash_result = self.to_hash('@@@@@@')
      merged_hash = hash_result.delete_at 0
      hash_result.each do |hash|
        merged_hash.keys.each do |key|
          merged_hash[key] += "@@@@@@#{hash[key]}"
        end
      end
      result_sets = merged_hash.values.map!{|x| x.split('@@@@@@')}.transpose
      final_result = []

      result_sets.each do |rs|
        temp_result = {}
        merged_hash.keys.each do |k|
          temp_result[k] = rs[merged_hash.keys.index(k)]
        end
        final_result << temp_result
      end
      final_result
    end

    def to_flat_xml(delimiter=nil)
      lines = []
      hash_result = delimiter ? self.to_hash(delimiter) : self.to_hash
      merged_hash = hash_result.delete_at 0

      hash_result.each do |hash|
        merged_hash.keys.each do |key|
          merged_hash[key] += "#{delimiter}#{hash[key]}"
        end
      end

      if delimiter
        result_sets = merged_hash.values.map!{|x| x.split(delimiter)}.transpose
        final_result = []

        result_sets.each do |rs|
          temp_result = {}
          merged_hash.keys.each do |k|
            temp_result[k] = rs[merged_hash.keys.index(k)]
          end
          final_result << temp_result
        end
        hash_result = final_result
      end

      hash_result.each do |hash|
        lines << "<item>"
        hash.each do |key, value|
          xml_tag = key.to_s
          value = '' if value == '#empty#'
          lines << "  <#{xml_tag}>#{REXML::Text.normalize(value)}</#{xml_tag}>"
        end
        lines << "</item>"
      end
      return lines.join("\n")

    end

    def to_xml_lines
      lines = []
      children = self.select{ |child| child.has_content? }
      if children.empty?
        if result.is_a? String
          lines << "<#{name}>#{result}</#{name}>"
        elsif write_text && !to_s.empty?
          lines << "<#{name}>#{ERB::Util.html_escape(to_s)}</#{name}>"
        else
          if @options[:default]
            lines << "<#{name}>#{@options[:default]}</#{name}>"
          else
            lines << "<#{name}/>"
          end
        end
      else
        lines << "<#{name}>"
        lines << "  #{ERB::Util.html_escape(to_s)}" if write_text && !to_s.empty?
        children.each do |child|
          lines.push(*child.to_xml_lines.map{ |line| "  #{line}" })
        end
        lines << "</#{name}>"
      end
    end
  end
end