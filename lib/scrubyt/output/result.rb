########################################## NOT USED ANY MORE ##########################################
module Scrubyt
  ##
  #=<tt>Represents the results of a pattern</tt>
  class Result
    attr_reader :childmap, :instances

    def initialize
      @childmap ||= []
    end

    def add_result(source, result)
      @childmap.each do |hash|
        if hash.keys[0] == source
          hash[source] << result if !hash[source].include? result
          return
        end
      end
      @childmap << {source => [result]}
    end

    def lookup(last_result)
      @childmap.each do |hashes|
        hashes.each { |key, value| return value if (key == last_result) }
      end
      nil
    end#end of method lookup
  end#end of class Result
end#end of module Scrubyt

  #It roughly works like this:
  #
  # root
  # source:         nil
  # childmap:       [ {doc1 => [doc1]}, {doc2 => [doc2]} ]

  #table
  #  source:         doc1
  #  childmap        [ {doc1 => [table[1]s1, table[2]s1, table[3]s1]}, {doc2 => [table[1]s2, table[2]s2, table[3]s2]} ]

  #row
  #  source:         table1s1, table2s1, table3s1
  #  childmap:       [ {table[1]s1 => [row1s1, row2s1]}, {table[2]s1 => [row3s1, row3s1, row5s1]},
  #                    {table[1]s2 => [row1s2, row2s2]}, {table[2]s2 => [row3s2, row3s2, row5s2]}]
