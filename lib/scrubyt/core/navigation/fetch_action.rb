module Scrubyt
  ##
  #=<tt>Fetching pages (and related functionality)</tt>
  #
  #Since lot of things are happening during (and before)
  #the fetching of a document, I decided to move out fetching related
  #functionality to a separate class - so if you are looking for anything
  #which is loading a document (even by submitting a form or clicking a link)
  #and related things like setting a proxy etc. you should find it here.
  module FetchAction
    @@current_doc_url = nil
    @@current_doc_protocol = nil
    @@base_dir = nil
    @@host_name = nil
    @@history = []
    @@current_form = nil
    
    ##
    # At any given point, the current document can be queried with this method; Typically used
    # when the navigation is over and the result document is passed to the wrapper
    def self.get_current_doc_url
      @@current_doc_url
    end

    def self.get_mechanize_doc
      @@mechanize_doc
    end

    def self.get_hpricot_doc
      @@hpricot_doc
    end

    def get_host_name
      @@host_name
    end

    def restore_host_name
      return if @@current_doc_protocol == 'file'
      @@host_name = @@original_host_name
    end

    def store_page
      @@history.push @@hpricot_doc
    end

    def restore_page
      @@hpricot_doc = @@history.pop
    end

    def store_host_name(doc_url)
      FetchAction.store_host_name(doc_url)
    end
  end
end