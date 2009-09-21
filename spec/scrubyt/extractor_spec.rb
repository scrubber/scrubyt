require "#{File.dirname(__FILE__)}/../spec_helper.rb"
require "#{File.dirname(__FILE__)}/../../lib/scrubyt.rb"
require "#{File.dirname(__FILE__)}/../../plugins/scrubyt_xml_file_output/scrubyt_xml_file_output"
require "mechanize"
require "json"
require "rexml/element"

describe "Extractor" do
  include MockFactory
  
  describe "when initializing" do
    
    def do_extractor(options = {})
      @extractor = Scrubyt::Extractor.new options do
      end
    end
    
    it "should store passed in arguments as options" do
      do_extractor(:agent => :ajax) 
      @extractor.options[:agent].should == :ajax
    end

    it "should default options if none are passed" do
      do_extractor
      @extractor.options[:agent].should == :standard
      @extractor.options[:output].should == :hash
    end

    it "should accept a block as a second parameter" do
      @extractor = Scrubyt::Extractor.new(:agent => :standard, :output => :hash) do
      end
      @extractor.should be_a_kind_of(Scrubyt::Extractor)
    end

    it "should accept the block as the only parameter" do
      @extractor = Scrubyt::Extractor.new do
      end
      @extractor.should be_a_kind_of(Scrubyt::Extractor)    
    end

    it "should execute the block within the extractor" do
      Scrubyt::Extractor.should_receive(:tester).and_return(true)
      @extractor = Scrubyt::Extractor.new :agent => :standard do
        self.class.tester
      end
    end
    
    describe "and configuring options" do
      it "should instantiate mechanize for standard extractor" do
        WWW::Mechanize.should_receive(:new)
        @extractor = Scrubyt::Extractor.new(:agent => :standard) do
        end
      end
      
      it "should be able to log output" do
        #         mock_mechanize
        # @extractor = Scrubyt::Extractor.new(:log_level => :verbose) do
        #   fetch "http://www.google.com"
        # end
        pending
      end
    end
    
  end
  
  describe "when navigating to a page" do
    describe "when using a standard extractor" do
      
      before(:each) do
        mock_mechanize
      end
            
      def do_extractor
        @extractor = Scrubyt::Extractor.new(:agent => :standard) do
          fetch "http://www.google.com"
        end
      end
        
      it "should call get on the mechanize agent" do
        @mechanize_agent.should_receive(:get).with("http://www.google.com").and_return(@mechanize_page)
        do_extractor
      end

      describe "and navigating to a subsequent page" do
        
        it "should limit the rate results are retrieved" do
          @extractor = Scrubyt::Extractor.new(:agent => :standard, :rate_limit => 2) do
            self.should_receive(:sleep).with(2).exactly(2).times
            fetch "http://www.google.com"
            fetch "http://www.yahoo.com"
          end
        end
        
        it "should handle a fully qualified URL" do
          mock_mechanize
          @mechanize_agent.should_receive(:get).with("http://www.google.com").and_return(@mechanize_page)
          @mechanize_agent.should_receive(:get).with("http://www.yahoo.com").and_return(@mechanize_page)
          @extractor = Scrubyt::Extractor.new(:agent => :standard) do
            fetch "http://www.google.com"
            fetch "http://www.yahoo.com"
          end
        end

        it "should handle a relative URL" do
          mock_mechanize
          @mechanize_page.should_receive(:uri).at_least(:once).and_return("http://www.google.com/search/index.html")
          @mechanize_agent.should_receive(:get).with("http://www.google.com/search/index.html").and_return(@mechanize_page)
          @mechanize_agent.should_receive(:get).with("http://www.google.com/search/../somewhere/index.html").and_return(@mechanize_page)
          @extractor = Scrubyt::Extractor.new(:agent => :standard) do
            fetch "http://www.google.com/search/index.html"
            fetch "../somewhere/index.html"
          end
        end
        
        it "should not try to go up beyond base path" do
          mock_mechanize
          @mechanize_page.should_receive(:uri).at_least(:once).and_return("http://www.google.com/")
          @mechanize_agent.should_receive(:get).with("http://www.google.com/").and_return(@mechanize_page)
          @mechanize_agent.should_receive(:get).with("http://www.google.com/somewhere/index.html").and_return(@mechanize_page)
          @extractor = Scrubyt::Extractor.new(:agent => :standard) do
            fetch "http://www.google.com/"
            fetch "../../somewhere/index.html"
          end
        end

        it "should handle an absolute URL" do
          mock_mechanize
          @mechanize_page.should_receive(:uri).at_least(:once).and_return("http://www.google.com/search/index.html")
          @mechanize_agent.should_receive(:get).with("http://www.google.com/search/index.html").and_return(@mechanize_page)
          @mechanize_agent.should_receive(:get).with("http://www.google.com/somewhere/index.html").and_return(@mechanize_page)
          @extractor = Scrubyt::Extractor.new(:agent => :standard) do
            fetch "http://www.google.com/search/index.html"
            fetch "/somewhere/index.html"
          end
        end

        it "should handle just a query string" do
          mock_mechanize
          @mechanize_page.should_receive(:uri).at_least(:once).and_return("http://www.google.com/search/index.html")
          @mechanize_agent.should_receive(:get).with("http://www.google.com/search/index.html").and_return(@mechanize_page)
          @mechanize_agent.should_receive(:get).with("http://www.google.com/search/index.html?q=something").and_return(@mechanize_page)
          @extractor = Scrubyt::Extractor.new(:agent => :standard) do
            fetch "http://www.google.com/search/index.html"
            fetch "?q=something"
          end
        end
        
        it "should append query string parameter to existing page" do
          mock_mechanize
          @mechanize_page.should_receive(:uri).at_least(:once).and_return("http://www.google.com/search/index.html?q=something")
          @mechanize_agent.should_receive(:get).with("http://www.google.com/search/index.html?q=something&other=else").and_return(@mechanize_page)
          @extractor = Scrubyt::Extractor.new(:agent => :standard) do
            fetch "http://www.google.com/search/index.html?q=something"
            fetch "&other=else"
          end
        end
        
        it "should replace query string parameter if already exists" do
          mock_mechanize
          @mechanize_page.should_receive(:uri).at_least(:once).and_return("http://www.google.com/search/index.html?q=something&other=else")
          @mechanize_agent.should_receive(:get).with("http://www.google.com/search/index.html?q=new&other=else").and_return(@mechanize_page)
          @extractor = Scrubyt::Extractor.new(:agent => :standard) do
            fetch "http://www.google.com/search/index.html?q=something&other=else"
            fetch "&q=new"
          end          
        end

        it "should handle just filename" do
          mock_mechanize
          @mechanize_page.should_receive(:uri).at_least(:once).and_return("http://www.google.com/search/index.html")
          @mechanize_agent.should_receive(:get).with("http://www.google.com/search/index.html").and_return(@mechanize_page)
          @mechanize_agent.should_receive(:get).with("http://www.google.com/search/other.html").and_return(@mechanize_page)
          @extractor = Scrubyt::Extractor.new(:agent => :standard) do
            fetch "http://www.google.com/search/index.html"
            fetch "other.html"
          end
        end
        
        it "should fix form action for Mechanize can process correcly" do
          mock_mechanize
          @form.should_receive(:action).and_return("?q=something")
          @form.should_receive(:action=).and_return("http://www.google.com/search/index.html?q=something")
          @extractor = Scrubyt::Extractor.new(:agent => :standard) do
            fetch "http://www.google.com/search/index.html"
            submit
          end
        end
        
        it "should submit a form" do
          mock_mechanize
          @mechanize_agent.should_receive(:submit).and_return(@mechanize_page)
          @extractor = Scrubyt::Extractor.new(:agent => :standard) do
            fetch "http://www.google.com/"
            submit
          end
        end
        
        it "should be able to submit a form by name" do
          mock_mechanize
          @form.should_receive(:name).and_return("form_one")
          @extractor = Scrubyt::Extractor.new(:agent => :standard) do
            fetch "http://www.google.com/"
            submit :form_name => "form_one"
          end
        end
        
        it "should be able to submit a button by displayed value" do
          mock_google_results
          @extractor = Scrubyt::Extractor.new(:agent => :standard) do
            fetch "http://www.google.com/search/index.html?q=something"
            submit "I'm Feeling Lucky"
          end
        end
        
        it "should be able to submit a button by XPath" do
          mock_google_results
          button = mock("button", :value => "Search", :name => "btnG")
          buttons = [mock("button", :value => "I'm Feeling Lucky", :name => "btnG"),
                     button]
          @form.stub!(:buttons).and_return(buttons)          
          @mechanize_agent.should_receive(:submit).with(@form, button)
          @extractor = Scrubyt::Extractor.new(:agent => :standard) do
            fetch "http://www.google.com/search/index.html?q=something"
            submit "//input[@type='submit'][@value='Search']"
          end
        end

        it "should be able to adjust XPaths to ones we support" do
          mock_google_results
          button = mock("button", :value => "Search", :name => "btnG")
          buttons = [mock("button", :value => "I'm Feeling Lucky", :name => "btnG"),
                     button]
          @form.stub!(:buttons).and_return(buttons)          
          @mechanize_agent.should_receive(:submit).with(@form, button)
          @extractor = Scrubyt::Extractor.new(:agent => :standard) do
            fetch "http://www.google.com/search/index.html?q=something"
            submit "./html//input[@type='submit'][@value='Search']"
          end
        end

        
        it "should submit the first form on the page by default" do
          @mechanize_agent.should_receive(:submit).with(@form, anything()).and_return(@mechanize_page)
          @extractor = Scrubyt::Extractor.new(:agent => :standard) do
            fetch "http://www.google.com/"
            submit
          end
        end
        
        it "should fill in a text field" do
          field = mock("field")
          @form.should_receive(:field).with("q").at_least(:once).and_return(field)
          field.should_receive(:value=).with("example text")
          @extractor = Scrubyt::Extractor.new(:agent => :standard) do
            fetch "http://www.google.com/"
            fill_textfield "q", "example text"
          end
        end
        
        it "should be able to fill in a text field within a named form" do
          mock_named_form
          @field.should_receive(:value=).with("example text")
          @extractor = Scrubyt::Extractor.new(:agent => :standard) do
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
          @extractor = Scrubyt::Extractor.new(:agent => :standard) do
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
          @extractor = Scrubyt::Extractor.new(:agent => :standard) do
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
            @extractor = Scrubyt::Extractor.new do
              fetch "http://www.amazon.com/s/ref=nb_ss_gw?url=search-alias%3Daps&field-keywords=ruby&x=0&y=0"
              result_detail "//table[@id='searchTemplate']//td[@class='dataColumn']//tr[1]/td[1]/a" do
                book_title "//h1"
              end
            end
          end

          it "should ascend a detail path until we have a link" do
            @mechanize_agent.should_receive(:get).with("http://www.amazon.com/Ruby-Programming-Language-David-Flanagan/dp/0596516177/ref=pd_bbs_sr_1?ie=UTF8&s=books&qid=1216806952&sr=8-1").and_return(@result_page1)
            @mechanize_agent.should_receive(:get).with("http://www.amazon.com/Beginning-Ruby-Novice-Professional/dp/1590597664/ref=pd_bbs_2_s9_rk?ie=UTF8&s=books&s9r=8a5801be1145d82801118ed052b50980&itemPosition=2&qid=1216806952&sr=8-2").and_return(@result_page2)
            @extractor = Scrubyt::Extractor.new do
              fetch "http://www.amazon.com/s/ref=nb_ss_gw?url=search-alias%3Daps&field-keywords=ruby&x=0&y=0"
              result_detail "//table[@id='searchTemplate']//td[@class='dataColumn']//tr[1]/td[1]/a/span" do
                book_title "//h1"
              end
            end
          end
          
          it "should be able to adjust XPaths to ones we support" do
            @mechanize_agent.should_receive(:get).with("http://www.amazon.com/Ruby-Programming-Language-David-Flanagan/dp/0596516177/ref=pd_bbs_sr_1?ie=UTF8&s=books&qid=1216806952&sr=8-1").and_return(@result_page1)
            @mechanize_agent.should_receive(:get).with("http://www.amazon.com/Beginning-Ruby-Novice-Professional/dp/1590597664/ref=pd_bbs_2_s9_rk?ie=UTF8&s=books&s9r=8a5801be1145d82801118ed052b50980&itemPosition=2&qid=1216806952&sr=8-2").and_return(@result_page2)
            @extractor = Scrubyt::Extractor.new do
              fetch "http://www.amazon.com/s/ref=nb_ss_gw?url=search-alias%3Daps&field-keywords=ruby&x=0&y=0"
              result_detail "./html//table[@id='searchTemplate']/tbody//td[@class='dataColumn']//tr[1]/td[1]/a" do
                book_title "./html//h1"
              end
            end
          end
          
          it "should only navigate to pages whose url is accepted by the if block" do
            @mechanize_agent.should_receive(:get).with("http://www.amazon.com/Ruby-Programming-Language-David-Flanagan/dp/0596516177/ref=pd_bbs_sr_1?ie=UTF8&s=books&qid=1216806952&sr=8-1").and_return(@result_page1)
            @mechanize_agent.should_not_receive(:get).with("http://www.amazon.com/Beginning-Ruby-Novice-Professional/dp/1590597664/ref=pd_bbs_2_s9_rk?ie=UTF8&s=books&s9r=8a5801be1145d82801118ed052b50980&itemPosition=2&qid=1216806952&sr=8-2").and_return(@result_page2)
            @extractor = Scrubyt::Extractor.new do
              fetch "http://www.amazon.com/s/ref=nb_ss_gw?url=search-alias%3Daps&field-keywords=ruby&x=0&y=0"
              result_detail "//table[@id='searchTemplate']//td[@class='dataColumn']//tr[1]/td[1]/a", :if => lambda {|url| url =~ /Flanagan/} do
                book_title "//h1"
              end
            end
          end
                    
          it "should navigate to a next link (with a detail block)" do
            @mechanize_agent.should_receive(:get).with("http://www.amazon.com/s/qid=1216806952/ref=sr_pg_2?ie=UTF8&rs=&keywords=ruby&rh=i%3Aaps%2Ck%3Aruby&page=2"
              ).exactly(:once).and_return(@results_list2)
            @extractor = Scrubyt::Extractor.new do
              fetch "http://www.amazon.com/s/ref=nb_ss_gw?url=search-alias%3Daps&field-keywords=ruby&x=0&y=0"
              result_detail "//table[@id='searchTemplate']//td[@class='dataColumn']//tr[1]/td[1]/a" do
                book_title "//h1"
              end
              next_page "//a[@id='pagnNextLink']", :limit => 1
            end
          end
          
          it "should be able to adjust XPaths to ones we support" do
            @mechanize_agent.should_receive(:get).with("http://www.amazon.com/s/qid=1216806952/ref=sr_pg_2?ie=UTF8&rs=&keywords=ruby&rh=i%3Aaps%2Ck%3Aruby&page=2"
              ).exactly(:once).and_return(@results_list2)
            @extractor = Scrubyt::Extractor.new do
              fetch "http://www.amazon.com/s/ref=nb_ss_gw?url=search-alias%3Daps&field-keywords=ruby&x=0&y=0"
              result_detail "//table[@id='searchTemplate']//td[@class='dataColumn']//tr[1]/td[1]/a" do
                book_title "//h1"
              end
              next_page "./html//a[@id='pagnNextLink']", :limit => 1
            end
          end
          
          it "should navigate to a next link (without a detail block)" do
            @mechanize_agent.should_receive(:get).with("http://www.amazon.com/s/qid=1216806952/ref=sr_pg_2?ie=UTF8&rs=&keywords=ruby&rh=i%3Aaps%2Ck%3Aruby&page=2"
              ).exactly(:once).and_return(@results_list2)
            @extractor = Scrubyt::Extractor.new do
              fetch "http://www.amazon.com/s/ref=nb_ss_gw?url=search-alias%3Daps&field-keywords=ruby&x=0&y=0"
              result "//td[@class='searchItem']" do
                book_title "//span[@class='srTitle']"
              end
              next_page "//a[@id='pagnNextLink']", :limit => 1
            end
          end
          
          
          it "should be able to define next link with script processing" do
            @mechanize_agent.should_receive(:get).with( "http://www.otherpage.com/"
              ).exactly(:once).and_return(@results_list2)
            @extractor = Scrubyt::Extractor.new do
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
            @extractor = Scrubyt::Extractor.new do
              fetch "http://www.amazon.com/s/ref=nb_ss_gw?url=search-alias%3Daps&field-keywords=ruby&x=0&y=0"
              result_detail "//table[@id='searchTemplate']//td[@class='dataColumn']//tr[1]/td[1]/a" do
                book_title "//h1"
              end
              next_page "//a[@id='pagnNextLink']", :limit => 3
            end
          end
          
          it "should return nested result blocks" do
            @mechanize_agent.should_receive(:get).with("http://www.amazon.com/Ruby-Programming-Language-David-Flanagan/dp/0596516177/ref=pd_bbs_sr_1?ie=UTF8&s=books&qid=1216806952&sr=8-1").and_return(@result_page1)
            @mechanize_agent.should_receive(:get).with("http://www.amazon.com/Beginning-Ruby-Novice-Professional/dp/1590597664/ref=pd_bbs_2_s9_rk?ie=UTF8&s=books&s9r=8a5801be1145d82801118ed052b50980&itemPosition=2&qid=1216806952&sr=8-2").and_return(@result_page2)
            @extractor = Scrubyt::Extractor.new do
              fetch "http://www.amazon.com/s/ref=nb_ss_gw?url=search-alias%3Daps&field-keywords=ruby&x=0&y=0"
              result "//td[@class='searchitem']" do
                shipping "//td[@class='srListSSS']"
                book_detail "//td[@class='dataColumn']//tr[1]/td[1]/a" do
                  book_title "//h1"
                end
              end
            end
            @extractor.results.should include(:result => [
                                                { :shipping=>"Eligible for FREE Super Saver Shipping."},
                                                { :book => [
                                                  { :book_title => "The Ruby Programming Language [ILLUSTRATED]  (Paperback)"}
                                                ]}
                                              ])
            
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
          @extractor = Scrubyt::Extractor.new do
            fetch "http://www.google.com/search?&q=ruby"
            result "//html/body/div[5]/div/div/h2/a"
          end
          @extractor.results.should include(:result => "Ruby Programming Language")
          @extractor.results.should include(:result => "Ruby Home Page - What's Ruby")
        end

        it "should return the attribute" do
          @extractor = Scrubyt::Extractor.new do
            fetch "http://www.google.com/search?&q=ruby"
            result "//html/body/div[5]/div/div/h2/a", :attribute => :href
          end
          @extractor.results.should include(:result => "http://www.ruby-lang.org/")
          @extractor.results.should include(:result => "http://www.ruby-lang.org/en/20020101.html")
        end    
        
        it "should pass value into block and return value to extractor" do
          @extractor = Scrubyt::Extractor.new do
            fetch "http://www.google.com/search?&q=ruby"
            result "//html/body/div[5]/div/div/h2/a", :script => lambda{|r| "!Test!#{r}!Test!"}
          end
          @extractor.results.should include(:result => "!Test!Ruby Programming Language!Test!")
          @extractor.results.should include(:result => "!Test!Ruby Home Page - What's Ruby!Test!")
        end
        
        it "should return multiple values within an example" do
          @extractor = Scrubyt::Extractor.new do
            fetch "http://www.google.com/search?&q=ruby"
            result "//html/body/div[5]/div/div" do
              title "//h2"
              url "//span[@class='a']"
            end
          end
          @extractor.results.should include(:result => [
                                              {:title => "Ruby Home Page - What's Ruby"},
                                              {:url => "www.ruby-lang.org/en/20020101.html - 12k - "}])
        end 
        
        it "should return nil values within an example if no match" do
          @extractor = Scrubyt::Extractor.new do
            fetch "http://www.google.com/search?&q=ruby"
            result "//html/body/div[5]/div/div" do
              title "//h2"
              url "//span[@class='a']"
              image "//a/img", :attribute => :src
            end
          end
          result_with_nil = @extractor.results.detect{|rs| rs[:result].detect{|r| r[:image].nil?}}
          result_with_nil.should be          
        end 
        
      end

    end    

    describe "from a query with detail pages" do
        
      before(:each) do
        mock_amazon_results
      end
      
      it "should return result from detail page" do
        @extractor = Scrubyt::Extractor.new do
          fetch "http://www.amazon.com/s/ref=nb_ss_gw?url=search-alias%3Daps&field-keywords=ruby&x=0&y=0"
          result_detail "//table[@id='searchTemplate']//td[@class='dataColumn']//tr[1]/td[1]/a" do
            book_title "//h1"
          end
        end
        @extractor.results.should include(:result => [
            {:book_title => "The Ruby Programming Language [ILLUSTRATED]  (Paperback)" }])
      end
      
      it "should return the current url" do
        @extractor = Scrubyt::Extractor.new do
          fetch "http://www.amazon.com/s/ref=nb_ss_gw?url=search-alias%3Daps&field-keywords=ruby&x=0&y=0"
          result_detail "//table[@id='searchTemplate']//td[@class='dataColumn']//tr[1]/td[1]/a" do
            current_url
          end
        end
        @extractor.results.should include(:result => [
            {:current_url => "http://www.amazon.com/Ruby-Programming-Language-David-Flanagan/dp/0596516177/ref=pd_bbs_sr_1?ie=UTF8&s=books&qid=1216806952&sr=8-1" }])
      end
      
      it "should return the current url within a result block" do
        @extractor = Scrubyt::Extractor.new do
          fetch "http://www.amazon.com/s/ref=nb_ss_gw?url=search-alias%3Daps&field-keywords=ruby&x=0&y=0"
          result_detail "//table[@id='searchTemplate']//td[@class='dataColumn']//tr[1]/td[1]/a" do
            another_result "//div[@class='bucket']" do
              current_url
            end
          end
        end
        results = @extractor.results.detect{|rs| rs[:result].detect{|ars| ars[:another_result] && ars[:another_result].include?({:current_url => "http://www.amazon.com/Ruby-Programming-Language-David-Flanagan/dp/0596516177/ref=pd_bbs_sr_1?ie=UTF8&s=books&qid=1216806952&sr=8-1"})}}        
        results.should be
      end
      
      
      it "should return multiple elements on a detail page" do
        @extractor = Scrubyt::Extractor.new do
          fetch "http://www.amazon.com/s/ref=nb_ss_gw?url=search-alias%3Daps&field-keywords=ruby&x=0&y=0"
          result_detail "//table[@id='searchTemplate']//td[@class='dataColumn']//tr[1]/td[1]/a" do
            book_title "//h1"
            list_price "//td[@class='listprice']"
          end
        end
        result = @extractor.results.first[:result]
        result.index({:list_price => "$39.99 "}).should be
        result.index({:book_title => "The Ruby Programming Language [ILLUSTRATED]  (Paperback)"}).should be
      end
      
      it "should concatenate multiple elements if requested" do
        @extractor = Scrubyt::Extractor.new do
          fetch "http://www.amazon.com/s/ref=nb_ss_gw?url=search-alias%3Daps&field-keywords=ruby&x=0&y=0"
          result_detail "//table[@id='searchTemplate']//td[@class='dataColumn']//tr[1]/td[1]/a" do
            book_title "//h1"
            list_price "//td[@class='listprice']"
          end
        end
        pending
      end
      
      it "should be able to limit the number of results in a given level/detail" do
        @extractor = Scrubyt::Extractor.new do
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
        @extractor = Scrubyt::Extractor.new do
          fetch "http://www.amazon.com/s/ref=nb_ss_gw?url=search-alias%3Daps&field-keywords=ruby&x=0&y=0"
          result_detail "//table[@id='searchTemplate']//td[@class='dataColumn']//tr[1]/td[1]/a" do
            book_title "//h1", :script => Proc.new{|r| r if r.match(/novice to professional/i)},
                               :remove_blank => true
            summary "//p"
          end
        end
        all_results = @extractor.results
        book_title_results = all_results.select{|rd| rd[:result].detect{|r| r.has_key?(:book_title)}}
        book_title_results.size.should == 1
        all_results.size.should > 1
      end
      
      it "should be able to specify certain fields are required" do
        @extractor = Scrubyt::Extractor.new do
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
        @extractor = Scrubyt::Extractor.new do
          fetch "http://www.amazon.com/s/ref=nb_ss_gw?url=search-alias%3Daps&field-keywords=ruby&x=0&y=0"
          result_detail "//table[@id='searchTemplate']//td[@class='dataColumn']//tr[1]/td[1]/a", :required => :all do
            book_title "//h1", :script => Proc.new{|r| r if r.match(/novice to professional/i)}
            summary "//p"
          end
        end
        @extractor.results.size.should == 1
      end
            
      it "should return results from next pages" do
        @extractor = Scrubyt::Extractor.new do
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
    
    describe "with compound examples" do      
      before(:each) do
        mock_extended_examples
      end
      
      it "should include the first element from each definition" do
        @extractor = Scrubyt::Extractor.new do
                       fetch "http://www.amazon.com/s/ref=nb_ss_gw?url=search-alias%3Daps&field-keywords=ruby&x=0&y=0"
                       result ["//td[@class='propertyAddress']", "//td[@class='addressDetails']", "//td[@class='bedrooms']", "//td[@class='description']"], :compound => true
                     end
        @extractor.results.size.should == 10
        dulwich_result = @extractor.results[0][:result]
        nunhead_result = @extractor.results[1][:result]
        dulwich_result.should match(/East Dulwich/)
        dulwich_result.should match(/If you're looking for a great/)
        nunhead_result.should match(/Nunhead/)
        nunhead_result.should match(/This is a great chance/)
      end
      
      it "should return nested results" do
        @extractor = Scrubyt::Extractor.new do
                       fetch "http://www.amazon.com/s/ref=nb_ss_gw?url=search-alias%3Daps&field-keywords=ruby&x=0&y=0"
                       record ["//td[@class='propertyAddress']", "//td[@class='addressDetails']", "//td[@class='bedrooms']", "//td[@class='description']"], :compound => true do
                         bedrooms "//td[@class='bedrooms']"
                         description "//td[@class='description']"
                         link "//td[@class='description']//a", :attribute => :href
                       end
                     end
        dulwich_result = @extractor.results[0][:record]
        nunhead_result = @extractor.results[1][:record]
        dulwich_bedrooms = dulwich_result.detect{|r| r.has_key?(:bedrooms)}[:bedrooms]
        dulwich_description = dulwich_result.detect{|r| r.has_key?(:description)}[:description]
        dulwich_link = dulwich_result.detect{|r| r.has_key?(:link)}[:link]
        nunhead_bedrooms = nunhead_result.detect{|r| r.has_key?(:bedrooms)}[:bedrooms]
        nunhead_description = nunhead_result.detect{|r| r.has_key?(:description)}[:description]
        nunhead_link = nunhead_result.detect{|r| r.has_key?(:link)}[:link]
        
        dulwich_bedrooms.should match(/1 bedroom/)
        dulwich_description.should match(/If you're looking for a great/)
        dulwich_link.should match(/propertyID=95155/)
        nunhead_bedrooms.should match(/1 bedroom/)
        nunhead_description.should match(/This is a great chance/)
        nunhead_link.should match(/propertyID=91457/)
      end      
    end
    
    describe "with a simple example" do      
      before(:each) do
        mock_extended_examples
      end
      
      it "should not require duplicate specification of container element like a compound does" do
        @extractor = Scrubyt::Extractor.new do
                       fetch "http://scrubyt.com/"
                       record "//td[@class='propertyAddress']" do
                         link "/span/a", :attribute => :href
                       end
                     end
        dulwich_result = @extractor.results[0][:record]
        nunhead_result = @extractor.results[1][:record]
        dulwich_link = dulwich_result.detect{|r| r.has_key?(:link)}[:link]
        nunhead_link = nunhead_result.detect{|r| r.has_key?(:link)}[:link]

        dulwich_link.should match(/propertyID=95155/)
        nunhead_link.should match(/propertyID=91457/)
      end
      
      it "should work even if class definitions have extra spaces" do
         @extractor = Scrubyt::Extractor.new do
                         fetch "http://scrubyt.com/"
                         record "//td[@class='propertyAddress']" do
                           link "/span/a", :attribute => :href
                         end
                       end
          lewisham_result = @extractor.results[2][:record]
          lewisham_link = lewisham_result.detect{|r| r.has_key?(:link)}[:link]
          gipsy_hill_result = @extractor.results[3][:record]
          gipsy_hill_link = gipsy_hill_result.detect{|r| r.has_key?(:link)}[:link]
          
          @extractor.results.size.should == 10
          lewisham_link.should match(/propertyID=95125/)
          gipsy_hill_link.should match(/propertyID=91459/)
      end
    end
    
    describe "with multiple examples" do      
      before(:each) do
        mock_extended_examples
      end

      it "should return all elements matching the examples" do
        @extractor = Scrubyt::Extractor.new do
                       fetch "http://www.amazon.com/s/ref=nb_ss_gw?url=search-alias%3Daps&field-keywords=ruby&x=0&y=0"
                       result ["//td[@class='propertyAddress']", "//td[@class='addressDetails']", "//td[@class='bedrooms']", "//td[@class='description']"]
                     end
        @extractor.results.size.should == 40
      end
      
      it "should return nested results" do
        @extractor = Scrubyt::Extractor.new do
                       fetch "http://www.amazon.com/s/ref=nb_ss_gw?url=search-alias%3Daps&field-keywords=ruby&x=0&y=0"
                       record ["//td[@class='propertyAddress']", "//td[@class='addressDetails']", "//td[@class='bedrooms']", "//td[@class='description']"] do
                         result "//a"
                       end
                     end
        @extractor.results.should include({:record=>[{:result=>"East Dulwich"}]})
        @extractor.results.should include({:record=>[{:result=>"More details & photos"}]})
      end
    end

    describe "to an xml file" do
      
      before(:each) do
        mock_google_results
        @file =  mock("file")
        @file.stub!(:write)
      end
      
      def do_extractor
        @extractor = Scrubyt::Extractor.new :output => :xml_file, :file => @file do
          fetch "http://www.google.com/search?&q=ruby"
          result "//html/body/div[5]/div/div/h2/a"
        end
      end
      
      it "should not store any results in memory" do
        do_extractor
        @extractor.results.should be_empty
      end
            
      it "should create XML element" do
        element = mock("element")
        element.stub!(:text=)
        REXML::Element.should_receive(:new).at_least(:once).and_return(element)
        do_extractor
      end
      
      it "should nest detail pages in xml" do
        mock_amazon_results
        @file.should_receive(:write).at_least(:once).with("<root>")
        @file.should_receive(:write).with("<result><book_title>Sea Lion</book_title><list_price>$13.98 </list_price></result>")
        @file.should_receive(:write).at_least(:once).with("</root>")
        @extractor = Scrubyt::Extractor.new :output => :xml_file, :file => @file do
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
        pending
      end
      
      it "should save results to model as processed" do
        pending
      end
            
      it "should nest models" do
        pending
      end
      
      it "should be able to specify additional attributes to merge in" do
        pending
      end
    end
  end
  
  describe "when generating from JSON" do
    
    before(:each) do
      mock_cross_site_examples
    end
    
    describe "and it's a flat definition structure" do
      
      def scraper_json
        [{ :fetch => "http://scrubyt.test/" },
         { :submit => nil },
         { :result => { :xpath => "//h2"} },
         { :next_page => { :xpath => "//ol[@class='pagination']/li/a[text()='Next']"}}].to_json
      end
      
      it "should return results" do
        @extractor = Scrubyt::Extractor.new(:json => scraper_json)
        @extractor.results.should include(:result => "scRUBYt!")
        @extractor.results.should include(:result => "Ruby, Rails, Web2.0")
      end      
      
      it "should handle a special URL case" do
        this_json = [{ :fetch => "http://scrubyt.test/" },
                     { :submit => nil },
                     { :result => { :url => "current_url"} }].to_json
        
        @extractor = Scrubyt::Extractor.new(:json => this_json)
        @extractor.results.should include(:result => "http://scrubyt.test/cross_site_results_mock.html")
      end
      
    end
    
    describe "and it's a nested definition structure" do
      
      def scraper_json
        [{ :fetch => "http://scrubyt.test/" },
         { :submit => nil},
         { :result => {
             :xpath => "//ol//li",
             :block => [
               { :title => { :xpath => "//h2"},
                 :description => { :xpath => "//p"}}
               ]
             }
          }].to_json
      end
      
      it "should return results" do
        @extractor = Scrubyt::Extractor.new(:json => scraper_json)
        @extractor.results.should include(:result => [{ :title => "scRUBYt!" }, 
                                                      { :description => "The best web scraping framework around!"}])
        @extractor.results.should include(:result => [{ :title => "Ruby Pond" },
                                                      { :description => "Glenn Gillen's company"}])
      end
    end
    
    describe "and it's got detail blocks" do
      
      def scraper_json
        [{ :fetch => "http://scrubyt.test/" },
         { :submit => nil},
         { :page_detail => {
           :xpath => "//a",
           :block => [
             { :image => { :xpath => "//img", :attribute => :src }}]
          }},
         { :next_page => { :xpath => "//ol[@class='pagination']/li/a[text()='Next']"}}
         ].to_json
      end
      
      it "should return results" do
        @extractor = Scrubyt::Extractor.new(:json => scraper_json)
        @extractor.results.should be_include({ :page => [{ :image => "scrubyt-image-1.gif" }, 
                                                         { :image => "scrubyt-image-2.gif" }, 
                                                         { :image => "scrubyt-image-3.gif" }, 
                                                         { :image => "scrubyt-image-4.gif" }]})
      end
      
      it "should follow next links" do
        @mechanize_agent.should_receive(:get).with("http://scrubyt.test/2.html")
        @extractor = Scrubyt::Extractor.new(:json => scraper_json)
      end
      
    end
    
    describe "and it's nested with detail blocks" do
      
      def scraper_json
        [{ :fetch => "http://scrubyt.test/" },
         { :submit => nil},
         { :result => {
             :xpath => "//ol//li",
             :block => [
               { :title => { :xpath => "//h2"},
                 :description => { :xpath => "//p"},
                 :page_detail => {
                   :xpath => "//a",
                   :block => [
                     { :image => { :xpath => "//img", :attribute => :src }}]
                  }
                }
              ]
            }
          }
        ].to_json
      end
      
      it "should return results" do
        @extractor = Scrubyt::Extractor.new(:json => scraper_json)
        result = @extractor.results.detect{|r| r[:result].include?({:title => "scRUBYt!"})}[:result]
        result.should be_include({ :description => "The best web scraping framework around!"})
        result.should be_include({ :page => [{ :image => "scrubyt-image-1.gif" }, 
                                             { :image => "scrubyt-image-2.gif" }, 
                                             { :image => "scrubyt-image-3.gif" }, 
                                             { :image => "scrubyt-image-4.gif" }]})
      end
    end
  end
end
