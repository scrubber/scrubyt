$:.unshift File.join(File.dirname(__FILE__), '../../..//lib')

require 'scrubyt'

#Will comment later
reddit_data = Scrubyt::Extractor.define do
  fetch 'http://programming.reddit.com'
  
  article_info do
    article_title("Top Ten Mistakes in Web Design", :generalize => true).select_indices([:first,:every_third])
    #article_title_url "Top Ten Mistakes in Web Design", :generalize => true do
    #  url 'href', :type => :attribute
    #end.select_indices([:first,:every_third])
    vote_string '11 points', :generalize => true do
      votes /\d+/
    end
  end

end

reddit_data.to_xml.write($stdout, 1)
#ResultDumper.print_statistics(reddit_data)
#reddit_data.export(__FILE__)
