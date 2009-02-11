Gem::Specification.new do |s|
  s.name = %q{scrubyt}
  s.summary = "A powerful Web-scraping framework built on Mechanize and Hpricot (and FireWatir)"
  s.version = "0.4.12" 
  s.authors = ["Peter Szinek", "Glenn Gillen"]
  s.date = %q{2009-01-31}
  s.description = %q{scRUBYt! is an easy to learn and use, yet powerful and effective web scraping framework. It's most interesting part is a Web-scraping DSL built on HPricot and WWW::Mechanize, which allows to navigate to the page of interest, then extract and query data records with a few lines of code. It is hard to describe scRUBYt! in a few sentences - you have to see it for yourself!}
  s.email = ["peter@rubyrailways.com",'glenn.gillen@gmail.com']
  s.files = ['COPYING', 'README', 'CHANGELOG', 'Rakefile', "lib/scrubyt/core/navigation/agents/firewatir.rb", "lib/scrubyt/core/navigation/agents/mechanize.rb", "lib/scrubyt/core/navigation/fetch_action.rb", "lib/scrubyt/core/navigation/navigation_actions.rb", "lib/scrubyt/core/scraping/compound_example.rb", "lib/scrubyt/core/scraping/constraint.rb", "lib/scrubyt/core/scraping/constraint_adder.rb", "lib/scrubyt/core/scraping/filters/attribute_filter.rb", "lib/scrubyt/core/scraping/filters/base_filter.rb", "lib/scrubyt/core/scraping/filters/constant_filter.rb", "lib/scrubyt/core/scraping/filters/detail_page_filter.rb", "lib/scrubyt/core/scraping/filters/download_filter.rb", "lib/scrubyt/core/scraping/filters/html_subtree_filter.rb", "lib/scrubyt/core/scraping/filters/regexp_filter.rb", "lib/scrubyt/core/scraping/filters/script_filter.rb", "lib/scrubyt/core/scraping/filters/text_filter.rb", "lib/scrubyt/core/scraping/filters/tree_filter.rb", "lib/scrubyt/core/scraping/pattern.rb", "lib/scrubyt/core/scraping/pre_filter_document.rb", "lib/scrubyt/core/scraping/result_indexer.rb", "lib/scrubyt/core/shared/extractor.rb", "lib/scrubyt/logging.rb", "lib/scrubyt/output/post_processor.rb", "lib/scrubyt/output/result.rb", "lib/scrubyt/output/result_dumper.rb", "lib/scrubyt/output/result_node.rb", "lib/scrubyt/output/scrubyt_result.rb", "lib/scrubyt/utils/compound_example_lookup.rb", "lib/scrubyt/utils/ruby_extensions.rb", "lib/scrubyt/utils/shared_utils.rb", "lib/scrubyt/utils/simple_example_lookup.rb", "lib/scrubyt/utils/xpathutils.rb", "lib/scrubyt.rb"]
  s.test_files = ["test/blackbox_test.rb", "test/blackbox_tests/basic/multi_root.rb", "test/blackbox_tests/basic/simple.rb", "test/blackbox_tests/detail_page/one_detail_page.rb", "test/blackbox_tests/detail_page/two_detail_pages.rb", "test/blackbox_tests/next_page/next_page_link.rb", "test/blackbox_tests/next_page/page_list_links.rb"]
  s.has_rdoc = true
  s.homepage = %q{http://scrubyt.org/}
  s.rubyforge_project = %q{scrubyt}
  s.rubygems_version = %q{1.3.1}
  s.add_dependency('hpricot', '>= 0.5')
  s.add_dependency('mechanize', '>= 0.6.3')   
end
