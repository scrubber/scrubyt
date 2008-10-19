$:.unshift File.join(File.dirname(__FILE__), '../../..//lib')

require 'scrubyt'

tones = Scrubyt::Extractor.define do
  fetch("http://www.jamster.com/jcw/goto/ringtones/real-tones/cat-1069173")
  
  tone("/html/body/div/div/div/div/div/div/div/div/div", { :generalize => true }) do
    image("/div[1]/a[1]/img[1]") { sample_image(, { :type => :attribute }) }
    get_it("/div[4]/a[1]/img[1]") { url(, { :type => :attribute }) }
    preview_img("/div[3]/a[1]/img[1]") do
      tone_preview_detail({ :type => :detail_page }) do
        whole_doc("//body", { :generalize => true }) do
          sample_url(/FlashVars=file=(.+?)&/, { :type => :regexp })
        end
      end
    end
    title("/div[2]/a[1]", { :ends_with => "Matter" })
    author("/div[2]/div[1]/a[1]")
  end
end

tones.to_xml.write($stdout, 1)
