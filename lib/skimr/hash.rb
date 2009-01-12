require "#{File.dirname(__FILE__)}/output_plugin"
module Scrubyt
  module Output
    class Hash < Scrubyt::Output::Plugin
      @subscribers = {}
      on_save_result :store_hash
      
      def initialize(extractor, args = {})
        @results = []
        super
      end
            
      def results
        @results
      end
      
      def store_hash(name, passed_results)
          @results << passed_results
      end

    end
  end  
end
