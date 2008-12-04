require 'rexml/document'

Array.class_eval do
  def to_xml
    xml = []
    self.each do |r|
      xml << r.to_xml
    end
    xml.join
  end
end

Hash.class_eval do
  def to_xml
    nodes = []
    self.each do |k,v|
      node = REXML::Element.new k.to_s
      if v.is_a?(Hash) || v.is_a?(Array)
        node << REXML::Text.new(v.to_xml, true, nil, true, nil, true)
      else
        node.text = v
      end
      nodes << node.to_s
    end
    nodes.join
  end
end
