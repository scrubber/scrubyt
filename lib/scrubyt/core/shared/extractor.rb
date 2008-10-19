module Scrubyt
  ##
  #=<tt>Driving the whole extraction process</tt>
  #
  #Extractor is a performer class - it gets an extractor definition and carries
  #out the actions and evaluates the wrappers sequentially. 
  #
  #Originally also the navigation actions were here, but since the class got too
  #big, they were factored out to an own class, NavigationAction.
  class Extractor
    include FetchAction
    
    attr_accessor :result, :evaluating_extractor_definition, :mode, :root_patterns, :next_page_pattern#, :hpricot_doc, :current_doc_url
    
    #The definition of the extractor is passed through this method
    def self.define(mode=nil, &extractor_definition)
      if mode.is_a?(Hash)
        if mode[:agent]==:firefox
          FetchAction.class_eval do
            include Navigation::Firewatir
          end
        else
          FetchAction.class_eval do
            include Navigation::Mechanize
          end
        end
      else
        FetchAction.class_eval do
          include Navigation::Mechanize
        end
      end
      extractor = self.new(mode, extractor_definition)
      extractor.result
    end
    
    def self.load(filename)
      define(&eval(IO.read(filename)))
    end
    
    def initialize(mode, extractor_definition)
      @mode = mode
      @root_patterns = []
      @next_page_pattern = nil
      #      @hpricot_doc = nil
      #      @hpricot_doc_url = nil
      @evaluating_extractor_definition = false
      @next_page_list = []
      @processed_pages = []
      
      backtrace = SharedUtils.get_backtrace
      parts = backtrace[1].split(':')
      source_file = parts[0]
      
      Scrubyt.log :MODE, mode == :production ? 'Production' : 'Learning'
      
      @evaluating_extractor_definition = true
      context = Object.new
      context.extend NavigationActions
      context.instance_eval do
        def extractor=(value)
          @extractor = value
        end
        
        def next_page(*args)
          @extractor.next_page_pattern = Scrubyt::Pattern.new('next_page', args, @extractor)
        end
        
        def method_missing(method_name, *args, &block)
          root_pattern = Scrubyt::Pattern.new(method_name.to_s, args, @extractor, nil, &block)
          @extractor.root_patterns << root_pattern
          root_pattern
        end
      end
      context.extractor = self
      context.instance_eval(&extractor_definition)
      @evaluating_extractor_definition = false
      
      if @root_patterns.empty?
        # TODO: this should be an exception
        Scrubyt.log :ERROR, 'No extractor defined, exiting...'
        exit
      end
      
      #Once all is set up, evaluate the extractor from the root pattern!
      root_results = evaluate_extractor
      
      @result = ScrubytResult.new('root')
      @result.push(*root_results)
      @result.root_patterns = @root_patterns
      @result.source_file = source_file
      @result.source_proc = extractor_definition
      
      #Return the root pattern
      Scrubyt.log :INFO, 'Extraction finished succesfully!'
    end
    
    def get_hpricot_doc
      FetchAction.get_hpricot_doc
    end
    
    def get_current_doc_url
      FetchAction.get_current_doc_url
    end
    
    def get_detail_pattern_relations
      @detail_pattern_relations
    end
    
    def get_mode
      @mode
    end
    
    def get_original_host_name
      @original_host_name
    end
    
    def add_to_next_page_list(result_node)
      if result_node.result.is_a? Hpricot::Elem
        node = XPathUtils.find_nearest_node_with_attribute(result_node.result, 'href')
        return if node == nil || node.attributes['href'] == nil
        href = node.attributes['href'].gsub('&amp;') {'&'}
      elsif result_node.result.is_a? String
        href = result_node.result
      end
      url = href #TODO need absolute address here 1/4
      @next_page_list << url
    end
    
    def evaluate_extractor
      root_results = []
      current_page_count = 1
      catch :quit_next_page_loop do
        loop do
          url = get_current_doc_url #TODO need absolute address here 2/4
          @processed_pages << url
          @root_patterns.each do |root_pattern|
            root_results.push(*root_pattern.evaluate(get_hpricot_doc, nil))
          end
          
          while @processed_pages.include? url #TODO need absolute address here 3/4
            if !@next_page_pattern.nil?
              throw :quit_next_page_loop if @next_page_pattern.options[:limit] == current_page_count
              throw :quit_next_page_loop unless @next_page_pattern.filters[0].generate_XPath_for_example(true)
              xpath = @next_page_pattern.filters[0].xpath
              node = (get_hpricot_doc/xpath).map.last
              node = XPathUtils.find_nearest_node_with_attribute(node, 'href')
              throw :quit_next_page_loop if node == nil || node.attributes['href'] == nil
              href = node.attributes['href'].gsub('&amp;') {'&'}
              throw :quit_next_page_loop if href == nil
              url = href #TODO need absolute address here 4/4
            else
              throw :quit_next_page_loop if @next_page_list.empty?
              url = @next_page_list.pop
            end
          end

          restore_host_name
          FetchAction.fetch(url)
          
          current_page_count += 1
        end
      end
      root_results
    end
    
  end
end