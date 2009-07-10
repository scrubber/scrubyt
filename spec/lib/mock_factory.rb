module MockFactory
  
  def mock_path
    "#{File.dirname(__FILE__)}/../mocks"
  end
  
  def mock_mechanize
    @form = mock("form")
    @form.stub!(:field).and_return(false)
    @form.stub!(:action).and_return("form_destination.html")
    @form.stub!(:action=)
    @forms = [@form]
    @mechanize_page = mock("page")
    @mechanize_page.stub!(:body).and_return("")
    @mechanize_page.stub!(:forms).and_return(@forms)
    @mechanize_page.stub!(:uri).and_return("http://www.somepage.com/")
    @mechanize_agent = mock("mechanize")
    @mechanize_agent.stub!(:get).and_return(@mechanize_page)
    @mechanize_agent.stub!(:submit).and_return(@mechanize_page)
    WWW::Mechanize.stub!(:new).and_return(@mechanize_agent)
  end
  
  def mock_google_results
    mock_mechanize
    buttons = [mock("button", :value => "I'm Feeling Lucky", :name => "btnG"),
               mock("button", :value => "Search", :name => "btnG")]
    @form.stub!(:buttons).and_return(buttons)
    test_file = "#{mock_path}/google_results.html"
    @mechanize_page.stub!(:body).and_return(File.open(test_file, "r").read)
  end
  
  def mock_extended_examples
    mock_mechanize
    examples_file = "#{mock_path}/extended_examples.html"
    @mechanize_page.stub!(:body).and_return(File.open(examples_file, "r").read)
  end
  
  def mock_mechanize_page(url, body)
    uri = URI.join(url)
    response = Net::HTTPOK.new(1.1, 200, "OK")
    response['content-type'] = "text/html; charset=utf-8"
    
    WWW::Mechanize::Page.new(uri, response, 
                             body, code="200", mech=@mechanize_agent)
  end
  
  def mock_cross_site_examples
    @mechanize_agent = WWW::Mechanize.new
    WWW::Mechanize.stub!(:new).and_return(@mechanize_agent)
    index_page = mock_mechanize_page("http://scrubyt.test/", File.open("#{mock_path}/cross_site_mock.html", "r").read)
    results_page = mock_mechanize_page("http://scrubyt.test/cross_site_results_mock.html", File.open("#{mock_path}/cross_site_results_mock.html", "r").read)
    scrubyt_page = mock_mechanize_page("http://www.scrubyt.org", File.open("#{mock_path}/cross_site_ext_scrubyt_mock.html", "r").read)
    rubypond_page = mock_mechanize_page("http://rubypond.com", File.open("#{mock_path}/cross_site_ext_rubypond_mock.html", "r").read)
    hexagile_page = mock_mechanize_page("http://www.hexagile.com", File.open("#{mock_path}/cross_site_ext_hexagile_mock.html", "r").read)
    rubyrailways_page = mock_mechanize_page("http://www.rubyrailways.com", File.open("#{mock_path}/cross_site_ext_rubyrailways_mock.html", "r").read)
    @mechanize_agent.stub!(:get).and_return(results_page)
    @mechanize_agent.stub!(:get).with("http://scrubyt.test/").and_return(index_page)
    @mechanize_agent.stub!(:get).with("http://www.scrubyt.org/").and_return(scrubyt_page)
    @mechanize_agent.stub!(:get).with("http://rubypond.com/").and_return(rubypond_page)
    @mechanize_agent.stub!(:get).with("http://www.hexagile.com/").and_return(hexagile_page)
    @mechanize_agent.stub!(:get).with("http://www.rubyrailways.com/").and_return(rubyrailways_page)
  end
  
  def mock_named_form
    @field = mock("field")    
    @form.should_receive(:name).and_return("named_form")
    @form.should_receive(:field).with("q").and_return(@field)
    # field = mock("field")
    # @form.should_receive(:field).with("q").at_least(:once).and_return(field)
    # field.should_receive(:value=).with("example text")
  end
  
  def mock_amazon_results
    mock_mechanize
    results = "#{mock_path}/amazon_results"
    @results_list1 = mock("page1")
    @results_list2 = mock("page2")
    @result_page1 = mock("result")
    @result_page2 = mock("result")
    @result_page3 = mock("result")
    @result_page4 = mock("result")
    @results_list1.stub!(:body).and_return(File.open(results+"_page_1.html", "r").read)
    @results_list1.stub!(:uri).and_return("http://www.amazon.com/s/ref=nb_ss_gw?url=search-alias%3Daps&field-keywords=ruby&x=0&y=0")
    @results_list2.stub!(:body).and_return(File.open(results+"_page_2.html", "r").read)
    @results_list2.stub!(:uri).and_return("http://www.amazon.com/s/qid=1216806952/ref=sr_pg_2?ie=UTF8&rs=&keywords=ruby&rh=i%3Aaps%2Ck%3Aruby&page=2")
    @result_page1.stub!(:body).and_return(File.open(results+"_1.html", "r").read)
    @result_page1.stub!(:uri).and_return("http://www.amazon.com/Ruby-Programming-Language-David-Flanagan/dp/0596516177/ref=pd_bbs_sr_1?ie=UTF8&s=books&qid=1216806952&sr=8-1")
    @result_page2.stub!(:body).and_return(File.open(results+"_2.html", "r").read)
    @result_page2.stub!(:uri).and_return("http://www.amazon.com/Beginning-Ruby-Novice-Professional/dp/1590597664/ref=pd_bbs_2_s9_rk?ie=UTF8&s=books&s9r=8a5801be1145d82801118ed052b50980&itemPosition=2&qid=1216806952&sr=8-2")
    @result_page3.stub!(:body).and_return(File.open(results+"_3.html", "r").read)
    @result_page3.stub!(:uri).and_return("http://www.amazon.com/Yellow-Gold-1-3ct-Ruby-Sapphire/dp/B00073G87O/ref=sr_1_17?ie=UTF8&s=jewelry&qid=1216806934&sr=8-17")
    @result_page4.stub!(:body).and_return(File.open(results+"_4.html", "r").read)
    @result_page4.stub!(:uri).and_return("http://www.amazon.com/Sea-Lion-Ruby-Suns/dp/B0012IWHLE/ref=sr_1_18?ie=UTF8&s=music&qid=1216806934&sr=8-18")
    @mechanize_agent.stub!(:get).with("http://www.amazon.com/s/ref=nb_ss_gw?url=search-alias%3Daps&field-keywords=ruby&x=0&y=0"
        ).and_return(@results_list1)
    @mechanize_agent.stub!(:get).with("http://www.amazon.com/s/qid=1216806952/ref=sr_pg_2?ie=UTF8&rs=&keywords=ruby&rh=i%3Aaps%2Ck%3Aruby&page=2"
        ).and_return(@results_list2)
    @mechanize_agent.stub!(:get).with("http://www.amazon.com/Ruby-Programming-Language-David-Flanagan/dp/0596516177/ref=pd_bbs_sr_1?ie=UTF8&s=books&qid=1216806952&sr=8-1"
        ).and_return(@result_page1)
    @mechanize_agent.stub!(:get).with("http://www.amazon.com/Beginning-Ruby-Novice-Professional/dp/1590597664/ref=pd_bbs_2_s9_rk?ie=UTF8&s=books&s9r=8a5801be1145d82801118ed052b50980&itemPosition=2&qid=1216806952&sr=8-2"
        ).and_return(@result_page2)
    @mechanize_agent.stub!(:get).with("http://www.amazon.com/Yellow-Gold-1-3ct-Ruby-Sapphire/dp/B00073G87O/ref=sr_1_17?ie=UTF8&s=jewelry&qid=1216806934&sr=8-17"
        ).and_return(@result_page3)
    @mechanize_agent.stub!(:get).with("http://www.amazon.com/Sea-Lion-Ruby-Suns/dp/B0012IWHLE/ref=sr_1_18?ie=UTF8&s=music&qid=1216806934&sr=8-18"
        ).and_return(@result_page4)
  end
  
end