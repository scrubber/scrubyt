<!---
var dtExpires = new Date();

function setCookie(strName, strValue, dtExpires) 
{var strCookie;strCookie = strName + '=' + escape(strValue);if(typeof dtExpires != 'undefined'){strCookie += '; expires=' + dtExpires.toGMTString();}strCookie += '; path=/';document.cookie = strCookie;}

function getCookie(strName) 
{var reName = new RegExp('.*' + strName + '=','gi');var reSemiColon = new RegExp(';.*','gi');var strDocumentCookie = document.cookie;if(reName.test(strDocumentCookie)){strDocumentCookie = strDocumentCookie.replace(reName,'');return strDocumentCookie.replace(reSemiColon,'');}else return '';}

function getDigit()
{var numI;var digit;numI = getRandomNum();while (checkPunc(numI)){ numI = getRandomNum();}digit = String.fromCharCode(numI);return digit.toUpperCase();}

function getRandomNum() 
{var rndNum = Math.random();rndNum = parseInt(rndNum * 1000);rndNum = (rndNum % 94) + 33;return rndNum;}

function checkPunc(num) 
{if ((num >=33) && (num <=47)) { return true; }if ((num >=58) && (num <=64)) { return true; }if ((num >=91) && (num <=96)) { return true; }if ((num >=123) && (num <=126)) { return true; }return false;}

if(navigator.appName != "Netscape") 
	nc=window.screen.colorDepth; 
else 
	nc=window.screen.pixelDepth;

bsE = getCookie("roil"); 

if(!bsE)
{
	if (parseInt(navigator.appVersion) <= 3)
	{
		bsE = Math.random();
		bsE = bsE * 100000000000000000;
		dtExpires.setFullYear(2050,12,31);
		setCookie("roil", bsE, dtExpires);
	}
	else
	{
		for(i=0; i < 25; i++){bsE = bsE + getDigit();}
		
		dtExpires.setFullYear(2050,12,31);
		setCookie("roil", bsE, dtExpires); 
	}
}

addon = "";if( typeof(KI) == "string" ) addon += "&ki=" + KI;if( typeof(AC) == "string" ) addon += "&ac=sale";if( typeof(AM) == "string" ) addon += "&am=" + AM;if( typeof(MG) == "string" ) addon += "&mg=" + MG;
if( typeof(BOS) == "string" ){addon += "&p=" + navigator.platform;addon += "&os=" + oslist;addon += "&b=" + navigator.appName;addon += "&bv=" + browserlist;}
	
document.write("<img src='https://209.16.70.147/t/tl.phtml?clid="+ CLID + "&stid="+ STID + "&bsE=" + bsE + "&ref=" + escape(document.referrer) + "&d="+ nc + "&w="+ window.screen.width + "&h="+ window.screen.height + addon + "' height=1 width=1 border=0>");
//--->

