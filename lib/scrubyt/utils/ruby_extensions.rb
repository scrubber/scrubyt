class Module
  def option_reader(key_default_hash)
    key_default_hash.each do |key, default|
      define_method(key) {
        if @options[key].nil?
          if default.is_a? Proc
            instance_eval(&default)
          else
            default
          end
        else
          @options[key]
        end
      }
    end
  end
  
  def option_writer(*keys)
    keys.each do |key|
      define_method("#{key.to_s}=".to_sym) { |value|
        @options[key] = value
      }
    end
  end
  
  def option(key, default=nil, writable=false)
    option_reader(key => default)
    option_writer(key) if writable
  end
  
  def option_accessor(key_default_hash)
    key_default_hash.each do |key, default|
      option(key, default, true)
    end
  end
end

class Range
  def <=>(other)
    self.begin <=> other.begin
  end
  
  def +(amount)
   (self.begin + amount)..(self.end + amount)
  end
  
  def -(amount)
   (self.begin - amount)..(self.end - amount)
  end
end

module Math
  def self.min(a, b)
    a < b ? a : b
  end
  
  def self.max(a, b)
    a > b ? a : b
  end
end

#just some hack here to allow current examples' syntax:
#table_data.to_xml.write(open('result.xml', 'w'), 1)
class String
  def write(stringio, add_indent=0)
    stringio.write((self.split("\n").collect { |line| ('  ' * add_indent) + line }).join("\n"))
  end
end