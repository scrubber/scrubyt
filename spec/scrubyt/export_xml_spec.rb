require "#{File.dirname(__FILE__)}/../spec_helper.rb"
require "#{File.dirname(__FILE__)}/../../lib/scrubyt.rb"


describe "XML Export Format" do
  include MockFactory
  
  def mock_results
    @results = [
        {:result=>[
          {:list_price=>"$39.99 ", 
           :book_title=>"The Ruby Programming Language [ILLUSTRATED]  (Paperback)"}]},
        {:result=>[
          {:list_price=>"$40.00 ", 
           :book_title=>"The Ruby Way"}]}]
  end
  
  it "should extend Array to have to_xml method" do
    result = Array.new
    result.respond_to?(:to_xml).should be
  end
  
  it "should extend Hash to have to_xml method" do
    result = Hash.new
    result.respond_to?(:to_xml).should be
  end
  
  it "should output key/value as xml" do
    results = { :result => "foo"}
    results.to_xml.should eql("<result>foo</result>")
  end
  
  it "should output multiple key/values as xml" do
    results = { :result1 => "foo", :result2 => "bar"}
    xml = "<root>"
    xml << results.to_xml
    xml << "</root>"
    xml = REXML::Document.new xml
    xml.root.elements["result1"].text.should eql("foo")
    xml.root.elements["result2"].text.should eql("bar")
  end

  it "should output nested key/values as xml" do
    results = { :result => { :title => "foo", :price => "100" } }
    xml = "<root>"
    xml << results.to_xml
    xml << "</root>"
    xml = REXML::Document.new xml
    xml.root.elements["result"].should be
    xml.root.elements["result"].elements["title"].text.should eql("foo")
    xml.root.elements["result"].elements["price"].text.should eql("100")
  end
  
  it "should output nested collection of key/values as xml" do
    mock_results
    xml = "<root>"
    xml << @results.to_xml
    xml << "</root>"
    xml = REXML::Document.new xml
    xml.root.elements["result"].should be
    xml.root.elements.detect{|e|  e.elements["list_price"].text == "$39.99 " && e.elements["book_title"].text == "The Ruby Programming Language [ILLUSTRATED]  (Paperback)"}.should be
    xml.root.elements.detect{|e|  e.elements["list_price"].text == "$40.00 " && e.elements["book_title"].text == "The Ruby Way"}.should be
  end
  
end
