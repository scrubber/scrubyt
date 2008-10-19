require 'rubygems'
require 'hpricot'

module Scrubyt
  ##
  #=<tt>Group more filters into one</tt>
  #
  #Server as an umbrella for filters which are conceptually extracting
  #the same thing - for example a price or a title or ...
  #
  #Sometimes the same piece of information can not be extracted with one filter
  #across more result instances (for example a price has an XPath in record n,
  #but since in record n+1 has a discount price as well, the real price is pushed
  #to a different XPath etc) - in this case the more filters which extract the same
  #thing are hold in the same pattern.
  class Pattern
    #Type of the pattern;

    # TODO: Update documentation

    #    # a root pattern represents a (surprise!) root pattern
    #    PATTERN_TYPE_ROOT = :PATTERN_TYPE_ROOT
    #    # a tree pattern represents a HTML region
    #    PATTERN_TYPE_TREE = :PATTERN_TYPE_TREE
    #    # represents an attribute of the node extracted by the parent pattern
    #    PATTERN_TYPE_ATTRIBUTE = :PATTERN_TYPE_ATTRIBUTE
    #    # represents a pattern which filters its output with a regexp
    #    PATTERN_TYPE_REGEXP = :PATTERN_TYPE_REGEXP
    #    # represents a pattern which crawls to the detail page and extracts information from there
    #    PATTERN_TYPE_DETAIL_PAGE = :PATTERN_TYPE_DETAIL_PAGE
    #    # represents a download pattern
    #    PATTERN_TYPE_DOWNLOAD = :PATTERN_TYPE_DOWNLOAD
    #    # write out the HTML subtree beginning at the matched element
    #    PATTERN_TYPE_HTML_SUBTREE = :PATTERN_TYPE_HTML_SUBTREE

    VALID_PATTERN_TYPES = [:tree, :attribute, :regexp, :detail_page, :download, :html_subtree, :constant, :script, :text]

    # :determine - default value, represent that type of example need determine
    # :string    - represent node with example type EXAMPLE_TYPE_STRING
    VALID_PATTERN_EXAMPLE_TYPES = [:determine, :xpath]

    #The pattern can be either a model pattern (in this case it is
    #written to the output) or a temp pattern (in this case it is skipped)
    #Will be implemented in a higher version (i.e. not 0.1.0) - for now, everything
    #is considered to be a model pattern

    #Model pattern are shown in the output
    #    OUTPUT_TYPE_MODEL = :OUTPUT_TYPE_MODEL
    #    #Temp patterns are skipped in the output (their ancestors are appended to the parent
    #    #of the pattrern which was skipped
    #    OUTPUT_TYPE_TEMP = :OUTPUT_TYPE_TEMP

    VALID_OUTPUT_TYPES = [:model, :temp, :page_list]

    #These options can be set upon wrapper creation
    PATTERN_OPTIONS = [:generalize, :type, :output_type, :references, :limit, :default, :resolve, :except, :example_type]
    VALID_OPTIONS = PATTERN_OPTIONS + Scrubyt::CompoundExample::DESCRIPTORS + Scrubyt::ResultNode::OUTPUT_OPTIONS

    attr_accessor(:name, :options, :children, :constraints, :filters, :parent, :extractor,
                  :indices_to_extract, :referenced_extractor, :referenced_pattern, :modifier_calls)

    attr_reader(:next_page_url, :result_indexer)

    option_reader(:type => :tree, :output_type => :model, :generalize => false,
                  :write_text => lambda { @children.size == 0 }, :limit => nil,
                  :default => nil, :resolve => :full, :except => nil, :example_type => :determine)

    def initialize(name, args=[], extractor=nil, parent=nil, &block)
      #init attributes
      @name = name
      @extractor = extractor
      @parent = parent
      @options = {}
      @children = []
      @filters = []
      @constraints = []
      @modifier_calls = []

      #grab any examples that are defined
      examples = look_for_examples(args)

      #parse the options hash if provided
      parse_options_hash(args[-1]) if args[-1].is_a? Hash

      #perform checks for special cases
      examples = check_if_shortcut_pattern() if examples == nil
      check_if_detail_page(block)
      @options[:output_type] = :page_list if name == 'page_list'

      #create filters
      if examples == nil
        @filters << Scrubyt::BaseFilter.create(self) #create a default filter
      else
        examples.each do |example|
          @filters << Scrubyt::BaseFilter.create(self,example) #create a filter
        end
      end

      #by default, generalize the root pattern, but only in the case if
      #@generalize was not set up explicitly
      if @options[:generalize].nil?
        @options[:generalize] = true if parent.nil?
        @options[:generalize] = false if ((filters[0].example.is_a? String) && (filters[0].example =~ /.+\[[a-zA-Z].+\]$/))
      end

      #parse child patterns if available
      parse_child_patterns(&block) if ( !block.nil? && type != :detail_page )

      #tree pattern only (TODO: subclass?)
      if type == :tree
        #generate xpaths and regexps
        @filters.each do |filter|
          filter.generate_XPath_for_example(false) unless @name == 'next_page'
          filter.generate_regexp_for_example
        end
        #when the xpaths of this pattern have been created, its children can make their xpaths relative
        xpaths = @filters.collect { |filter| filter.xpath }
        @children.each do |child|
          child.generate_relative_XPaths xpaths
        end
      end
    end

    def generate_relative_XPaths(parent_xpaths)
      return if type != :tree
      raise ArgumentError.new if parent_xpaths.size != 1 && parent_xpaths.size != @filters.size #TODO: should be checked earlier with proper error message
      @filters.each_index do |index|
        @filters[index].generate_relative_XPath parent_xpaths[parent_xpaths.size == 1 ? 0 : index]
      end
    end

    #Shortcut patterns, as their name says, are a shortcut for creating patterns
    #from predefined rules; for example:
    #
    #  detail_url
    #
    #  is equivalent to
    #
    #  detail_url 'href', type => :attribute
    #
    #i.e. the system figures out on it's own that because of the postfix, the
    #example should be looked up (but it should never override the user input!)
    #another example (will be available later):
    #
    # every_img
    #
    # is equivivalent to
    #
    # every_img '//img'
    #
    def check_if_shortcut_pattern()
      if @name =~ /.+_url/
        @options[:type] = :attribute
        ['href']
      end
    end

    #Check whether the currently created pattern is a detail pattern (i.e. it refrences
    #a subextractor). Also check if the currently created pattern is
    #an ancestor of a detail pattern , and store this in a hash if yes (to be able to
    #traverse the pattern structure on detail pages as well).
    def check_if_detail_page(block)
      if @name =~ /.+_detail/
        @options[:type] = :detail_page
        @referenced_extractor = block
      end
    end

    def parent_of_leaf
      @children.inject(false) { |is_parent_of_leaf, child| is_parent_of_leaf || child.children.empty? }
    end

    def filter_count
      @filters.size
    end

    def parse_child_patterns(&block)
      context = Object.new
      context.instance_eval do
        def current=(value)
          @current = value
        end
        def method_missing(method_name, *args, &block)
          if method_name.to_s[0..0] == '_'
            #add hash option
            key = method_name.to_s[1..-1].to_sym
            check_option(key)
            args.each do |arg|
              current_value = @current.options[key]
              if current_value.nil?
                @current.options[key] = arg
              else
                @current.options[key] = [current_value] if !current_value.is_a Array
                @current.options[key] << arg
              end
            end
          else
            #create child pattern
            child = Scrubyt::Pattern.new(method_name.to_s, args, @current.extractor, @current, &block)
            @current.children << child
            child
          end
        end
      end
      context.current = self
      context.instance_eval(&block)
    end

    #Dispatcher function; The class was already too big so I have decided to factor
    #out some methods based on their functionality (like output, adding constraints)
    #to utility classes.
    #
    #The second function besides dispatching is to lookup the results in an evaluated
    #wrapper, for example
    #
    # camera_data.item[1].item_name[0]
    def method_missing(method_name, *args, &block)
      if @extractor.evaluating_extractor_definition
        @modifier_calls << [method_name, [:array, *args.collect { |arg| [:lit, arg] }]]
      end

      case method_name.to_s
      when 'select_indices'
        @result_indexer = Scrubyt::ResultIndexer.new(*args)
        return self
      when /^ensure_/
        @constraints << Scrubyt::ConstraintAdder.send(method_name, *args)
        return self #To make chaining possible
      else
        @children.each { |child| return child if child.name == method_name.to_s }
      end

      raise NoMethodError.new(method_name.to_s, method_name.to_s, args)
    end

    def evaluate(source, filter_indices)
      if type == :detail_page # DIRTY!
        return @filters[0].evaluate(source)
      end

      #we apply all filters if filter_indices is nil
      indices_to_evaluate = filter_indices.nil? ? 0...@filters.size : filter_indices
      #stores the results of all filters
      all_filter_results = []
      #remembers which filters have retured a certain result
      indices_mapping = {}
      #evaluate filters and collect filter results
      indices_to_evaluate.each do |filter_index|
        filter = @filters[filter_index]
        filter_results = filter.evaluate(source)
        filter_results.each do |result|
          #add result to list if not already there
          all_filter_results << result if all_filter_results.index(result).nil?
          #add the current filter's index to the mapping
           (indices_mapping[result] ||= []) << filter_index
        end
      end

      #apply constraints
      if @constraints.size > 0
        all_filter_results = all_filter_results.select do |result|
          @constraints.inject(true) { |accepted, constraint| accepted && constraint.check(result) }
        end
      end
      #apply indexer
      all_filter_results = @result_indexer.select_indices_to_extract(all_filter_results) if !@result_indexer.nil?

      #create result nodes and evaluate children
      result_nodes = []
      all_filter_results.each do |result|
        #create result node
        node = ResultNode.new(@name, result, @options)
        node.generated_by_leaf = (@children.size == 0)
        #evaluate children
        @children.each do |child|
          raise if self.filter_count != 1 && child.filter_count != self.filter_count
          if self.filter_count == 1
            #evaluate all child filters
            node.push(*child.evaluate(result, nil))
          else
            #evaluate appropriate child filters
            node.push(*child.evaluate(result, indices_mapping[result]))
          end
        end
        #apply child constraints (ensure_presence_of_pattern)
        required_child_names = @constraints.select {|c| c.type == Scrubyt::Constraint::CONSTRAINT_TYPE_ENSURE_PRESENCE_OF_PATTERN }.map {|c| c.target}
        unless required_child_names.empty?
          check = lambda { |node_to_check|
            required_child_names.delete node_to_check.name
            node_to_check.each { |child| check.call child }
          }
          check.call node
        end
        next unless required_child_names.empty?
        #add the current result node to the list
        result_nodes << node
      end
      if result_nodes.empty?
        result_nodes << ResultNode.new(@name, @options[:default], @options) if @options[:default]
      end
      case output_type
        when :model
          return result_nodes
        when :page_list
          result_nodes.each do |result_node|
            @extractor.add_to_next_page_list result_node
          end
          return []
      end
    end

    def to_sexp
      #collect arguments
      args = []
      args.push(*@filters.to_sexp_array) if type != :detail_page #TODO: this if shouldn't be there
      args.push(@options.to_sexp) if !@options.empty?

      #build main call
      sexp = [:fcall, @name, [:array, *args]]

      if type == :detail_page
        #add detail page extractor
        sexp = [:iter, sexp, nil, @filters[0].get_detail_sexp]
      else
        #add child block if the pattern has children
        sexp = [:iter, sexp, nil, [:block, *@children.to_sexp_array ]] if !@children.empty?
      end

      #add modifier calls - TODO: remove when everything is exported to the options hash
      @modifier_calls.each do |modifier_sexp|
        sexp = [:call, sexp, *modifier_sexp]
      end

      #return complete sexp
      sexp
    end

    private
    def parse_options_hash(hash)
      #merge provided hash
      @options.merge!(hash)
      #check if valid
      hash.each { |key, value| check_option(key.to_sym) }
      raise "Invalid pattern type: #{type.to_s}" if VALID_PATTERN_TYPES.index(type.to_sym).nil?
      raise "Invalid output type: #{output_type.to_s}" if VALID_OUTPUT_TYPES.index(output_type.to_sym).nil?
      raise "Invalid example type: #{example_type.to_s}" if VALID_PATTERN_EXAMPLE_TYPES.index(example_type.to_sym).nil?
    end

    def check_option(option)
      raise "Unknown pattern option: #{option.to_s}" if VALID_OPTIONS.index(option).nil?
    end

    def look_for_examples(args)
      if (args[0].is_a? String)
        examples = args.select {|e| e.is_a? String}
        #Check if all the String parameters are really the first
        #parameters
        args[0..examples.size-1].each do |example|
          if !example.is_a? String
            puts 'FATAL: Problem with example specification'
          end
        end
      elsif (args[0].is_a? Regexp)
        examples = args.select {|e| e.is_a? Regexp}
        #Check if all the String parameters are really the first
        #parameters
        args[0..examples.size].each do |example|
          if !example.is_a? Regexp
            puts 'FATAL: Problem with example specification'
          end
        end
        @options[:type] = :regexp
      elsif (args[0].is_a? Hash)
        examples = (args.select {|e| e.is_a? Hash}).select {|e| CompoundExample.compound_example?(e)}
        examples = nil if examples == []
      elsif (args[0].is_a? Proc)
        examples = [args[0]]
      end

      @has_examples = !examples.nil?
      examples
    end

  end #end of class Pattern
end #end of module Scrubyt
