module Scrubyt
  module Output    
    
    class Plugin
      include ClassLevelInheritableAttributes
      inheritable_attributes :subscribers
      @subscribers = {}
      
      def initialize(extractor, args = {})
        @extractor = extractor
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