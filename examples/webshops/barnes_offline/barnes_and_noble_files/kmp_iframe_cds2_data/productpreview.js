function loadLib (libPath) {
	document.write('<script type="text/javascript" src="' + libPath + '"> </script>');
}

function loadCss (cssPath) {
	document.write('<link rel="stylesheet" type="text/css" href="' + cssPath + '">');
}

loadLib('http://images.barnesandnoble.com/pimages/js/XmlUtil.js');
loadLib('http://images.barnesandnoble.com/pimages/js/XslStyleSheet.js');
loadLib('http://images.barnesandnoble.com/pimages/js/product-preview-core.js');