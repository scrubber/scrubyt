module Scrubyt
  class ScrubytResult < ResultNode
    attr_accessor :root_patterns, :source_file, :source_proc

    def export(arg1, output_file_name=nil, extractor_result_file_name=nil)
      if arg1.is_a? String
        if File.exists? arg1
          export_old1(arg1, output_file_name, extractor_result_file_name)
        else
          export_old2(arg1, output_file_name, extractor_result_file_name)
        end
      else
        export_new(arg1)
      end
    end

    def show_stats
      #Implement me...
    end

    def export_old1(input_file, output_file_name=nil, extractor_result_file_name=nil)
      contents = open(input_file).read
      wrapper_name = contents.scan(/\s+(.+)\s+=.*Extractor\.define.*/)[0][0]
      export_old2(wrapper_name, output_file_name, extractor_result_file_name)
    end

    def export_old2(wrapper_name, output_file_name=nil, extractor_result_file_name=nil)
      export_new({ :wrapper_name => wrapper_name, :output_file_name => output_file_name || "#{wrapper_name}_extractor_export.rb", :extractor_result_file_name => extractor_result_file_name })
    end
    
    def export_new(data)
      data[:source_file] = @source_file
      data[:source_proc] = @source_proc
      Scrubyt::Export.export(@root_patterns, data)
    end
  end
end