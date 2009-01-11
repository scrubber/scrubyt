require 'rexml/document'
require "#{File.dirname(__FILE__)}/inflector.rb"
require "#{File.dirname(__FILE__)}/inflections"

class Scrubyt::Output::XmlFile < Scrubyt::Output::Plugin
  
  before_extractor :open_root_node
  after_extractor :close_root_node
  save_result :save_result
  

  def initialize(extractor, args = {})
    @file = args[:file]
    super
  end
  
  def save_result(name, results)
    unless results.first.is_a?(String)
      @file.write results.to_xml(name)
    else
      results.each do |result|
        @file.write result.to_xml(name)
      end
    end
  end
  
  def open_root_node(*args)
    @file.write("<root>")
  end
  
  def close_root_node(*args)
    @file.write("</root>")
  end
    
end