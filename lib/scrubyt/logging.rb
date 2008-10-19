#
# TODO: if multiline messages aren't needed, then remove them.
#
# TODO: switch to the conventional Ruby logger interface,
# or create an adapter to it. If the former, then decided what to
# do with the unit tests.
#

module Scrubyt
  # Logging is disabled by default. It can be enabled as follows:
  #
  #   Scrubyt.logger = Scrubyt::Logger.new  # logs *all* messages to STDERR
  #
  def self.logger=(logger)
    @logger = logger
  end

  # Simple logger implementation, based on Scrubyt's original logging style.
  # Messages will be sent to STDERR. Logging can be limited to certain message
  # levels by specifying them on initialization, e.g.
  #
  #   Scrubyt::Logger.new(:ACTION, :ERROR)  # will only log action/error messages
  #
  class Logger
    class Message
      def initialize(level, text)
        @level, @text = level.to_s, text.to_s
      end

      def to_s
        prefix + @text
      end

      protected

      def prefix
        @prefix ||= "[#{@level}] "
      end
    end

    class MultiLineMessage < Message
      def initialize(level, lines)
        super level, lines.shift

        @lines = lines
      end

      def to_s
        [ super, indented_lines ] * "\n"
      end

      private

      def indented_lines
        @lines.inject([]) { |lines, line| lines << indented(line) } * "\n"
      end

      def indented(line)
        ' ' * prefix.length + line
      end
    end

    def initialize(*levels)
      @levels = levels
    end

    def log(level, message)
      return unless logging?(level)

      message_class = message.is_a?(Array) ? MultiLineMessage : Message

      output_stream.puts message_class.new(level, message)
    end

    def output_stream
      @output_stream || STDERR
    end

    attr_writer :output_stream

    private

    def logging?(level)
      @levels.empty? || @levels.include?(level)
    end
  end

  def self.log(level, message)
    return if logger.nil?

    logger.log(level, message)
  end

  private

  def self.logger
    @logger
  end
end


if __FILE__ == $0 then

  require 'test/unit'

  class ScrubytLoggingTestCase < Test::Unit::TestCase
    class FauxOutputStream < Array
      def puts(object)
        self << object.to_s
      end
    end

    def setup_logger_with_faux_output_stream!(*logger_args)
      @stream = FauxOutputStream.new
      logger = Scrubyt::Logger.new(*logger_args)
      logger.output_stream = @stream
      Scrubyt.logger = logger
    end

    def test_that_logging_works_with_nil_logger
      Scrubyt.logger = nil
      assert_nothing_raised { Scrubyt.log(:ERROR, 'message') }
    end

    def test_simple_messages_are_output_correctly
      setup_logger_with_faux_output_stream!

      Scrubyt.log :ACTION, 'i just did something'

      assert_equal 1, @stream.size
      assert_equal '[ACTION] i just did something', @stream.first
    end

    def test_that_multiline_messages_are_output_correctly
      setup_logger_with_faux_output_stream!

      Scrubyt.log :ERROR, ['something bad happened', 'dear oh dear']

      assert_equal 1, @stream.size
      assert_equal "[ERROR] something bad happened\n        dear oh dear", @stream.first
    end

    def test_that_loggers_can_be_limited_to_specfied_message_levels
      setup_logger_with_faux_output_stream! :ERROR

      Scrubyt.log :ACTION, 'i just did something'
      Scrubyt.log :ERROR, 'something bad happened'

      assert_equal 1, @stream.size
      assert_equal '[ERROR] something bad happened', @stream.first
    end
  end

end