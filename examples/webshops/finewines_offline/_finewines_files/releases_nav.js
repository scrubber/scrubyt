function _releasenavA() {

var url
url= window.location.href

// Navigation	for files with "_ " release

if (url.indexOf("_spirits") != -1)
{
document.write("<table width='175' border='0' cellspacing='0'  cellpadding='0' ><tr><td class='here'><a href='_spirits.html'>&nbsp;Spirits</a></td></tr></table>")
} 
else {
document.write("<span width='175'><a href='_spirits.html'>&nbsp;Spirits</a></span><br>")
}

//if (url.indexOf("_sake") != -1)
//{

//document.write("<table width='175' border='0' cellspacing='0'  cellpadding='0' ><tr><td class='here'><a href='_sake.html'>&nbsp;Saké</a></td></tr></table>")

//} 
//else {
//document.write("<span width='175'><a href='_sake.html'>&nbsp;Saké</a></span><br>")
//}

if (url.indexOf("_fortifiedwines") != -1)
{
document.write("<table width='175' border='0' cellspacing='0'  cellpadding='0'><tr><td class='here'><a href='_fortifiedwines.html'>&nbsp;Fortified Wine &nbsp;</a></td></tr></table>")
} 
else {
document.write("<span><a href='_fortifiedwines.html'>&nbsp;Fortified Wine &nbsp;</a></span><br>")
}

if (url.indexOf("_champagne_sparklingwines") != -1)
{
document.write("<table width='175' border='0' cellspacing='0'  cellpadding='0' ><tr><td class='here'><a href='_champagne_sparklingwines.html'>&nbsp;Sparkling Wine</a></td></tr></table>")
} 
else {
document.write("<span><a href='_champagne_sparklingwines.html'>&nbsp;Sparkling Wine</a></span><br>")
}

}

function _releasenavB() {
// Release 2 navigation	
document.write("<div id='masterdiv'><span class='submenu' id='sub1'>")
document.write("<a href='spirits.html'>&nbsp;Spirits</a><br>")
//document.write("<a href='sake.html'>&nbsp;Saké</a><br>")
document.write("<a href='fortifiedwines.html'>&nbsp;Fortified Wine </a><br>")
//document.write("<a href='champagne_sparklingwines.html'>&nbsp;Sparkling Wine</a><br>")
}

// Navigation	for files WITHOUT "_ " release--------------------------------------// Release 1 navigation	- August 20 th, 2005

function releasenavA() {

document.write("<div id='masterdiv'><span class='submenu' id='sub1'>")
document.write("<a href='_spirits.html'>&nbsp;Spirits</a><br>")
//document.write("<a href='_sake.html'>&nbsp;Saké</a><br>")
document.write("<a href='_fortifiedwines.html'>&nbsp;Fortified Wine </a><br>")
document.write("<a href='_champagne_sparklingwines.html'>&nbsp;Sparkling Wine</a><br>")
}

function releasenavB() {
// Release 2 navigation	

var url
url= window.location.href

if (url.indexOf("spirits") != -1)
 {
document.write("<table width='175' border='0' cellspacing='0'  cellpadding='0' ><tr><td class='here'><a href='spirits.html'>&nbsp;Spirits</a></td></tr></table>")
} 
else {
document.write("<span width='175'><a href='spirits.html'>&nbsp;Spirits</a></span><br>")
}

//if (url.indexOf("sake") != -1)
//{

//document.write("<table width='175' border='0' cellspacing='0'  cellpadding='0' ><tr><td class='here'><a href='sake.html'>&nbsp;Saké</a></td></tr></table>")

//} 
//else {
//document.write("<span width='175'><a href='sake.html'>&nbsp;Saké</a></span><br>")
//}

if (url.indexOf("fortifiedwines") != -1)
{
document.write("<table width='175' border='0' cellspacing='0'  cellpadding='0'><tr><td class='here'><a href='fortifiedwines.html'>&nbsp;Fortified Wine&nbsp;</a></td></tr></table>")
} 
else {
document.write("<span><a href='fortifiedwines.html'>&nbsp;Fortified Wine&nbsp;</a></span><br>")
}

//if (url.indexOf("champagne_sparklingwines") != -1)
//{
//document.write("<table width='175' border='0' cellspacing='0'  cellpadding='0' ><tr><td class='here'><a href='champagne_sparklingwines.html'>&nbsp;Sparkling Wine</a></td></tr></table>")
//} 
//else {
//document.write("<span><a href='champagne_sparklingwines.html'>&nbsp;Sparkling Wine</a></span><br>")
//}
}

