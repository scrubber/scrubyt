require 'rake/rdoctask'
require 'rake/testtask'
require 'rake/gempackagetask'
require 'rake/packagetask'

###################################################
# Dependencies
###################################################

task "default" => ["test_all"]
task "generate_rdoc" => ["cleanup_readme"]
task "cleanup_readme" => ["rdoc"]

###################################################
# Gem specification
###################################################

gem_spec = Gem::Specification.new do |s|
  s.name = 'scrubyt'
  s.version = '0.4.10'
  s.summary = 'A powerful Web-scraping framework built on Mechanize and Hpricot (and FireWatir)'
  s.description = %{scRUBYt! is an easy to learn and use, yet powerful and effective web scraping framework. It's most interesting part is a Web-scraping DSL built on HPricot and WWW::Mechanize, which allows to navigate to the page of interest, then extract and query data records with a few lines of code. It is hard to describe scRUBYt! in a few sentences - you have to see it for yourself!}
  # Files containing Test::Unit test cases.
  s.test_files = FileList['test/unittests/**/*']
  # List of other files to be included.
  s.files = FileList['COPYING', 'README', 'CHANGELOG', 'Rakefile', 'lib/**/*.rb']
  s.author = 'Peter Szinek'
  s.email = 'peter@rubyrailways.com'
  s.homepage = 'http://www.scrubyt.org'
  s.add_dependency('hpricot', '>= 0.5')
  s.add_dependency('mechanize', '>= 0.6.3')
  s.has_rdoc = 'true'
end

###################################################
# Tasks
###################################################

Rake::RDocTask.new do |generate_rdoc|
     files = ['lib/**/*.rb', 'README', 'CHANGELOG']
     generate_rdoc.rdoc_files.add(files)
     generate_rdoc.main = "README" # page to start on
     generate_rdoc.title = "Scrubyt Documentation"
     generate_rdoc.template = "resources/allison/allison.rb"
     generate_rdoc.rdoc_dir = 'doc' # rdoc output folder
     generate_rdoc.options << '--line-numbers' << '--inline-source'
end

Rake::TestTask.new(:test_all) do |task|
  task.pattern = 'test/*_test.rb'
end

Rake::TestTask.new(:test_blackbox) do |task|
  task.test_files = ['test/blackbox_test.rb']
end

task "test_specific" do
  ruby "test/blackbox_test.rb #{ARGV[1]}"
end

Rake::TestTask.new(:test_non_blackbox) do |task|
  task.test_files = FileList['test/*_test.rb'] - ['test/blackbox_test.rb']
end

task "rcov" do
  sh 'rcov --xrefs test/*.rb'
  puts 'Report done.'
end

task "cleanup_readme" do
  puts "Cleaning up README..."
  readme_in = open('./doc/files/README.html')
  content = readme_in.read
  content.sub!('<h1 id="item_name">File: README</h1>','')
  content.sub!('<h1>Description</h1>','')
  readme_in.close
  open('./doc/files/README.html', 'w') {|f| f.write(content)}
  #OK, this is uggly as hell and as non-DRY as possible, but
  #I don't have time to deal with it right now
  puts "Cleaning up CHANGELOG..."
  readme_in = open('./doc/files/CHANGELOG.html')
  content = readme_in.read
  content.sub!('<h1 id="item_name">File: CHANGELOG</h1>','')
  content.sub!('<h1>Description</h1>','')
  readme_in.close
  open('./doc/files/CHANGELOG.html', 'w') {|f| f.write(content)}
end

task "generate_rdoc" do
end

Rake::GemPackageTask.new(gem_spec) do |pkg|
  pkg.need_zip = false
  pkg.need_tar = false
end

#Rake::PackageTask.new('scrubyt-examples', '0.4.03') do |pkg|
#  pkg.need_zip = true
#  pkg.need_tar = true
#  pkg.package_files.include("examples/**/*")
#end
