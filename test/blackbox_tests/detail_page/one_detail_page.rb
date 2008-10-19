lambda do
  fetch(File.join(File.dirname(__FILE__), "main_page_1.html"))

  main 'Main 1' do
    xyz_detail do
      detail 'Detail 1'
    end
  end
end