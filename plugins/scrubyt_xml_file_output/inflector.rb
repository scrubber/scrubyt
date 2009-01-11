require 'rexml/document'
module Scrubyt
  class Inflector
    
    def self.to_xml(results, node_name = nil)
      xml = []      
      xml << "<#{node_name}>" if node_name
      if results.is_a?(String)
        node = REXML::Element.new node_name.to_s
        node.text = results
        return node.to_s
      elsif results.is_a?(Hash)
        results.each do |k,v|
          node = REXML::Element.new k.to_s
          if v.is_a?(Hash) || v.is_a?(Array)
            node << REXML::Text.new(v.to_xml, true, nil, true, nil, true)
          else
            node.text = v
          end
          xml << node.to_s
        end
      elsif results.is_a?(Array)
        results.each do |r|
          xml << r.to_xml
        end        
      end
      xml << "</#{node_name}>" if node_name
      xml.join      
    end
    
  end
end