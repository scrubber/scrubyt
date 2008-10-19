// browser detection:
var ua = navigator.userAgent;
var ie = (navigator.appName.toLowerCase().indexOf("internet explorer")!=-1)?1:0;
var ns = (navigator.appName.toLowerCase().indexOf("netscape")!=-1)?1:0;
var ns4 = (document.layers)?1:0;
var ns6 = (document.getElementById && ns)?1:0;
var mac = (navigator.userAgent.toLowerCase().indexOf("mac")!=-1)?1:0;
var macie4 = (mac && !ns && parseInt(ua.substr(ua.indexOf("MSIE")+4,2)) <= 4)?1:0;
var macie = (mac && !ns)?1:0;
var moz = (navigator.userAgent.toLowerCase().indexOf("firefox")!=-1)?1:0;

function emailAdressIsValid(str){
	var emailAdressFormat = /^[a-zA-Z0-9._-]+@([a-zA-Z0-9.-]+\.)+[a-zA-Z0-9.-]{2,3}$/;
	if(str=="")
		{
		return 2
		}
		else if (!(emailAdressFormat.test(str)))
				{
					return 1;
				}
				else
				{				
					return false;
				}
}

function Trim(strToTrim) {
	while(strToTrim.charAt(0)==' '){strToTrim = strToTrim.substring(1,strToTrim.length);}
	while(strToTrim.charAt(strToTrim.length-1)==' '){strToTrim = strToTrim.substring(0,strToTrim.length-1);}
	return strToTrim;
}

if (ns4) document.write('<LINK rel="stylesheet" href="stylesn.css" type="text/css">');
else document.write('<LINK rel="stylesheet" href="styles.css" type="text/css">');

// processing the page ID:
pageID = "";
var leftID="";
var arrID = new Array();
arrID = GetIDs(pageID);

// getting the IDs from the page ID:
function GetIDs(whatSplit) {
	var arr1 = whatSplit.split("_");
	var arr2=new Array
	if (arr1.length != 0) {
		arr2[0] = arr1[0];
		for (var i=1; i<arr1.length; i++) {
			arr2[i] = arr2[i-1] + "_" + arr1[i];
		}
		if (arr1.length >= 0) leftID=arr1[2]
	}
	return arr2;
}

//getting the content height:
/*
var contH="100%"
var contH2="100%";
var contH3="100%";
var headerH=127;
var footerH=38;
function GetContentH(){
	if (ns) {
		contH=window.innerHeight-headerH-footerH
		contH2=contH-160;
		contH3=contH2-107;
		}
	else if (ua.toLowerCase().indexOf("windows")<0) {
		contH=document.body.clientHeight-headerH-footerH
		contH2=contH-161;
		}
}
*/
// START: fixing the page content on resize >>>
FixNSWindow();
function FixNSWindow() {
	if (ns6 || ns && (parseInt(navigator.appVersion) == 4)) {
		if (typeof document.NS == 'undefined') document.NS = new Object;
		if (typeof document.NS.NS_scaleFont == 'undefined') {
			document.NS.FixCssInNS = new Object;
			document.NS.FixCssInNS.initWindowWidth = window.innerWidth;
			document.NS.FixCssInNS.initWindowHeight = window.innerHeight;
		}
		window.onresize = FixCssInNS;
	}
}
function FixCssInNS() {
	if (document.NS.FixCssInNS.initWindowWidth != window.innerWidth || document.NS.FixCssInNS.initWindowHeight != window.innerHeight) document.location = document.location;
}
function alertSize() {
  var myWidth = 0;
  if( typeof( window.innerWidth ) == 'number' ) 
  {
    //Non-IE
    myWidth = window.innerWidth-20;
  } 
  else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) 
  {
    //IE 6+ in 'standards compliant mode'
    myWidth = document.documentElement.clientWidth;
  } 
  else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) )
  {
    //IE 4 compatible
    myWidth = document.body.clientWidth;
  }
  return myWidth;
}
/*function pageReload()
{
	window.location.reload();
}
var initialWidth=alertSize();
function aaa()
{
	if(alertSize()!=initialWidth)window.location.reload();
	window.setTimeout("aaa()",1000);
}*/
//ReloadWindow();
//function ReloadWindow(){if (!ns) setTimeout("window.onresize=pageReload",200);}
//function ReloadWindow(){if (!ns) setTimeout("aaa()",1000);}
// <<< END: fixing the page content on resize

var imgNameOff = new Array("images/btn_submit_off.gif","images/btn_next_off.gif","images/btn_back_off.gif","images/btn_reset_off.gif");
var imgNameOn = new Array("images/btn_submit_on.gif","images/btn_next_on.gif","images/btn_back_on.gif","images/btn_reset_on.gif");

var imgObjOff = new Array(imgNameOff.length);
var imgObjOn = new Array(imgNameOn.length);
Preload()

//preloading images:
function Preload(){
	for (i = 0; i<imgNameOff.length; i++)
	{
		imgObjOff[i] = new Image();
		imgObjOff[i].src = imgNameOff[i];
		imgObjOn[i] = new Image();
		imgObjOn[i].src = imgNameOn[i];
	}
}
//mouseover fumction:
function swapIn(nume, i)
{
	var o = eval("document." + nume);
	o.src = imgObjOn[i].src;
}
//mouseout fumction:
function swapOut(nume,i)
{
	var o = eval("document." + nume);
	o.src = imgObjOff[i].src;
}
//-->
