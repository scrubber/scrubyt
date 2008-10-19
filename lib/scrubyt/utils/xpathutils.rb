require 'rubygems'
require 'hpricot'

module Scrubyt
  ##
  #=<tt>Various XPath utility functions</tt>
  class XPathUtils

    #Find the LCA (Lowest Common Ancestor) of two nodes
    def self.lowest_common_ancestor(node1, node2)
      path1 = traverse_up(node1)
      path2 = traverse_up(node2)
      return node1.parent if path1 == path2

      closure = nil
      while (!path1.empty? && !path2.empty?)
	    closure = path1.pop
	    return closure.parent if (closure != path2.pop)
      end
      path1.size > path2.size ? path1.last.parent : path2.last.parent
    end

    ##
    #Generate XPath for the given node
    #
    #*parameters*
    #
    #_node_ - The node we are looking up the XPath for
    #
    #_stopnode_ - The Xpath generation is stopped and the XPath that
    #was generated so far is returned if this node is reached.
    #
    #_write_indices_ - whether the index inside the parent shuold be
    #added, as in html[1]/body[1]/table[2]/tr[1]/td[8]
    def self.generate_XPath(node, stopnode=nil, write_indices=false)
      path = []
      indices = []
      found = false
      while !node.nil? && node.class != Hpricot::Doc do
        if node == stopnode
          found = true
          break
        end
        path.push node.name
        indices.push find_index(node) if write_indices
        node = node.parent
      end
      #This condition ensures that if there is a stopnode, and we did not found it along the way,
      #we return nil (since the stopnode is not contained in the path at all)
      return nil if stopnode != nil && !found
      result = ""
      if write_indices
        path.reverse.zip(indices.reverse).each { |node,index| result += "#{node}[#{index}]/" }
      else
        path.reverse.each{ |node| result += "#{node}/" }
      end
      "/" + result.chop
    end

    #Generate an XPath of the node with indices, relatively to the given
    #relative_root.
    #
    #For example if the elem's absolute XPath is /a/b/c,
    #and the relative root's Xpath is a/b, the result of the function will
    #be /c.
    def self.generate_relative_XPath( elem,relative_root )
      return nil if (elem == relative_root)
      generate_XPath(elem, relative_root, true)
    end

    #Generate a generalized XPath (i.e. without indices) of the node,
    #relatively to the given relative_root.
    #
    #For example if the elem's absolute XPath is /a[1]/b[3]/c[5],
    #and the relative root's Xpath is a[1]/b[3], the result of the function will
    #be /c.
    def self.generate_generalized_relative_XPath( elem,relative_root )
      return nil if (elem == relative_root)
      generate_XPath(elem, relative_root, false)
    end

    #Find an image based on the src of the example
    #
    #*parameters*
    #
    #_doc_ - The containing document
    #
    #_example_ - The value of the src attribute of the img tag
    #This is convenient, since if the users rigth-clicks an image and
    #copies image location, this string will be copied to the clipboard
    #and thus can be easily pasted as an examle
    #
    #_index_ - there might be more images with the same src on the page -
    #most typically the user will need the 0th - but if this is not the
    #case, there is the possibility to override this
    def self.find_image(doc, example, index=0)
      if example =~ /\.(jpg|png|gif|jpeg)(\[\d+\])$/
        res = example.scan(/(.+)\[(\d+)\]$/)
        example = res[0][0]
        index = res[0][1].to_i
      end
      (doc/"//img[@src='#{example}']")[index]
    end

    ##
    #Used to find the parent of a node with the given name - for example
    #find the <form> node which is the parent of the <input> node
    def self.traverse_up_until_name(node, name)
      while node.class != Hpricot::Doc do
        #raise "The element is nil! This probably means the widget with the specified name ('#{name}') does not exist" unless node
        return nil unless node
        break if node.name == name
        node = node.parent
      end
      node
    end

    ##
    #Used when automatically looking up href attributes (for detail or next links)
    #If the detail pattern did not extract a link, we first look up it's
    #children - and if we don't find a link, traverse up
    def self.find_nearest_node_with_attribute(node, attribute)
      @node = nil
      return node if node.is_a? Hpricot::Elem and node[attribute]
      first_child_node_with_attribute(node, attribute)
      first_parent_node_with_attribute(node, attribute) if !@node
      @node
    end

    ##
    #Generalre relative XPath from two XPaths: a parent one, (which points higher in the tree),
    #and a child one. The result of the method is the relative XPath of the node pointed to
    #by the second XPath to the node pointed to by the firs XPath.
    def self.generate_relative_XPath_from_XPaths(parent_xpath, child_xpath)
      original_child_xpath_parts = child_xpath.split('/').reject{|s|s==""}
      pairs = to_general_XPath(child_xpath).split('/').reject{|s|s==""}.zip to_general_XPath(parent_xpath).split('/').reject{|s|s==""}
      i = 0
      pairs.each_with_index do |pair,index|
        i = index
        break if pair[0] != pair[1]
      end
      "/" + original_child_xpath_parts[i..-1].join('/')
    end

    def self.to_full_XPath(doc, xpath, generalize)
      elem = doc/xpath
      elem = elem.map[0] if elem.is_a? Hpricot::Elements
      XPathUtils.generate_XPath(elem, nil, generalize)
    end

private
    #Find the index of the child inside the parent
    #For example:
    #
    #         tr
    #      /  |   \
    #    td   td   td
    #    0    1    2
    #
    #The last row contains the indices of the td's from the
    #tow above.
    #
    #Note that in classic XPath, the indices start with 1 (rather
    #than 0).
    def self.find_index(node)
     c = 0
     node.parent.children.each do |child|
       if child.class == Hpricot::Elem
         c += 1 if (child.name == node.name)
         break if (node == child)
       end
     end
     c
    end

    def self.traverse_up(node, stopnode=nil)
      path = []
      while node.class != Hpricot::Doc do
        break if node == stopnode
        path.push node
        node = node.parent
      end
    path
    end

    def self.first_child_node_with_attribute(node, attribute)
      return if !node.instance_of? Hpricot::Elem || @node
      @node = node if node.attributes[attribute]
      node.children.each  { |child| first_child_node_with_attribute(child, attribute) }
    end

    def self.first_parent_node_with_attribute(node, attribute)
      return if !node.instance_of? Hpricot::Elem || @node
      @node = node if node.attributes[attribute]
      first_parent_node_with_attribute(node.parent, attribute)
    end

    def self.to_general_XPath(xpath)
      xpath.gsub(/\[.+?\]/) {""}
    end #End of method to_general_XPath
  end #End of class XPathUtils
end #End of module Scrubyt