// general files navigation like : shop.html, high.html, pipe.html
function releasenavA_AB() {

// Release 1 navigation	- August 20 th, 2005
document.write("<a href='_spirits.html'>&nbsp;Spirits</a><br>")
//document.write("<a href='_sake.html'>&nbsp;Saké</a><br>")
document.write("<a href='_fortifiedwines.html'>&nbsp;Fortified Wine </a><br>")
document.write("<a href='_champagne_sparklingwines.html'>&nbsp;Sparkling Wine</a><br>")

}

function releasenavB_AB() {

// Release 2 navigation	
document.write("<a href='spirits.html'>&nbsp;Spirits</a><br>")
//document.write("<a href='sake.html'>&nbsp;Saké</a><br>")
//document.write("<a href='champagne_sparklingwines.html'>&nbsp;Sparkling Wine</a><br>")
document.write("<a href='fortifiedwines.html'>&nbsp;Fortified Wine </a><br>")
}

// Rest of navigation	

function leftnavrest()
{
document.write('<table border="0" cellpadding="0" cellspacing="0" align="center" width="175">')
document.write('<tr><td ><a href="high.html" target="_top">&nbsp;Release Highlights</a></td></tr>')
document.write('<tr><td ><a href="high.html#airmiles" target="_top">&nbsp;Bonus AIR MILES<sup>&reg;</sup> reward &nbsp;miles &amp; Limited Time Offers</a></td></tr>')
document.write('<tr><td><a href="../ontario.html" target="_top">&nbsp;VQA Discovery</a></td></tr>')
//document.write('<tr><td><a href="spotlights02.html">&nbsp;Big and Small</a> </td></tr>')
//document.write('<tr><td><a href="spotlights01.html">&nbsp;A few of our finest</a></td></tr>')
document.write('<tr><td><a href="../../wines-basic-education/italy-wines-regions/veneto-wines.html">&nbsp;Wines of Veneto</a>')
document.write('<tr><td><a href="../../wines-basic-education/merlot-wines-regions/merlot-wines.html">&nbsp;Merlot`s Lasting Appeal</a></td></tr>')
document.write('<tr><td><a href="../instore.html" target="_top">&nbsp;In-Store Discoveries</a></td></tr>')
document.write('<tr><td><a href="shop.html" target="_top">&nbsp;Shopping List</a></td></tr>') 
document.write('<tr><td><a href="../../events.html" target="_top">&nbsp;Special Events</a></td></tr>')  
document.write('<tr><td><a href="pipe.html" target="_top" >&nbsp;In the Pipeline</a></td></tr>')	
document.write('<tr><td><a href="../legend.html" target="_top">&nbsp;Legend</a></td></tr>')
document.write('<tr><td><a href="../../store_directory_en.html" target="_top" >&nbsp;Store Directory</a></td></tr>')
document.write('<tr><td><a href="../orderinfo.html" target="_top">&nbsp;How to Order</a></td></tr>')  
document.write('<tr><td><a href="../vcalendar.html" target="_top">&nbsp;Release Calendar</a></td></tr>')
document.write('<tr><td><a href="../vintage-chart.html" target="_top">&nbsp;Vintage Chart</a></td></tr>')
document.write('<tr><td><a href="../previous.html" target="_top">&nbsp;Previous Releases</a></td></tr></table>')

}


