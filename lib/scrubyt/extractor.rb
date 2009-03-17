require "#{File.dirname(__FILE__)}/logger.rb"
require "#{File.dirname(__FILE__)}/navigation.rb"
require "#{File.dirname(__FILE__)}/results_extraction.rb"
require 'hpricot'
require "#{File.dirname(__FILE__)}/inflections.rb"


module Scrubyt
  class Extractor
    include EventDispatcher
    include Scrubyt::Navigation
    include Scrubyt::ResultsExtraction
    
    attr_accessor :options, :previous_url, :previous_base_path, 
                  :previous_page, :previous_path, :previous_query,
                  :agent_doc, :current_form, :detail

    def initialize(options = {}, &extractor_definition)
      defaults = { :agent => :standard,
                   :output => :hash,
                   :child => true,
                   :log_level => :none }      
      @options = defaults.merge(options)
      setup_listeners
      setup_agent
      setup_output
      setup_logger
      clear_results!
      @detail = {}
      @detail_definition = []
      notify(:start) unless in_detail_block?
      instance_eval(&extractor_definition)
      unless in_detail_block?
        clear_results! 
        notify(:end)
      end
    end
            
    def results
      return @results.flatten if in_detail_block?
      @options[:output_plugin].results.flatten
    end
    
    private    
      
      def method_missing(method_name, *args, &block)
        return fetch_next(method_name, *args, &block) if next_page?(method_name)
        return fetch_detail(method_name, *args, &block) if detail_block?(method_name, *args, &block)
        return save_result(method_name, extract_detail(method_name, *args, &block)) if result_block?(&block)
        return required_failure! if missing_required_results?(method_name, *args)
        unless required_failure?
          return save_result(:current_url, previous_url) if wants_current_url?(method_name)
          return if drop_empty_result?(method_name, *args)
          return save_result(method_name, extract_result(method_name, *args)) if result_node?(method_name, *args)
          return save_result(method_name, extract_result(method_name, *args)) if result_set?(method_name, *args)
          super
        end
      end
      
      def setup_logger
        Scrubyt::Logger.new(self, @options)
      end

      def setup_output
        if @options[:output].is_a?(Symbol)
          outputter = "Scrubyt::Output::#{@options[:output].to_s.camelize}".constantize
          @options[:output_plugin] = outputter.new(self, @options)
        elsif @options[:output].is_a?(Array)
          @options[:output_plugin] = []
          @options[:output].each do |output|
            outputter = "Scrubyt::Output::#{output.to_s.camelize}".constantize
            @options[:output_plugin] = outputter.new(self, @options)
          end
        end
      end
      
      def in_detail_block?
        options[:detail]
      end
      
      def next_page?(method_name)
        method_name == :next_page
      end
      
      def detail_block?(method_name, *args, &block)
        if method_name.to_s =~ /_detail$/
          @detail_definition = [method_name, args.clone, block]
          true
        end
      end
      
      def result_block?(&block)
        ! block.nil?
      end
            
      def parsed_doc
        @parsed_doc ||= Hpricot(@agent_doc.body)
        rescue NoMethodError
          @parsed_doc = Hpricot("")
      end
    
      def setup_agent
        case @options[:agent]
        when :standard
          notify(:setup_agent)
          require "mechanize"
          Hpricot.buffer_size = 262144
          @agent = WWW::Mechanize.new
        end
        ## TODO: Clearer distinction between requesting url and processing body for detail
        if @options[:url]
          fetch(@options[:url]) 
        elsif @options[:body]
          @parsed_doc = Hpricot(@options[:body])
        end
      end
      
      def clear_current_result!
        @current_result = nil
      end

      def reset_page_state!
        @current_form = nil
        @parsed_doc = nil
      end
      
      def clear_results!
        @results = []
      end
      
      def fix_form_action
        current_form.action = resolve_url(current_form.action)
      end
      
      def current_form
        return @current_form unless @current_form.nil?
        @current_form = @agent_doc.forms.detect{|f| f}
      end

  end
end