class ScrubytLogger
  @@log_levels = [:none,
                  :critical,
                  :error,
                  :warn,
                  :info,
                  :debug,
                  :verbose]

  def initialize(extractor, *args)
    @log_level = @@log_levels.index(args.first[:log_level]) 
    @extractor = extractor    
    @extractor.subscribe(:start) do
      log("start") if @log_level > 3
    end
    @extractor.subscribe(:end) do
      log("end") if @log_level > 3
    end
    @extractor.subscribe(:save_result) do |name, result|
      log("saving: '#{name}'") if @log_level > 4
      log("with result: '#{result}'") if @log_level > 5
    end
    @extractor.subscribe(:fetch) do |url|
      log("fetch: #{url}") if @log_level > 4
    end
    @extractor.subscribe(:next_page) do |url|
      log("next page: #{url}") if @log_level > 3
    end
    @extractor.subscribe(:next_detail) do |name, url, *args|
      log("next detail: '#{name}' = '#{url}'") if @log_level > 4
      log("with args: '#{args}'") if @log_level > 5      
    end
    @extractor.subscribe(:submit) do
      log("submit") if @log_level > 4
    end
    @extractor.subscribe(:fill_textfield) do |name, value, options|
      log("textfield: '#{name}' = '#{value}'") if @log_level > 4
      log("with options '#{options}'") if @log_level > 5
    end
    @extractor.subscribe(:select_option) do |name, value, options|
      log("select option: '#{name}' = '#{value}'") if @log_level > 4
      log("with '#{options}'") if @log_level > 5
    end
    @extractor.subscribe(:setup_agent) do
      log("setup agent") if @log_level > 3
    end
  end
    
  private
    def log(message)
      puts message
    end
end