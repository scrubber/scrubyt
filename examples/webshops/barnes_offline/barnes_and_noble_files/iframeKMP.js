var jsIframe_js = true;
var jsIframe_isNS4 = document.layers && (parseInt(navigator.appVersion) >= 4) && (parseInt(navigator.appVersion) <= 5);

function jsIframe_buildIframe (which, querystring, host) {
	var width;
	var height;
	var src;
	var name;
	var ilayer;
	var iframe;
	var env = "btob"
	
	switch (which) {
		case "jsIframeLeftPromoBooks" :
			if (host.indexOf(env) != -1) {
    			pid="10054"; 	// isBtoB
  			}
			else {
				pid="10053"; 	// isWWW
			}
			width	= 146;
			height	= 245;
			src		= "http://" + host + "/newsletters/kmp_iframe_cds2.asp?pid=" + pid + "&" + querystring;
			name	= "LeftPromo";
			ilayer	= false;
			iframe	= "ALIGN=\"CENTER\" FRAMEBORDER=\"0\" MARGINHEIGHT=\"0\" MARGINWIDTH=\"0\" SCROLLING=\"NO\"";
			break;
			
		case "jsIframeLeftPromoBooksSearch" :
			if (host.indexOf(env) != -1) {
    			pid="7762";		// isBtoB
  			}
			else {
				pid="6603";		// isWWW
			}
			width	= 146;
			height	= 245;
			src		= "http://" + host + "/newsletters/kmp_iframe_cds2.asp?pid=" + pid + "&" + querystring;
			name	= "LeftPromo";
			ilayer	= false;
			iframe	= "ALIGN=\"CENTER\" FRAMEBORDER=\"0\" MARGINHEIGHT=\"0\" MARGINWIDTH=\"0\" SCROLLING=\"NO\"";
			break;
		
			
		case "jsIframeLeftPromoMusic" :
			if (host.indexOf(env) != -1) {
    			pid="7761"; 	// isBtoB
  			}
			else {
				pid="4649"; 	// isWWW
			}
			width	= 146;
			height	= 245;
			src		= "http://" + host + "/newsletters/kmp_iframe_cds2.asp?pid=" + pid + "&" + querystring;
			name	= "LeftPromo";
			ilayer	= false;
			iframe	= "ALIGN=\"CENTER\" FRAMEBORDER=\"0\" MARGINHEIGHT=\"0\" MARGINWIDTH=\"0\" SCROLLING=\"NO\"";
			break;
		
		case "jsIframeLeftPromoMusicSearch" :
			if (host.indexOf(env) != -1) {
    			pid="7761"; 	// isBtoB
  			}
			else {
				pid="4649"; 	// isWWW
			}
			width	= 146;
			height	= 245;
			src		= "http://" + host + "/newsletters/kmp_iframe_cds2.asp?pid=" + pid + "&" + querystring;
			name	= "LeftPromo";
			ilayer	= false;
			iframe	= "ALIGN=\"CENTER\" FRAMEBORDER=\"0\" MARGINHEIGHT=\"0\" MARGINWIDTH=\"0\" SCROLLING=\"NO\"";
			break;	

		case "jsIframeLeftPromoOOP" :
			width	= 135;
			height	= 155;
			src		= "http://" + host + "/newsletters/kmp_iframe_cds2.asp?pid=4644&" + querystring;
			name	= "LeftPromo";
			ilayer	= false;
			iframe	= "ALIGN=\"CENTER\" FRAMEBORDER=\"0\" MARGINHEIGHT=\"0\" MARGINWIDTH=\"0\" SCROLLING=\"NO\"";
			break;

		case "jsIframeLeftPromoVideo" :
			width	= 146;
			height	= 245;
			src		= "http://" + host + "/newsletters/kmp_iframe_cds2.asp?pid=4650&" + querystring;
			name	= "LeftPromo";
			ilayer	= false;
			iframe	= "ALIGN=\"CENTER\" FRAMEBORDER=\"0\" MARGINHEIGHT=\"0\" MARGINWIDTH=\"0\" SCROLLING=\"NO\"";
			break;
	
	
		case "jsIframeLeftPromoVideoSearch" :
			width	= 146;
			height	= 245;
			src		= "http://" + host + "/newsletters/kmp_iframe_cds2.asp?pid=4650&" + querystring;
			name	= "LeftPromo";
			ilayer	= false;
			iframe	= "ALIGN=\"CENTER\" FRAMEBORDER=\"0\" MARGINHEIGHT=\"0\" MARGINWIDTH=\"0\" SCROLLING=\"NO\"";
			break;
	
	
		case "jsIframeLeftPromoDVD" :
			if (host.indexOf(env) != -1) {
    			pid="7752"; 	// isBtoB
  			}
			else {
				pid="4650"; 	// isWWW
			}
			width	= 146;
			height	= 245;
			src		= "http://" + host + "/newsletters/kmp_iframe_cds2.asp?pid=" + pid + "&" + querystring;
			name	= "LeftPromo";
			ilayer	= false;
			iframe	= "ALIGN=\"CENTER\" FRAMEBORDER=\"0\" MARGINHEIGHT=\"0\" MARGINWIDTH=\"0\" SCROLLING=\"NO\"";
			break;
			
		
		case "jsIframeLeftPromoDVDSearch" :
			if (host.indexOf(env) != -1) {
    			pid="7752"; 	// isBtoB
  			}
			else {
				pid="4650"; 	// isWWW
			}
			width	= 146;
			height	= 245;
			src		= "http://" + host + "/newsletters/kmp_iframe_cds2.asp?pid=" + pid + "&" + querystring;
			name	= "LeftPromo";
			ilayer	= false;
			iframe	= "ALIGN=\"CENTER\" FRAMEBORDER=\"0\" MARGINHEIGHT=\"0\" MARGINWIDTH=\"0\" SCROLLING=\"NO\"";
			break;
			
		case "jsIframeLeftPromoVideoGame" :
			if (host.indexOf(env) != -1) {
		    	pid="8256"; 	// isBtoB
		  	}
			else {
			pid="8256"; 	// isWWW
			}
			width	= 146;
			height	= 245;
			src		= "http://" + host + "/newsletters/kmp_iframe_cds2.asp?pid=" + pid + "&" + querystring;
			name	= "LeftPromo";
			ilayer	= false;
			iframe	= "ALIGN=\"CENTER\" FRAMEBORDER=\"0\" MARGINHEIGHT=\"0\" MARGINWIDTH=\"0\" SCROLLING=\"NO\"";
			break;
			
		/*case "jsIframeChoice" :
			width	= 135;
			height	= 295;
			src		= "http://" + host + "/newsletters/kmp_iframe_cds2.asp?" + querystring;
			name	= "LeftPromo";
			ilayer	= false;
			iframe	= "ALIGN=\"CENTER\" FRAMEBORDER=\"0\" MARGINHEIGHT=\"0\" MARGINWIDTH=\"0\" SCROLLING=\"NO\"";
			break;*/
		default :
			return(false);
		}
	
	return(_jsIframe_renderIframe(width, height, src, name, ilayer, iframe));
	}

function _jsIframe_renderIframe (width, height, src, name, ilayerAttrib, iframeAttrib) {
	document.write(
		"<IFRAME WIDTH=\"" + width + "\" HEIGHT=\"" + height + "\" SRC=\"" + src + "\"" +
		" NAME=\"" + name + "\"" + (iframeAttrib ? (" " + iframeAttrib) : "") + ">" +
		"</IFRAME>"
		);
	return(true);
}