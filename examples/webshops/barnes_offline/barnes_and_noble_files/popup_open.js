var newpopup=null;


/* 	###################################
	File: /pimages/js/popup_open.js
	Author: Matteo Andre'
 	Descr:
	6 parameters - For default this function get called from the body onLoad from /include/popup.asp
	1) url: Default URLs are defined in the variable popuptype (see /include/popup.asp). Any url can be also sent as a string.
	2) slinkprefix, always to be passed
	3) winname - #optional - pass a different name to open a different popup from main 'newpopup'
	4) width   - #optional - default 250
	5) height  - #optional - default 250
	6) type    - #optional - default "fixed"
	Examples to call this function:
	1) Default   OpenPopup("<%'=popuptype%>","<%'=slinkprefix%>")
	2) Custom    OpenPopup("popup.asp?","<%'=slinkprefix%>",'newpop', 350,350,'location')
	To open a new popup from another popup use:
 	3) <a href="http://www.barnesandnoble.com/popup_cds2.asp?PID=4726&<%'=slinkprefix%>" onClick="OpenPopup('http://www.barnesandnoble.com/popup_cds2.asp?PID=4726&','<%'=slinkprefix%>', 'any random name 	other than newpopup', 300, 400);window.close();return(true);">click here</a>
 	###################################*/
  function OpenPopup(url, slinkprefix, winname, width, height, type) {
	   if (slinkprefix.toLowerCase().indexOf('btob=') > -1) return (false);
	   if (winname==null) winname='newpopup';
	   if (width==null) width=250;
   	   if (height==null) height=250;
	   if (type==null) type="fixed";
	  switch(url) {
		    case "":
		      return (false);
		      break;
		    case "getaway":
		      url="http://www.barnesandnoble.com/popup_cds2.asp?" + slinkprefix + "&PID=2961";
		      break;
		    case "book":
		      url="http://www.barnesandnoble.com/popup_cds2.asp?" + slinkprefix + "&PID=2961";
		      break;
			case "search":
		      url="http://www.barnesandnoble.com/popup_cds2.asp?" + slinkprefix + "&PID=2962";
		      break;
		    case "music":
		      url="http://www.barnesandnoble.com/popup_cds2.asp?" + slinkprefix + "&PID=2963";
		      break;
			case "video":
		      url="http://www.barnesandnoble.com/popup_cds2.asp?" + slinkprefix + "&PID=2964";
		      break;
			case "newcustomer":
		      url="http://www.barnesandnoble.com/popup_cds2.asp?" + slinkprefix + "&PID=2987";
		      break;
			default: url = url + slinkprefix;
		}
		var options="width="+ width +","+
      				"height="+ height;		
	  	switch(type) {
		    case "fixed":
		      options = options;
		      break;
		    case "resizable":
		      options= options +",resizable";
		      break;
		    case "toolbar":
		      options= options +",toolbar,menubar,scrollbars,resizable";
		      break;
			case "scrollbars":
		      options= options +",scrollbars";
		      break;
		    case "location":
		      options= options +",toolbar,menubar,scrollbars,resizable,location";
		      break;
			default: options = options;
		}
		newpopup = window.open(url, winname, options);
		if (newpopup!=null) {
		newpopup.focus();
		}
		return (true);
	}
	
	function openInParent(href) {
	
	if (positionMain(href)){
	
		window.open(href, "", "");
		
		}
	}
	
	function positionMain(href) {
	  if ((window.opener != null) && (!window.opener.closed)) {
	    window.opener.location = href;
		window.opener.focus();
		window.close();
	    return false;
	  } else return true;
	}	
	
	
/* 	##############################################
	GS 12/2/04 added function for Flash/SWF popups
 	##############################################  */
	
function changeOpener(href) {
    if ((window.opener != null) && (!window.opener.closed)) {
        window.opener.location = href;
        window.opener.focus();
    } else {
		window.open(href);
    }
}
 
 /* 	##############################################
	The addition of clearInput is to prevent an error from a missing function in store.asp
 	##############################################  */
 function clearInput(form,name) {
   	form[name].value="";
	return true;
}