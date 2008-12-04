require 'rubygems'
Dir[File.join(File.dirname(__FILE__)+'/skimr/*.rb')].each { |lib| require lib }
Dir[File.join(File.dirname(__FILE__)+'/skimr/export/*.rb')].each { |lib| require lib }