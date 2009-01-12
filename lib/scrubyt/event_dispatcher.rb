module EventDispatcher
  def setup_listeners
    @event_dispatcher_listeners = {}
  end
  
  def subscribe(event, &callback)
    (@event_dispatcher_listeners[event] ||= []) << callback
  end
  
  protected
    def notify(event, *args)
      if @event_dispatcher_listeners[event]
        @event_dispatcher_listeners[event].each do |n|
          n.call(*args) if n.respond_to?(:call)
        end
      end
      return nil
    end
end