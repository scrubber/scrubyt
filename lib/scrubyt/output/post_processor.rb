module Scrubyt

########################################## NOT USED ANY MORE ##########################################
require 'set'
##
#=<tt>Post processing results after the extraction</tt>
#Some things can not be carried out during evaluation - for example 
#the ensure_presence_of_pattern constraint (since the evaluation is top
#to bottom, at a given point we don't know yet whether the currently
#evaluated pattern will have a child pattern or not) or removing unneeded
#results caused by evaluating multiple filters.
#
#The sole purpose of this class is to execute these post-processing tasks.
  class PostProcessor
    ##
    #This is just a convenience method do call all the postprocessing 
    #functionality and checks
    def self.apply_post_processing(root_pattern)
      ensure_presence_of_pattern_full(root_pattern)      
      remove_multiple_filter_duplicates(root_pattern) if root_pattern.children[0].filters.size > 1
      report_if_no_results(root_pattern) if root_pattern.evaluation_context.extractor.get_mode != :production
    end
  
    ##
    #Apply the ensure_presence_of_pattern constraint on 
    #the full extractor
    def self.ensure_presence_of_pattern_full(pattern)
      ensure_presence_of_pattern(pattern)
      pattern.children.each {|child| ensure_presence_of_pattern_full(child)}
    end  
  
    ##
    #Remove unneeded results of a pattern (caused by evaluating multiple filters)
    #See for example the B&N scenario - the book titles are extracted two times
    #for every pattern (since both examples generate the same XPath for them)
    #but since always only one of the results has a price, the other is discarded
    def self.remove_multiple_filter_duplicates(pattern)
      remove_multiple_filter_duplicates_intern(pattern) if pattern.parent_of_leaf
      pattern.children.each {|child| remove_multiple_filter_duplicates(child)}
    end
    
    ##
    #Issue an error report if the document did not extract anything.
    #Probably this is because the structure of the page changed or 
    #because of some rather nasty bug - in any case, something wrong 
    #is going on, and we need to inform the user about this!
    def self.report_if_no_results(root_pattern)
      results_found = false
      root_pattern.children.each {|child| return if (child.result.childmap.size > 0)}
      
      Scrubyt.log :WARNING, [
        "The extractor did not find any result instances. Most probably this is wrong.",
        "Check your extractor and if you are sure it should work, report a bug!"
      ]
    end
  
private
    def self.ensure_presence_of_pattern(pattern)
      #holds the name of those child patterns which have to be present as children of the input parameter  
      epop_names = pattern.constraints.select {|c| c.type == Scrubyt::Constraint::CONSTRAINT_TYPE_ENSURE_PRESENCE_OF_PATTERN}.map {|c| c.target}
      return if epop_names.empty?
      #all_parent_values holds instances extracted by pattern    
      all_parent_values = []
      pattern.result.childmap.each { |h| all_parent_values << h.values }
      all_parent_values.flatten!
      #indices of result instances (of pattern) we are going to remove
      results_to_remove = Set.new
      pattern.children.each do |child_pattern|
        #all_child_values holds instances extracted by child_pattern
        all_child_values = []
        child_pattern.result.childmap.each { |h| all_child_values << h.values }
        all_child_values.flatten!
      
        #populate results_to_remove
        i = 0      
        all_parent_values.each do |parent_value|
          #Hey! Not just the direct children but all the ancestors
          @found_ancestor = false
          check_ancestors(parent_value, all_child_values)
          
          results_to_remove << i if (!@found_ancestor && (epop_names.include? child_pattern.name))
          i += 1
        end
      end   
      #based on results_to_remove, populate the array 'rejected' which holds the actual instances
      #(and not indices, as in the case of results_to_remove!). In other words, we are mapping 
      #results_to_remove indices to their actual instances
      rejected = []    
      i = -1 
      pattern.result.childmap.each do |h|
        h.each { |k,v| rejected = v.reject {|e| i += 1; !results_to_remove.include? i } }
      end    
      
      #Finally, do the actual delete!
      pattern.result.childmap.each { |h| h.each { |k,v| rejected.each  { |r| v.delete(r)} } }    
    end
    
    def self.check_ancestors(parent_value, all_child_values)
      parent_value.children.each { |child| @found_ancestor = true if all_child_values.include? child } if
parent_value.is_a? Hpricot::Elem
      parent_value.children.each { |child| check_ancestors(child, all_child_values) if child.is_a? Hpricot::Elem } if parent_value.is_a? Hpricot::Elem    
    end
  
    def self.remove_multiple_filter_duplicates_intern(pattern)
      possible_duplicates = {}
      longest_result = 0
      pattern.result.childmap.each { |r|
        r.each do |k,v|
          v.each do |x|
            all_child_results = []
            pattern.children.each { |child| 
              temp_res = child.result.lookup(x) 
              all_child_results << temp_res if temp_res != nil
            }
            next if all_child_results.size <= 1
            longest_result = all_child_results.map {|e| e.size}.max
            all_child_results.each { |r| (r.size+1).upto(longest_result) { r << nil } }
            possible_duplicates[x] = all_child_results.transpose
          end            
        end
      }
      #Determine the 'real' duplicates
      real_duplicates = {}
      possible_duplicates.each { |k,v|
        next if v.size == 1
        v.each { |r| real_duplicates[k] = r }
      }
      
      #Finally, remove them!
      pattern.children.each { |child| 
        child.result.childmap.each { |r|
          r.each { |k,v|     
           real_duplicates[k].each {|e| v.delete e} if real_duplicates.keys.include? k
          }
        }
      }
    end #end of function
  end #end of class PostProcessor
end #end of module Scrubyt