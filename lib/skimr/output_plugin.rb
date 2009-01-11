module Scrubyt
  module Output    
    @@subscribers = Hash.new
    
    class Plugin    
      def initialize(extractor, args = {})
        @extractor = extractor
        @@subscribers.each do |event, method_name|
          @extractor.subscribe(event) do |*args|
            send(method_name, *args)
          end
        end
      end
    
      protected
        class << self
          def subscribers
            @@subscribers ||= {}
          end
          
          def before_extractor(method_name)
            @@subscribers ||= {}
            @@subscribers[:start] = method_name
          end
      
          def after_extractor(method_name)
            @@subscribers ||= {}
            @@subscribers[:end] = method_name
          end
      
          def save_result(method_name)
            @@subscribers ||= {}
            @@subscribers[:save_results] = method_name
          end
        end
    end
    
  end
end