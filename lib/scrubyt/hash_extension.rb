class Hash
  # Takes a block that returns a [key, value] pair
  # and builds a new hash based on those pairs
  # Courtesy of http://snuxoll.com/post/2009/02/13/ruby-better-hashcollect
  def collect_kv
    result = {}
    each do |k,v|
      new_k, new_v = yield k, v
      result[new_k] = new_v
    end
    result
  end
  
  def collect_kv!(&blk)
    replace(self.collect_kv(&blk))
  end
  
  def symbolize_keys!
    self.collect_kv! do |k,v|
      v.symbolize_keys! if v.is_a?(Hash)
      [k.to_sym, v]
    end
  end
end