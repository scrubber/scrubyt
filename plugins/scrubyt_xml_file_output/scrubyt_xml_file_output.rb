require 'rexml/document'
require "#{File.dirname(__FILE__)}/inflector.rb"
require "#{File.dirname(__FILE__)}/inflections"

class Scrubyt::Output::XmlFile < Scrubyt::Output::Plugin  
  @subscribers = {}
  on_initialize :setup_file
  before_extractor :open_root_node
  after_extractor :close_root_node
  on_save_result :save_xml


  def setup_file(args = {})
    @file = args[:file]
  end

  def save_xml(name, results)
    if results.is_a?(::Hash)
      @file.write results.to_xml
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