require 'net/http'
require 'fileutils'

module Scrubyt
  class DownloadFilter < BaseFilter

    def evaluate(source)
      download_file(source)
    end #end of method

    def to_sexp
      [:str, @example]
    end #end of method to_sexp

private
    def download_file(source)
      return '' if source.size < 4
      host_name = (source =~ /^http/ ? source : @parent_pattern.extractor.get_host_name)
      outfile = nil
      host_name += "/" if host_name[-1..-1] != "/"
      base_url = host_name.scan(/http:\/\/(.+?)\//)[0][0]
      file_name = source.scan(/.+\/(.*)/)[0][0]
      return nil if @parent_pattern.except.include? file_name
      Net::HTTP.start(base_url) { |http|
        Scrubyt.log :INFO, "downloading: #{source.scan(/\s*(.+)/)[0][0]}"
        begin
          ua = 'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.8.1.4) Gecko/20061201 Firefox/2.0.0.4 (Ubuntu-feisty)'
          path = host_name.scan(/http:\/\/#{base_url}(.+)\//)
          resp = http.get(path, {'User-Agent'=> ua})
          outfile = DownloadFilter.find_nonexisting_file_name(File.join(@example, file_name))
          FileUtils.mkdir_p @example
          open(outfile, 'wb') {|f| f.write(resp.body) }
        rescue Timeout::Error
          outfile = "[FAILED]#{file_name}"
        end
       }
       outfile.scan(/.+\/(.*)/)[0][0]
    end

   def self.find_nonexisting_file_name(file_name)
      already_found = false
      loop do
        if File.exists? file_name
          if already_found
            if file_name.include?('.')
              last_no = file_name.scan(/_(\d+)\./)[0][0]
              file_name.sub!(/_#{last_no}\./) {"_#{(last_no.to_i+1).to_s}."}
            else
              last_no = file_name.scan(/_(\d+)$/)[0][0]
              file_name.sub!(/_#{last_no}$/) {"_#{(last_no.to_i+1).to_s}"}
            end
          else
            if file_name.include?('.')
              file_name.sub!(/\./) {"_1\."}
              already_found = true
            else
              file_name << '_1'
              already_found = true
            end
          end
        else
          break
        end
      end
      file_name
   end #end of method
  end #End of class DownloadFilter
end #End of module Scrubyt
