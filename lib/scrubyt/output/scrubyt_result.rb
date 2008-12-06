module Scrubyt
  class ScrubytResult < ResultNode
    attr_accessor :root_patterns, :source_file, :source_proc

    def export
      #Temporary solution; the real one will be back later - or not     
     result = <<-EXPLANATION
     
     === Extractor tree ===
     
     export() is not working at the moment, due to the removal or ParseTree, ruby2ruby and RubyInline.
     For now, in case you are using examples, you can replace them by hand based on the output below.
     So if your pattern in the learning extractor looks like
     
     book "Ruby Cookbook" 
     
     and you see the following below:
     
     [book] /table[1]/tr/td[2]
     
     then replace "Ruby Cookbook" with "/table[1]/tr/td[2]" (and all the other XPaths) and you are ready!
     
     EXPLANATION
     
     tree_builder = lambda do |node, level|        
       result += current_level = ("   " * (level == 0 ? 0 : level-1) + 
                                  "|\n" * (level == 0 ? 0 : 1) +
                                  "   " * (level == 0 ? 0 : level-1) + 
                                 "+-- " * (level == 0 ? 0 : 1) + 
                                 "[#{node.name}]")
       result += " #{node.filters[0].xpath}" if node.type == :tree
       result += "\n"                                 
                                 
       node.children.each {|c| tree_builder[c, level+1]}
     end
     
     tree_builder[root_patterns[0],0]
          
     result += "\n"
    end
  end
end