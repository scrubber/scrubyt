$lib_path = File.expand_path(File.join(File.dirname(__FILE__), '..', 'lib'))
$:.unshift $lib_path

require 'scrubyt'
require 'test/unit'

def perform_test(test_path, detailed = false)
  out = $stdout
  $stdout = StringIO.new unless detailed
  cwd = Dir.getwd
  Dir.chdir(File.dirname(test_path))
  
  out.puts "Test: #{test_path}" if detailed
  out.puts "========== Print Output ==========" if detailed
  
  begin
    expected_xml = File.read(File.basename(test_path)[0..-4] + ".expected.xml")
    
    scrubyt_result_native = Scrubyt::Extractor.load(File.basename(test_path))
    
    exported_code = scrubyt_result_native.export({:template => 'lambda'})
    scrubyt_result_exported = Scrubyt::Extractor.define(&eval(exported_code))
  ensure
    if detailed
      out.puts "========== Native Extractor =========="
      out.puts IO.read(File.basename(test_path))
      out.puts "========== Exported Extractor =========="
      out.puts exported_code
      out.puts "========== Expected =========="
      out.puts expected_xml
      out.puts "========== Result (native) =========="
      out.puts scrubyt_result_native.to_xml
      out.puts "========== Result (exported) =========="
      out.puts scrubyt_result_exported.to_xml
    end
  end
  
  assert_equal expected_xml, scrubyt_result_native.to_xml
  assert_equal expected_xml, scrubyt_result_exported.to_xml
ensure
  Dir.chdir(cwd)
  $stdout = out
end

if $0 == __FILE__ && ARGV[0]
  include Test::Unit::Assertions
  perform_test(ARGV[0], true)
  exit
end

class BlackboxTest < Test::Unit::TestCase
  tests = Dir.glob(File.join(File.dirname(__FILE__), 'blackbox_tests', '**', '*.rb'))
  tests = tests.sort
  
  tests.each do |test_path|
    define_method("test_#{test_path.gsub('/', '_')}") do
      perform_test(test_path)
    end
  end
end