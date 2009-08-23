require 'rubygems'
require 'rake'
require 'rake/gempackagetask'
require 'spec/rake/spectask'

gem_spec = Gem::Specification.new do |s|
  s.name = 'scrubyt-experimental'
  s.version = '0.1.0'
  s.summary = 'From-scratch rewrite of scRUBYt! with 100% code coverage, modular architecture, lightweight code etc. Somefunctionality is still missing from the original scRUBYt!'
  s.description = %{scRUBYt! is an easy to learn and use, yet powerful and effective web scraping framework. It's most interesting part is a Web-scraping DSL built on HPricot and WWW::Mechanize, which allows to navigate to the page of interest, then extract and query data records with a few lines of code. It is hard to describe scRUBYt! in a few sentences - you have to see it for yourself!}
  s.test_files = FileList['spec/**/*']
  s.files = FileList['README', 'Rakefile', 'lib/**/*.rb', 'plugins/**/*.rb']
  s.authors = ['Glenn Gillen','Peter Szinek']
  s.email = ['glenn.gillen@gmail.com', 'peter@rubyrailways.com']
  s.homepage = 'http://www.scrubyt.org'
  s.add_dependency('mechanize', '>= 0.6.3')
  s.has_rdoc = 'false'
end

desc "Run all specs"
Spec::Rake::SpecTask.new do |t|
  t.spec_files = FileList['spec/**/*_spec.rb']
  t.spec_opts = ['--options', 'spec/spec.opts']
  t.rcov = true
  t.rcov_dir = '../doc/output/coverage'
  t.rcov_opts = ['--exclude', 'spec\/spec,bin\/spec,examples,\/var\/lib\/gems,\.autotest']
end

Rake::GemPackageTask.new(gem_spec) do |pkg|
  pkg.need_zip = false
  pkg.need_tar = false
end