function releasenavtop() {

document.write("<table width='607' border='0' cellspacing='0' cellpadding='0'>")

document.write("<tr class='narrative'><td align='left' valign='top' bordercolor='#FFFFCC' bgcolor='#FFFFCC'>")
document.write("<span class='releaseRed'>&nbsp; March 3 Release: </span>  ")
document.write("<a href='_spirits.html'>Spirits | </a>")
//document.write("<a href='_sake.html'>Sak&eacute; | </a>")
document.write("<a href='_fortifiedwines.html'>Fortified Wine | </a>")
document.write("<a href='_champagne_sparklingwines.html'>Sparkling Wine | </a>")
document.write("<a href='_finewines.html'>Wines by Country </a><br>")
document.write("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href='../../wines-basic-education/italy-wines-regions/veneto-wines.html'>&nbsp;Wines of Veneto</a>")
document.write("</td></tr>")

document.write("<tr class='narrative'><td align='left' valign='top' bordercolor='#FFFFCC' bgcolor='#FFFFCC' class='narrative'>")
document.write("<hr align='center' width='600' size='0.5' color='#330033'></td></tr>")

document.write("<tr class='narrative'><td align='left' valign='top' bordercolor='#FFFFCC' bgcolor='#FFFFCC'>")
document.write("<span class='releaseRed'>&nbsp; March 17 Release: </span>")
document.write("<a href='spirits.html'>Spirits | </a>")
//document.write("<a href='sake.html'>Sak&eacute; | </a>")
document.write("<a href='fortifiedwines.html'>Fortified Wine | </a>")
//document.write("<a href='champagne_sparklingwines.html'>Celebrate in style with brilliant bubbly | </a>")
document.write("<a href='finewines.html'>Wines by Country </a> <br>")
document.write("<a href='../../wines-basic-education/merlot-wines-regions/merlot-wines.html'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Merlot's Lasting Appeal</a>")
document.write("</td></tr>")

document.write("<tr class='narrative'><td align='left' valign='top' bordercolor='#FFFFCC' bgcolor='#FFFFCC'  class='narrative'><hr align='center' width='600' size='0.5' color='#330033'></td></tr></table>")
}

// ----------------------FOLDER 2 VINTAGES CIRCULAR METHODS-------------------------------

function footerMenuLevel3Monthly_2() {

document.write('<table width="800" height="23" border="0" align="center" cellpadding="0" cellspacing="0" class="navfooter">');
document.write('<tr><td width="193"></td><td width="612">');
document.write('<hr align="center" width="600" size="0.5" color="#330033" >');
document.write('<div align="center"><span class="style6"><a href="#top" ><img src="../../media_common/top.gif"');
document.write('width="25" height="15" border="0"></a></span> </div> <br>');

document.write('</td></tr><tr><td width="190"></td><td><p><span class="nav"><font color="#990000">Please note:</font></span> ');
document.write('<span class="nav">Products can only be shipped to LCBO stores.</span>');
document.write('<p><span class="headlight">Look for the </span> <span class="vintagesheadlight">VINTAGES</span>');
document.write('<span class="headlight">’ releases next month on Saturday, March 31, 2007 and Saturday, April 14, 2007.</span> ');
document.write('<p class="nav">Please note prices shown are subject to change without notice.');
document.write(' Price includes PST, GST and applicable container deposit as of February 5, 2007. VINTAGES cannot assume responsibility for typographical errors in this	circular. </p>');
document.write('<p>&nbsp;</p></td></tr></table>');

document.write('<table width="800" height="23" border="0" align="center" cellpadding="0" cellspacing="0" class="navfooter"> ');
document.write('<tr><td  colspan=2 align="right" valign="middle" bgcolor="#FAFAFC"></td><hr align="center" width="780" size="0.5" color="#330033"></td></tr>');
document.write('<tr><td width="10" align="left" valign="middle" bgcolor="#FAFAFC">&nbsp;</td>  ');
document.write('<td width="790" height="23" align="left" valign="middle" bgcolor="#FAFAFC">  ');
document.write('<a href="../../fr/index_fr.html" target="_top">Français</a> | ');
document.write('<a href="../../about_vintages.html" target="_top">About Vintages</a> |  ');
document.write('<a href="../../wine-information-faq/wine-faq-vintages.html">FAQ</a> |  ');
document.write('<a href="http://www.lcbotrade.com" target="_blank">Trade</a> | ');
document.write('<a href="../../circular/experts.html" target="_top">Our experts</a> | ');
document.write('<a href="../../vintages_social_responsibility.html" target="_top">Social Responsibility</a> | ');
document.write('<a href="../../frame_stores.html" target="_top">Store Search</a> |   ');
document.write('<a href="../../sitemap.html" target="_top"> Site Map</a> |   ');
document.write('<a href="mailto:vintages@lcbo.com">Contact us</a>');
document.write('</td></tr></table>'   );
}

function SwitchMenu(variabila){
	if(document.getElementById){
	var itemuri = document.getElementById(variabila);
	var matrice = document.getElementById("masterdiv").getElementsByTagName("span"); 
		if(itemuri.style.display != "block"){ 
			for (var i=0; i<matrice.length; i++){
				if (matrice[i].className=="submenu") 
				matrice[i].style.display = "none";
			}
			itemuri.style.display = "block";
		}else{
			itemuri.style.display = "none";
		}
	}
}