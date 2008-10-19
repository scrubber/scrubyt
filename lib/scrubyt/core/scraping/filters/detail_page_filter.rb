module Scrubyt
  class DetailPageFilter < BaseFilter

    def evaluate(source)
      if source.is_a?(String)
        url = source
      else
        url = XPathUtils.find_nearest_node_with_attribute(source, 'href').attributes['href']
      end
      @parent_pattern.extractor.store_page
      original_host_name = @parent_pattern.extractor.get_host_name
      @parent_pattern.extractor.restore_host_name

      begin
        FetchAction.fetch url, :resolve => @parent_pattern.resolve 
      rescue
        Scrubyt.log :ERROR, "Couldn't get page, probably returned 404 or 500 status code"
      end
      

      if @detail_extractor.nil?
        @detail_extractor = Extractor.new @parent_pattern.extractor.mode, @parent_pattern.referenced_extractor
        root_results = @detail_extractor.result
      else
        root_results = @detail_extractor.evaluate_extractor
      end



      @parent_pattern.extractor.restore_page
      @parent_pattern.extractor.store_host_name original_host_name

      root_results
    end

    def get_detail_sexp
      [:block, *@detail_extractor.result.root_patterns.to_sexp_array]
    end

  end
end
