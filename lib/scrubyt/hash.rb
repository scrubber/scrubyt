require "#{File.dirname(__FILE__)}/output_plugin"
class Scrubyt::Output::Hash < Scrubyt::Output::Plugin
  @subscribers = {}
  on_initialize :setup_results
  on_save_result :store_hash

  def setup_results(args = {})
    @results = []
  end
      
  def results
    @results
  end

  def store_hash(name, passed_results)
    @results << passed_results
  end
end
