require "#{File.dirname(__FILE__)}/../spec_helper.rb"
require "#{File.dirname(__FILE__)}/../../lib/skimr.rb"

require "mechanize"
require "rexml/element"

describe "Extractor" do
  include MockFactory
  
	describe "when initializing" do
		
		def do_extractor(options = {})
			@extractor = Skimr::Extractor.new options do
			end
		end
		
		it "should store passed in arguments as options" do
			do_extractor(:agent => :ajax, :output => :xml) 
			@extractor.options[:agent].should == :ajax
			@extractor.options[:output].should == :xml
		end

		it "should default options if none are passed" do
			do_extractor
			@extractor.options[:agent].should == :standard
			@extractor.options[:output].should == :hash
		end

		it "should accept a block as a second parameter" do
			@extractor = Skimr::Extractor.new(:agent => :standard, :output => :hash) do
			end
			@extractor.should be_a_kind_of(Skimr::Extractor)
		end

		it "should accept the block as the only parameter" do
			@extractor = Skimr::Extractor.new do
			end
			@extractor.should be_a_kind_of(Skimr::Extractor)		
		end

		it "should execute the block within the extractor" do
			Skimr::Extractor.should_receive(:tester).and_return(true)
			@extractor = Skimr::Extractor.new :agent => :standard do
				self.class.tester
			end
		end
		
		describe "and configuring options" do
			it "should instantiate mechanize for standard extractor" do
				WWW::Mechanize.should_receive(:new)
				@extractor = Skimr::Extractor.new(:agent => :standard) do
				end
			end
			
			it "should be able to log output" do
			  mock_mechanize
			  logger = mock("logger")
			  logger.should_receive(:log).at_least(:once)
				@extractor = Skimr::Extractor.new(:log => logger) do
				  fetch "http://www.google.com"
				end
			end
		end
		
	end
	
	describe "when navigating to a page" do
		describe "when using a standard extractor" do
			
			before(:each) do
				mock_mechanize
			end
						
			def do_extractor
				@extractor = Skimr::Extractor.new(:agent => :standard) do
					fetch "http://www.google.com"
				end
			end
				
			it "should call get on the mechanize agent" do
				@mechanize_agent.should_receive(:get).with("http://www.google.com").and_return(@mechanize_page)
				do_extractor
			end

			describe "and navigating to a subsequent page" do
			  
			  it "should limit the rate results are retrieved" do
          @extractor = Skimr::Extractor.new(:agent => :standard, :rate_limit => 2) do
            self.should_receive(:sleep).with(2).exactly(2).times
            fetch "http://www.google.com"
            fetch "http://www.yahoo.com"
          end
			  end
			  
				it "should handle a fully qualified URL" do
				  mock_mechanize
				  @mechanize_agent.should_receive(:get).with("http://www.google.com").and_return(@mechanize_page)
				  @mechanize_agent.should_receive(:get).with("http://www.yahoo.com").and_return(@mechanize_page)
					@extractor = Skimr::Extractor.new(:agent => :standard) do
  					fetch "http://www.google.com"
  					fetch "http://www.yahoo.com"
  				end
				end

				it "should handle a relative URL" do
				  mock_mechanize
				  @mechanize_page.should_receive(:uri).at_least(:once).and_return("http://www.google.com/search/index.html")
				  @mechanize_agent.should_receive(:get).with("http://www.google.com/search/index.html").and_return(@mechanize_page)
				  @mechanize_agent.should_receive(:get).with("http://www.google.com/search/../somewhere/index.html").and_return(@mechanize_page)
					@extractor = Skimr::Extractor.new(:agent => :standard) do
  					fetch "http://www.google.com/search/index.html"
  					fetch "../somewhere/index.html"
  				end
				end
				
				it "should not try to go up beyond base path" do
				  mock_mechanize
				  @mechanize_page.should_receive(:uri).at_least(:once).and_return("http://www.google.com/")
				  @mechanize_agent.should_receive(:get).with("http://www.google.com/").and_return(@mechanize_page)
				  @mechanize_agent.should_receive(:get).with("http://www.google.com/somewhere/index.html").and_return(@mechanize_page)
					@extractor = Skimr::Extractor.new(:agent => :standard) do
  					fetch "http://www.google.com/"
  					fetch "../../somewhere/index.html"
  				end
				end

				it "should handle an absolute URL" do
					mock_mechanize
					@mechanize_page.should_receive(:uri).at_least(:once).and_return("http://www.google.com/search/index.html")
				  @mechanize_agent.should_receive(:get).with("http://www.google.com/search/index.html").and_return(@mechanize_page)
				  @mechanize_agent.should_receive(:get).with("http://www.google.com/somewhere/index.html").and_return(@mechanize_page)
					@extractor = Skimr::Extractor.new(:agent => :standard) do
  					fetch "http://www.google.com/search/index.html"
  					fetch "/somewhere/index.html"
  				end
				end

				it "should handle just a query string" do
					mock_mechanize
					@mechanize_page.should_receive(:uri).at_least(:once).and_return("http://www.google.com/search/index.html")
				  @mechanize_agent.should_receive(:get).with("http://www.google.com/search/index.html").and_return(@mechanize_page)
				  @mechanize_agent.should_receive(:get).with("http://www.google.com/search/index.html?q=something").and_return(@mechanize_page)
					@extractor = Skimr::Extractor.new(:agent => :standard) do
  					fetch "http://www.google.com/search/index.html"
  					fetch "?q=something"
  				end
				end
				
				it "should append query string parameter to existing page" do
					mock_mechanize
					@mechanize_page.should_receive(:uri).at_least(:once).and_return("http://www.google.com/search/index.html?q=something")
				  @mechanize_agent.should_receive(:get).with("http://www.google.com/search/index.html?q=something&other=else").and_return(@mechanize_page)
					@extractor = Skimr::Extractor.new(:agent => :standard) do
  					fetch "http://www.google.com/search/index.html?q=something"
  					fetch "&other=else"
  				end
				end
				
				it "should replace query string parameter if already exists" do
					mock_mechanize
					@mechanize_page.should_receive(:uri).at_least(:once).and_return("http://www.google.com/search/index.html?q=something&other=else")
				  @mechanize_agent.should_receive(:get).with("http://www.google.com/search/index.html?q=new&other=else").and_return(@mechanize_page)
					@extractor = Skimr::Extractor.new(:agent => :standard) do
  					fetch "http://www.google.com/search/index.html?q=something&other=else"
  					fetch "&q=new"
  				end				  
				end

				it "should handle just filename" do
					mock_mechanize
					@mechanize_page.should_receive(:uri).at_least(:once).and_return("http://www.google.com/search/index.html")
				  @mechanize_agent.should_receive(:get).with("http://www.google.com/search/index.html").and_return(@mechanize_page)
				  @mechanize_agent.should_receive(:get).with("http://www.google.com/search/other.html").and_return(@mechanize_page)
					@extractor = Skimr::Extractor.new(:agent => :standard) do
  					fetch "http://www.google.com/search/index.html"
  					fetch "other.html"
  				end
				end
				
				it "should fix form action for Mechanize can process correcly" do
				  mock_mechanize
				  @form.should_receive(:action).and_return("?q=something")
				  @form.should_receive(:action=).and_return("http://www.google.com/search/index.html?q=something")
					@extractor = Skimr::Extractor.new(:agent => :standard) do
  					fetch "http://www.google.com/search/index.html"
  					submit
  				end
				end
				
				it "should submit a form" do
				  mock_mechanize
				  @mechanize_agent.should_receive(:submit).and_return(@mechanize_page)
					@extractor = Skimr::Extractor.new(:agent => :standard) do
  					fetch "http://www.google.com/"
  					submit
  				end
				end
				
				it "should be able to submit a form by name" do
				  mock_mechanize
		  	  @form.should_receive(:name).and_return("form_one")
					@extractor = Skimr::Extractor.new(:agent => :standard) do
  					fetch "http://www.google.com/"
  					submit :form_name => "form_one"
  				end
				end
				
				it "should be able to submit a button by displayed value" do
          #           mock_mechanize
          #           @form.should_receive(:name).and_return("form_one")
          # @extractor = Skimr::Extractor.new(:agent => :standard) do
          #             fetch "http://www.google.com/"
          #             submit "I'm Feeling Lucky"
          #           end
  				pending
				end
				
				it "should submit the first form on the page by default" do
				  @mechanize_agent.should_receive(:submit).with(@form, anything()).and_return(@mechanize_page)
					@extractor = Skimr::Extractor.new(:agent => :standard) do
  					fetch "http://www.google.com/"
  					submit
  				end
				end
				
				it "should fill in a text field" do
				  field = mock("field")
				  @form.should_receive(:field).with("q").at_least(:once).and_return(field)
				  field.should_receive(:value=).with("example text")
				  @extractor = Skimr::Extractor.new(:agent => :standard) do
  					fetch "http://www.google.com/"
  					fill_textfield "q", "example text"
  				end
				end
				
				it "should be able to fill in a text field within a named form" do
				  mock_named_form
				  @field.should_receive(:value=).with("example text")
				  @extractor = Skimr::Extractor.new(:agent => :standard) do
  					fetch "http://www.google.com/"
  					fill_textfield "q", "example text", :form => "named_form"
  					submit
  				end
				end
				
				it "should select a drop down option" do
				  field = mock("field")
				  option = mock("option")
          option.should_receive(:text).and_return("Displayed Option Text")				  
				  field.stub!(:options).and_return([option])
				  @form.should_receive(:field).with("select_name").at_least(:once).and_return(field)
				  option.should_receive(:select)
				  @extractor = Skimr::Extractor.new(:agent => :standard) do
  					fetch "http://www.google.com/"
  					select_option "select_name", "Displayed Option Text"
  				end
				end
				
				it "should submit the form for the last element that was updated" do
				  form2 = mock("form")
				  field = mock("field")
				  field.stub!(:value=)
				  form2.stub!(:field).with("q").and_return(field)
				  form2.stub!(:action).and_return("")
				  form2.stub!(:action=)
				  @forms << form2
				  @mechanize_agent.should_receive(:submit).with(form2, anything()).and_return(@mechanize_page)
					@extractor = Skimr::Extractor.new(:agent => :standard) do
  					fetch "http://www.google.com/"
  					fill_textfield "q", "example text"
  					submit
  				end
				end
				
				describe "and handling detail pages" do
				  
				  before(:each) do
				    mock_amazon_results
				  end

				  it "should navigate to the page of interest" do
				    @mechanize_agent.should_receive(:get).with("http://www.amazon.com/Ruby-Programming-Language-David-Flanagan/dp/0596516177/ref=pd_bbs_sr_1?ie=UTF8&s=books&qid=1216806952&sr=8-1").and_return(@result_page1)
				    @mechanize_agent.should_receive(:get).with("http://www.amazon.com/Beginning-Ruby-Novice-Professional/dp/1590597664/ref=pd_bbs_2_s9_rk?ie=UTF8&s=books&s9r=8a5801be1145d82801118ed052b50980&itemPosition=2&qid=1216806952&sr=8-2").and_return(@result_page2)
				    @extractor = Skimr::Extractor.new do
      				fetch "http://www.amazon.com/s/ref=nb_ss_gw?url=search-alias%3Daps&field-keywords=ruby&x=0&y=0"
      				result_detail "//table[@id='searchTemplate']//td[@class='dataColumn']//tr[1]/td[1]/a" do
      				  book_title "//h1"
      				end
      			end
				  end
				  				  
				  it "should navigate to a next link" do
				    @mechanize_agent.should_receive(:get).with("http://www.amazon.com/s/qid=1216806952/ref=sr_pg_2?ie=UTF8&rs=&keywords=ruby&rh=i%3Aaps%2Ck%3Aruby&page=2"
				      ).exactly(:once).and_return(@results_list2)
            @extractor = Skimr::Extractor.new do
      				fetch "http://www.amazon.com/s/ref=nb_ss_gw?url=search-alias%3Daps&field-keywords=ruby&x=0&y=0"
      				result_detail "//table[@id='searchTemplate']//td[@class='dataColumn']//tr[1]/td[1]/a" do
      				  book_title "//h1"
      				end
    				  next_page "//a[@id='pagnNextLink']", :limit => 1
      			end
  				end
  				
  				it "should be able to define next link with script processing" do
				    @mechanize_agent.should_receive(:get).with( "http://www.otherpage.com/"
				      ).exactly(:once).and_return(@results_list2)
            @extractor = Skimr::Extractor.new do
      				fetch "http://www.amazon.com/s/ref=nb_ss_gw?url=search-alias%3Daps&field-keywords=ruby&x=0&y=0"
      				result_detail "//table[@id='searchTemplate']//td[@class='dataColumn']//tr[1]/td[1]/a" do
      				  book_title "//h1"
      				end
    				  next_page "//a[@id='pagnNextLink']", :limit => 1, :script => lambda{|r| "http://www.otherpage.com/"}
      			end  				  
  				end
  				
  				it "should limit how many next pages are fetched" do
  				  @mechanize_agent.should_receive(:get).with("http://www.amazon.com/s/qid=1216806952/ref=sr_pg_2?ie=UTF8&rs=&keywords=ruby&rh=i%3Aaps%2Ck%3Aruby&page=2"
  				      ).exactly(3).times.and_return(@results_list1)
            @extractor = Skimr::Extractor.new do
      				fetch "http://www.amazon.com/s/ref=nb_ss_gw?url=search-alias%3Daps&field-keywords=ruby&x=0&y=0"
      				result_detail "//table[@id='searchTemplate']//td[@class='dataColumn']//tr[1]/td[1]/a" do
      				  book_title "//h1"
      				end
    				  next_page "//a[@id='pagnNextLink']", :limit => 3
      			end
  				end
  				
				end				
			end					
		end
	end

	describe "when extracting the results" do
	  
	  describe "from a google query" do
	    
	    before(:each) do
	      mock_google_results
	    end

	    describe "and providing an xpath example" do
	      it "should return the element text" do
    	    @extractor = Skimr::Extractor.new do
    				fetch "http://www.google.com/search?&q=ruby"
    				result "//html/body/div[5]/div/div/h2/a"
    			end
    			@extractor.results.should include(:result => "Ruby Programming Language")
    			@extractor.results.should include(:result => "Ruby Home Page - What's Ruby")
    	  end

    	  it "should return the attribute" do
    	    @extractor = Skimr::Extractor.new do
    				fetch "http://www.google.com/search?&q=ruby"
    				result "//html/body/div[5]/div/div/h2/a", :attribute => :href
    			end
    			@extractor.results.should include(:result => "http://www.ruby-lang.org/")
    			@extractor.results.should include(:result => "http://www.ruby-lang.org/en/20020101.html")
    	  end	  
    	  
    	  it "should pass value into block and return value to extractor" do
    	    @extractor = Skimr::Extractor.new do
    				fetch "http://www.google.com/search?&q=ruby"
    				result "//html/body/div[5]/div/div/h2/a", :script => lambda{|r| "!Test!#{r}!Test!"}
    			end
    			@extractor.results.should include(:result => "!Test!Ruby Programming Language!Test!")
    			@extractor.results.should include(:result => "!Test!Ruby Home Page - What's Ruby!Test!")
    	  end
    	  
    	  it "should return multiple values within an example" do
    	    @extractor = Skimr::Extractor.new do
    				fetch "http://www.google.com/search?&q=ruby"
    				result "//html/body/div[5]/div/div" do
    				  title "//h2"
    				  url "//span[@class='a']"
    				end
    			end
    			@extractor.results.should include(:result => [{ 
    			                                  :title => "Ruby Home Page - What's Ruby",
    			                                  :url => "www.ruby-lang.org/en/20020101.html - 12k - "}])
    			@extractor.results.should include(:result => [{
    			                                  :title => "Ruby Home Page - What's Ruby",
    			                                  :url => "www.ruby-lang.org/en/20020101.html - 12k - "}])
    	  end 
    	  
    	  it "should return nil values within an example if no match" do
    	    @extractor = Skimr::Extractor.new do
    				fetch "http://www.google.com/search?&q=ruby"
    				result "//html/body/div[5]/div/div" do
    				  title "//h2"
    				  url "//span[@class='a']"
    				  image "//a/img", :attribute => :src
    				end
    			end
    			@extractor.results.should include(:result => [{ 
    			                                  :title => "Ruby Home Page - What's Ruby",
    			                                  :url => "www.ruby-lang.org/en/20020101.html - 12k - ",
    			                                  :image => nil}])
    			@extractor.results.should include(:result => [{
    			                                  :title => "Kaiser Chiefs - Ruby",
    			                                  :url => "www.youtube.com/watch?v=JMDcOViViNY",
    			                                  :image => "http://img.youtube.com/vi/JMDcOViViNY/2.jpg"}])
    	  end 
    	  
	    end

  	end		

		describe "from a query with detail pages" do
			  
		  before(:each) do
		    mock_amazon_results
		  end
		  
		  it "should return result from detail page" do
		    @extractor = Skimr::Extractor.new do
  				fetch "http://www.amazon.com/s/ref=nb_ss_gw?url=search-alias%3Daps&field-keywords=ruby&x=0&y=0"
  				result_detail "//table[@id='searchTemplate']//td[@class='dataColumn']//tr[1]/td[1]/a" do
  				  book_title "//h1"
  				end
  			end
  			@extractor.results.should include(:result => [{ :book_title => "The Ruby Programming Language [ILLUSTRATED]  (Paperback)" }])
		  end
		  
		  it "should return the current url" do
		    @extractor = Skimr::Extractor.new do
  				fetch "http://www.amazon.com/s/ref=nb_ss_gw?url=search-alias%3Daps&field-keywords=ruby&x=0&y=0"
  				result_detail "//table[@id='searchTemplate']//td[@class='dataColumn']//tr[1]/td[1]/a" do
  				  current_url
  				end
  			end
  			@extractor.results.should include(:result => [{ :current_url => "http://www.amazon.com/Ruby-Programming-Language-David-Flanagan/dp/0596516177/ref=pd_bbs_sr_1?ie=UTF8&s=books&qid=1216806952&sr=8-1" }])
		  end
		  
		  it "should return multiple elements on a detail page" do
		    @extractor = Skimr::Extractor.new do
  				fetch "http://www.amazon.com/s/ref=nb_ss_gw?url=search-alias%3Daps&field-keywords=ruby&x=0&y=0"
  				result_detail "//table[@id='searchTemplate']//td[@class='dataColumn']//tr[1]/td[1]/a" do
  				  book_title "//h1"
  				  list_price "//td[@class='listprice']"
  				end
  			end
  			@extractor.results.should include(:result => [{ 
  			      :book_title => "The Ruby Programming Language [ILLUSTRATED]  (Paperback)",
  			      :list_price => "$39.99 "
  			       }])
		  end
		  
		  it "should concatenate multiple elements if requested" do
		    @extractor = Skimr::Extractor.new do
  				fetch "http://www.amazon.com/s/ref=nb_ss_gw?url=search-alias%3Daps&field-keywords=ruby&x=0&y=0"
  				result_detail "//table[@id='searchTemplate']//td[@class='dataColumn']//tr[1]/td[1]/a" do
  				  book_title "//h1"
  				  list_price "//td[@class='listprice']"
  				end
  			end
        pending
		  end
		  
		  it "should be able to limit the number of results in a given level/detail" do
		    @extractor = Skimr::Extractor.new do
  				fetch "http://www.amazon.com/s/ref=nb_ss_gw?url=search-alias%3Daps&field-keywords=ruby&x=0&y=0"
  				result_detail "//table[@id='searchTemplate']//td[@class='dataColumn']//tr[1]/td[1]/a" do
  				  book_title "//h1"
  				  summary "//p", :limit => 2
  				end
  			end
  			summaries = @extractor.results.first[:result].select{|r| r.has_key?(:summary)}
        summaries.size.should == 2
		  end
		  
		  it "should be able to not return any result if match is empty or nil" do
		    @extractor = Skimr::Extractor.new do
  				fetch "http://www.amazon.com/s/ref=nb_ss_gw?url=search-alias%3Daps&field-keywords=ruby&x=0&y=0"
  				result_detail "//table[@id='searchTemplate']//td[@class='dataColumn']//tr[1]/td[1]/a" do
  				  book_title "//h1", :script => Proc.new{|r| r if r.match(/novice to professional/i)},
  				                     :remove_blank => true
  				  summary "//p"
  				end
  			end
  			all_results = @extractor.results
  			book_title_results = @extractor.results.select{|rd| rd[:result].detect{|r| r.has_key?(:book_title)}}
        book_title_results.size.should == 1
  			all_results.size.should > 1
		  end
		  
		  it "should be able to specify certain fields are required" do
		    @extractor = Skimr::Extractor.new do
  				fetch "http://www.amazon.com/s/ref=nb_ss_gw?url=search-alias%3Daps&field-keywords=ruby&x=0&y=0"
  				result_detail "//table[@id='searchTemplate']//td[@class='dataColumn']//tr[1]/td[1]/a" do
  				  book_title "//h1", :script => Proc.new{|r| r if r.match(/novice to professional/i)},
  				                     :required => true
  				  summary "//p"
  				end
  			end
  			@extractor.results.size.should == 1
		  end
		  
		  it "should be able to specify that all fields are required" do
		    @extractor = Skimr::Extractor.new do
  				fetch "http://www.amazon.com/s/ref=nb_ss_gw?url=search-alias%3Daps&field-keywords=ruby&x=0&y=0"
  				result_detail "//table[@id='searchTemplate']//td[@class='dataColumn']//tr[1]/td[1]/a", :required => :all do
  				  book_title "//h1", :script => Proc.new{|r| r if r.match(/novice to professional/i)}
  				  summary "//p"
  				end
  			end
  			@extractor.results.size.should == 1
		  end
		  			
			it "should return results from next pages" do
        @extractor = Skimr::Extractor.new do
  				fetch "http://www.amazon.com/s/ref=nb_ss_gw?url=search-alias%3Daps&field-keywords=ruby&x=0&y=0"
  				result_detail "//table[@id='searchTemplate']//td[@class='dataColumn']//tr[1]/td[1]/a" do
  				  book_title "//h1"
  				end
          next_page "//a[@id='pagnNextLink']", :limit => 1
  			end
  			@extractor.results.should include(:result => [{ :book_title => "The Ruby Programming Language [ILLUSTRATED]  (Paperback)" }])
  			@extractor.results.should include(:result => [{ :book_title => "Beginning Ruby: From Novice to Professional (Beginning from Novice to Professional) (Paperback)" }])
  			@extractor.results.should include(:result => [{ :book_title => "10K Yellow Gold 1.3ct. Ruby and Sapphire 5MM Stud Set" }])
  			@extractor.results.should include(:result => [{ :book_title => "Sea Lion" }])
			end
							
		end					

    describe "to an xml file" do
      
      before(:each) do
	      mock_google_results
	      @file =  mock("file")
	      @file.stub!(:write)
	    end
	    
	    def do_extractor
	      @extractor = Skimr::Extractor.new :output => :xml, :file => @file do
  				fetch "http://www.google.com/search?&q=ruby"
  				result "//html/body/div[5]/div/div/h2/a"
  			end
	    end
      
      it "should not store any results in memory" do
        do_extractor
  			@extractor.results.should be_empty
      end
      
      it "should stream results to a file as processed" do
        @file.should_receive(:write).with("<root>")
        @file.should_receive(:write).with("<result>Ruby Programming Language</result>")
        @file.should_receive(:write).with("<result>Ruby Home Page - What&apos;s Ruby</result>")
        @file.should_receive(:write).with("</root>")
        do_extractor
      end
      
      it "should create XML element" do
        element = mock("element")
        element.stub!(:text=)
        REXML::Element.should_receive(:new).at_least(:once).and_return(element)
        do_extractor
      end
      
      it "should nest detail pages in xml" do
        mock_amazon_results
        @file.should_receive(:write).at_least(:once).with("<result>")
        @file.should_receive(:write).with("<book_title>Sea Lion</book_title>")
        @file.should_receive(:write).with("<list_price>$13.98 </list_price>")
        @file.should_receive(:write).at_least(:once).with("</result>")
        @extractor = Skimr::Extractor.new :output => :xml, :file => @file do
  				fetch "http://www.amazon.com/s/ref=nb_ss_gw?url=search-alias%3Daps&field-keywords=ruby&x=0&y=0"
  				result_detail "//table[@id='searchTemplate']//td[@class='dataColumn']//tr[1]/td[1]/a" do
  				  book_title "//h1"
  				  list_price "//td[@class='listprice']"
  				end
  				next_page "//a[@id='pagnNextLink']", :limit => 1
  			end
      end
      
    end

    describe "to a model" do
      it "should not store any results in memory" do
        # do_extractor
        # @extractor.results.should be_empty
  			pending
      end
      
      it "should save results to model as processed" do
        pending
      end
            
      it "should nest models" do
        pending
      end
      
      it "should be able to specify additional attributes to merge in" do
        
      end
    end
	end
	
end
