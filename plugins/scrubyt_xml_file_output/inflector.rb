# require 'rexml/document'
require 'nokogiri'
module Scrubyt
  class Inflector
    
    def self.to_xml(results, node_name = nil)      
      xml = []
      xml << "<#{node_name}>" if node_name
      document = Nokogiri::XML::Document.new
      if results.is_a?(String)
        node = Nokogiri::XML::Node.new(node_name.to_s, document)
        document << node
        node.content = results
        return node.to_s
      elsif results.is_a?(Hash)
        results.each do |k,v|
          node = Nokogiri::XML::Node.new(k.to_s, document)
          if v.is_a?(Hash) || v.is_a?(Array)
            nodes = Nokogiri::XML::DocumentFragment.parse(v.to_xml).children
            nodes.each do |n|
              node << n
            end
          else
            node.content = v
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