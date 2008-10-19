require 'rexml/document'
require 'rexml/xpath'

########################################## NOT USED ANY MORE ##########################################
module Scrubyt
  ##
  #=<tt>Dumping the result in various formats and providing statistics on the results</tt>
  class ResultDumper
    ##
    #Output the results as XML
    def self.to_xml(pattern)
      doc = REXML::Document.new
      root = REXML::Element.new('root')
      doc.add_element(root)
      all_extracted_docs = pattern.last_result
      [all_extracted_docs].flatten.each do |lr|
        pattern.last_result = lr
        to_xml_recursive(pattern, root)
      end
      remove_empty_leaves(doc)
      @@last_doc = doc
    end

    def self.remove_empty_leaves(node)
      node.remove if  node.elements.empty? && node.text == nil
      node.elements.each {|child| remove_empty_leaves child }
    end

    ##
    #Output the text of the pattern; If this pattern is a tree, collect the text from its
    #result instance node; otherwise rely on the last_result
    #TODO: throw this away!!!
    def self.to_text(pattern)
      last_result = pattern.last_result
      result = ""
      if pattern.type == :tree
        last_result.traverse_text { |t| result += t.to_s }
      else
        result = last_result
      end
      result
    end

    def self.to_csv(pattern)
      result = []
      flat_csv_inner = lambda {|e, parts|
        content = e.text || ''
        parts << content if ((e.is_a? REXML::Element) && content != '')
        e.children.each {|c| flat_csv_inner.call(c, parts) if c.is_a? REXML::Element }
        parts
      }
      to_xml(pattern).root.elements['/root'].each {|e| result << flat_csv_inner.call(e, []) }
      (result.map! {|a| a.join(',')}).join("\n")
    end

    def self.to_hash(pattern)
      result = []
      flat_hash_inner = lambda {|e, parts|
        content = e.text ? REXML::Text.unnormalize(e.text) : ''
        if ((e.is_a? REXML::Element) && content != '')
          if parts[e.local_name]
            parts[e.local_name] = parts[e.local_name] + "," + content
          else
            parts[e.local_name] = content
          end
        end
        e.children.each {|c| flat_hash_inner.call(c, parts) if c.is_a? REXML::Element }
        parts
      }
      to_xml(pattern).root.elements['/root'].each {|e| result << flat_hash_inner.call(e, {}) }
      result
    end



    ##
    #Print some simple statistics on the extracted results, like the count of extracted
    #instances by each pattern
    def self.print_statistics(pattern)
      puts "\n" * 2
      print_statistics_recursive(pattern,0)
      puts
    end

private
    def self.to_xml_recursive(pattern, element)
      pattern.children.each do |child|
        childresults = child.result.lookup(child.parent.last_result)
        #Output text for leaf nodes only; Maybe add possibility to customize this later
        if (childresults == nil)
##TODO: is this needed for anything? I guess not! Drop it!!!!!!
#Update: it seems the blackbox tests are not passing because of this (?) so temporarily adding it back
##=begin
          res = ""
          if child.parent.last_result.is_a? String
            res = child.parent.last_result
          else
            child.parent.last_result.traverse_text { |t| res += t.to_s }
          end
          if (child.parent.respond_to?(:size) && child.parent.size == 0) #TODO: respond_to should not be used here, it's just a quick workaround
            element.text = SharedUtils.unescape_entities(res).strip unless element.parent.is_a? REXML::Document
          end
          next
##=end
        end

        generate_children(child, childresults, element)
      end
    end

    def self.generate_children(child, childresults, element)
      if childresults == nil
        child_node = REXML::Element.new(child.name)
        child_node.text = child.default
        element.add_element(child_node)
      else
        childresults.size.times do |num|
          child.last_result = childresults[num]
          res = ""
          if child.last_result.instance_of? String
            res = child.last_result
          else
            if child.last_result.respond_to? 'traverse_text'
              child.last_result.traverse_text { |t| res += t.to_s } if child.last_result != nil
            else
              child.last_result.children.each { |c| element.add_element c }
            end
          end
          child_node = REXML::Element.new(child.name)
          child_node.text = SharedUtils.unescape_entities(res).strip if child.write_text
          element.add_element(child_node) if (child.type != :detail_page && child_node.text != '')
          to_xml_recursive(child, child_node)
        end
      end
    end

    def self.print_statistics_recursive(pattern, depth)
      if pattern.name != 'root'
        if pattern.type == :detail_page
          pattern.evaluation_context.extractor.get_detail_pattern_relations[pattern].parent.children.each do |child|
            print_statistics_recursive(child, depth)
          end
        else
          count = REXML::XPath.match(@@last_doc, "//#{pattern.name}").size
          Scrubyt.log :INFO, (' ' * depth.to_i) + "#{pattern.name} extracted #{count} instances."
        end
      end

      pattern.children.each do |child|
        print_statistics_recursive(child, depth + 4)
      end
      end#end of method print_statistics_recursive
    end #end of class ResultDumper
  end #end of module Scrubyt
