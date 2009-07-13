require "#{File.dirname(__FILE__)}/class_level_inheritable_attributes"
module Scrubyt
  module Output    
    
    class Plugin
      include ScrubytClassLevelInheritableAttributes

      scrubyt_inheritable_attributes :subscribers
      @subscribers = {}
      
      def initialize(extractor, args = {})
        @extractor = extractor
        if initialize_event = self.class.subscribers[:initialize_output]
          self.send(initialize_event, args)
        end
          
        self.class.subscribers.each do |event, method_name|
          @extractor.subscribe(event) do |*args|
            send(method_name, *args)
          end
        end
      end
      
      def results
        []        
      end
    
      protected
        class << self
          
          def on_initialize(method_name)
            register_listener(:initialize_output, method_name)
          end          
          
          def before_extractor(method_name)
            register_listener(:start, method_name)
          end
      
          def after_extractor(method_name)
            register_listener(:end, method_name)
          end
      
          def on_save_result(method_name)
            register_listener(:save_results, method_name)
          end
                    
          def register_listener(event, method_name)
            subscribers[event] = method_name
          end
        end
    end
    
  end
end