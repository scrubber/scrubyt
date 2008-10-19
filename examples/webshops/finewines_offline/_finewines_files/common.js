// JavaScript Document

// JavaScript for images

function MM_swapImgRestore() { //v3.0
  var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}

function MM_preloadImages() { //v3.0
  var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
    var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++) 
    if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
}

function MM_findObj(n, d) { //v4.01
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && d.getElementById) x=d.getElementById(n); return x;
}

function MM_swapImage() { //v3.0
  var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3)
   if ((x=MM_findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
}

NS4 = (document.layers) ? true : false;
function checkEnter(event)
{
	var code = 0;

	if (NS4)
		code = event.which;
	else
		code = event.keyCode;

	if (code==13)
		document.inputForm.submit();
}

//-->

// JavaScript buttons for functions
<!--
function MM_preloadImages() { //v3.0
  var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
    var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
    if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
}

function MM_findObj(n, d) { //v4.01
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && d.getElementById) x=d.getElementById(n); return x;
}

function MM_nbGroup(event, grpName) { //v6.0
  var i,img,nbArr,args=MM_nbGroup.arguments;
  if (event == "init" && args.length > 2) {
    if ((img = MM_findObj(args[2])) != null && !img.MM_init) {
      img.MM_init = true; img.MM_up = args[3]; img.MM_dn = img.src;
      if ((nbArr = document[grpName]) == null) nbArr = document[grpName] = new Array();
      nbArr[nbArr.length] = img;
      for (i=4; i < args.length-1; i+=2) if ((img = MM_findObj(args[i])) != null) {
        if (!img.MM_up) img.MM_up = img.src;
        img.src = img.MM_dn = args[i+1];
        nbArr[nbArr.length] = img;
    } }
  } else if (event == "over") {
    document.MM_nbOver = nbArr = new Array();
    for (i=1; i < args.length-1; i+=3) if ((img = MM_findObj(args[i])) != null) {
      if (!img.MM_up) img.MM_up = img.src;
      img.src = (img.MM_dn && args[i+2]) ? args[i+2] : ((args[i+1])? args[i+1] : img.MM_up);
      nbArr[nbArr.length] = img;
    }
  } else if (event == "out" ) {
    for (i=0; i < document.MM_nbOver.length; i++) {
      img = document.MM_nbOver[i]; img.src = (img.MM_dn) ? img.MM_dn : img.MM_up; }
  } else if (event == "down") {
    nbArr = document[grpName];
    if (nbArr)
      for (i=0; i < nbArr.length; i++) { img=nbArr[i]; img.src = img.MM_up; img.MM_dn = 0; }
    document[grpName] = nbArr = new Array();
    for (i=2; i < args.length-1; i+=2) if ((img = MM_findObj(args[i])) != null) {
      if (!img.MM_up) img.MM_up = img.src;
      img.src = img.MM_dn = (args[i+1])? args[i+1] : img.MM_up;
      nbArr[nbArr.length] = img;
  } }
}
//-->

// JavaScript buttons for browser

<!--
//Reload the Window on Resize -- for bug in Netscape 4

	var loadWidth=''; var loadHeight='';

	if(document.layers){loadWidth=window.innerWidth;loadHeight=window.innerHeight;}

		window.onresize=fixWin;

	function fixWin(){

		if (document.layers && loadWidth == window.innerWidth && loadHeight == window.innerHeight){return;}

		window.location.href=window.location.href;

	}
// -->


// left menu switch 

if (document.getElementById){ 
document.write('<style type="text/css">\n')
document.write('.submenu{display: none;}\n')
document.write('</style>\n')
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

// LEVEL 2 for Folder CIRCULAR/FUTURES/ALL LEVELS 2 FOLDERS------ ENGLISH -------

function footerMenuLevel2Circular_en() {

document.write('   <table width="800" height="23" border="0" align="center" cellpadding="0" cellspacing="0" class="navfooter"> ');
document.write('   <td width="745" height="23" align="left" valign="middle" bgcolor="#FAFAFC">  ');
document.write('   <a href="../fr/index_fr.html" title="Francais" target="_top">Français</a> | ');
document.write('   <a href="../about_vintages.html" target="_top">About Vintages</a> |  ');
document.write('   <a href="../wine-information-faq/wine-faq-vintages.html">FAQ</a> |  ');
document.write('   <a href="http://www.lcbotrade.com" target="_blank">Trade</a> | ');
document.write('   <a href="../circular/experts.html" target="_top">Our experts</a> | ');
document.write('   <a href="../vintages_social_responsibility.html" target="_top">Social Responsibility</a> | ');
document.write('   <a href="../frame_stores.html" target="_top">Store Search</a> |   ');
document.write('   <a href="../sitemap.html" target="_top"> Site Map</a> | ');
document.write('   <a href="mailto:vintages@lcbo.com">Contact us</a>  ');
document.write('   </td></tr></table>'   );

}

// LEVEL 1 for MAIN Folder   ------ ENGLISH -------

function footerMenuLevel1Main_en() {

document.write('   <table width="800" height="23" border="0" align="center" cellpadding="0" cellspacing="0" class="navfooter"> ');
document.write('   <td width="745" height="23" align="left" valign="middle" bgcolor="#FAFAFC">  ');
document.write('   <a href="fr/index_fr.html" title="Francais" target="_top">Français</a> | ');
document.write('   <a href="about_vintages.html" target="_top">About Vintages</a> |  ');
document.write('   <a href="wine-information-faq/wine-faq-vintages.html">FAQ</a> |  ');
document.write('   <a href="http://www.lcbotrade.com" target="_top">Trade</a> | ');
document.write('   <a href="circular/experts.html" target="_top">Our experts</a> | ');
document.write('   <a href="vintages_social_responsibility.html" target="_top">Social Responsibility</a> | ');
document.write('   <a href="frame_stores.html" target="_top">Store Search</a> |   ');
document.write('   <a href="sitemap.html" target="_top"> Site Map</a> |');
document.write('   <a href="mailto:vintages@lcbo.com">Contact us</a> ');
document.write('   </td></tr></table>'   );

}

function LeftMenuLevel2Essentials_en() {

document.write('<p><a href="../circular/essentials.html"> &nbsp; Highlights</a> <br>');
document.write('<a href="../essentials/spirits_ess.html#Scotch0"> &nbsp; Scotch </a><br>');
document.write('<a href="../essentials/spirits_ess.html#Cognac0"> &nbsp; Cognac</a><br>');
document.write('<a href="../essentials/spirits_ess.html#Armagnac0"> &nbsp; Armagnac </a><br>');
document.write('<a href="../essentials/spirits_ess.html#Liqueur0"> &nbsp; Liqueur </a><br>');
document.write('<a href="../essentials/spirits_ess.html#Grappa0"> &nbsp; Grappa </a><br>');
document.write('<a href="../essentials/spirits_ess.html#spirits"> &nbsp; Other Spirits</a><br>');
document.write('<a href="../essentials/fortified_wines_ess.html#Port0" target="_top"> &nbsp; Port</a><br>');
document.write('<a href="../essentials/icewines_ess.html#icewines" target="_top">&nbsp; Icewine</a><br>');
document.write('<a href="../essentials/white_wines_ess.html" target="_top">&nbsp; White Table Wine</a><br>');
document.write('<a href="../essentials/red_wines_ess.html" target="_top">&nbsp; Red Table Wine</a><br>');
document.write('<span><a href="../essentials/champagne_ess.html" target="_top">&nbsp; Champagne</a></span></p>');
//document.write('');
}
// -------------------------------------HEADER IMAGES--------------------------------------------- 

// images
if (document.images) {
	//LEVEL 1 IN MAIN FOLDER
	
	nr1Here = new Image
	nr1Out = new Image
	nr1Over = new Image

	nr1Here.src = "__en/_images_en/buttons_en/nr_over_en.gif"
	nr1Out.src = "__en/_images_en/buttons_en/nr_en.gif"
	nr1Over.src = "__en/_images_en/buttons_en/nr_over_en.gif"

	// 2nd button: winesMonth
	wom1Here = new Image
	wom1Out = new Image
	wom1Over = new Image

	wom1Here.src = "__en/_images_en/buttons_en/wom_over_en.gif"
	wom1Out.src = "__en/_images_en/buttons_en/wom_en.gif"
	wom1Over.src = "__en/_images_en/buttons_en/wom_over_en.gif"

	//3rd button: Ontario VQA
	ontario1Here = new Image
	ontario1Out = new Image
	ontario1Over = new Image

	ontario1Here.src = "__en/_images_en/buttons_en/ontario_over_en.gif"
	ontario1Out.src = "__en/_images_en/buttons_en/ontario_en.gif"
	ontario1Over.src = "__en/_images_en/buttons_en/ontario_over_en.gif"

	//3rd button: cellarDirect
	cd1Here = new Image
	cd1Out = new Image
	cd1Over = new Image

	cd1Here.src = "__en/_images_en/buttons_en/cd_over_en.gif"
	cd1Out.src = "__en/_images_en/buttons_en/cd_en.gif"
	cd1Over.src = "__en/_images_en/buttons_en/cd_over_en.gif"

	// 4th button: essentialsCollection
	ec1Here = new Image
	ec1Out = new Image
	ec1Over = new Image

	ec1Here.src ="__en/_images_en/buttons_en/ec_over_en.gif"
	ec1Out.src ="__en/_images_en/buttons_en/ec_en.gif"
	ec1Over.src ="__en/_images_en/buttons_en/ec_over_en.gif"
	
	// 5th button: specialOffers
	so1Here = new Image
	so1Out = new Image
	so1Over = new Image

	so1Here.src = "__en/_images_en/buttons_en/so_over_en.gif"
	so1Out.src = "__en/_images_en/buttons_en/so_en.gif"
	so1Over.src = "__en/_images_en/buttons_en/so_over_en.gif"

	//6th button: events
	eventsHere = new Image
	eventsOut = new Image
	eventsOver = new Image

	eventsHere.src = "__en/_images_en/buttons_en/ev_over_en.gif"
	eventsOut.src =  "__en/_images_en/buttons_en/ev_en.gif"
	eventsOver.src = "__en/_images_en/buttons_en/ev_over_en.gif"

	// 7th button: classicsCatalogue
	cc1Here = new Image
	cc1Out = new Image
	cc1Over = new Image

	cc1Here.src = "__en/_images_en/buttons_en/cc_over_en.gif"
	cc1Out.src =  "__en/_images_en/buttons_en/cc_en.gif"
	cc1Over.src = "__en/_images_en/buttons_en/cc_over_en.gif"
	
	
	//LEVEL 2 IN CIRCULAR FOLDER

	// first button : newRelease
	circ_mainHere = new Image
	circ_mainOut = new Image
	circ_mainOver = new Image

	circ_mainHere.src = "../__en/_images_en/buttons_en/nr_over_en.gif"
	circ_mainOut.src = "../__en/_images_en/buttons_en/nr_en.gif"
	circ_mainOver.src = "../__en/_images_en/buttons_en/nr_over_en.gif"

	// 2nd button: winesMonth
	womHere = new Image
	womOut = new Image
	womOver = new Image

	womHere.src = "../__en/_images_en/buttons_en/wom_over_en.gif"
	womOut.src = "../__en/_images_en/buttons_en/wom_en.gif"
	womOver.src = "../__en/_images_en/buttons_en/wom_over_en.gif"


	//3rd button: Ontario VQA
	ontarioHere = new Image
	ontarioOut = new Image
	ontarioOver = new Image

	ontarioHere.src = "../__en/_images_en/buttons_en/ontario_over_en.gif"
	ontarioOut.src = "../__en/_images_en/buttons_en/ontario_en.gif"
	ontarioOver.src = "../__en/_images_en/buttons_en/ontario_over_en.gif"

	//3rd button: cellarDirect
	cdHere = new Image
	cdOut = new Image
	cdOver = new Image

	cdHere.src = "../__en/_images_en/buttons_en/cd_over_en.gif"
	cdOut.src = "../__en/_images_en/buttons_en/cd_en.gif"
	cdOver.src = "../__en/_images_en/buttons_en/cd_over_en.gif"

	// 4th button: essentialsCollection
	essentialsHere = new Image
	essentialsOut = new Image
	essentialsOver = new Image

	essentialsHere.src = "../__en/_images_en/buttons_en/ec_over_en.gif"
	essentialsOut.src = "../__en/_images_en/buttons_en/ec_en.gif"
	essentialsOver.src = "../__en/_images_en/buttons_en/ec_over_en.gif"
	
	// 5th button: specialOffers
	futuresHere = new Image
	futuresOut = new Image
	futuresOver = new Image

	futuresHere.src = "../__en/_images_en/buttons_en/so_over_en.gif"
	futuresOut.src = "../__en/_images_en/buttons_en/so_en.gif"
	futuresOver.src = "../__en/_images_en/buttons_en/so_over_en.gif"

	//6th button: events
	evenHere = new Image
	evenOut = new Image
	evenOver = new Image

	evenHere.src = "../__en/_images_en/buttons_en/ev_over_en.gif"
	evenOut.src =  "../__en/_images_en/buttons_en/ev_en.gif"
	evenOver.src = "../__en/_images_en/buttons_en/ev_over_en.gif"

	// 7th button: classicsCatalogue
	ccHere = new Image
	ccOut = new Image
	ccOver = new Image

	ccHere.src = "../__en/_images_en/buttons_en/cc_over_en.gif"
	ccOut.src =  "../__en/_images_en/buttons_en/cc_en.gif"
	ccOver.src = "../__en/_images_en/buttons_en/cc_over_en.gif"
	
	
	//LEVEL 3 IN CIRCULAR FOLDER
	
	nr3Here = new Image
	nr3Out = new Image
	nr3Over = new Image

	nr3Here.src = "../../__en/_images_en/buttons_en/nr_over_en.gif"
	nr3Out.src = "../../__en/_images_en/buttons_en/nr_en.gif"
	nr3Over.src = "../../__en/_images_en/buttons_en/nr_over_en.gif"

	// 2nd button: winesMonth
	wom3Here = new Image
	wom3Out = new Image
	wom3Over = new Image

	wom3Here.src = "../../__en/_images_en/buttons_en/wom_over_en.gif"
	wom3Out.src = "../../__en/_images_en/buttons_en/wom_en.gif"
	wom3Over.src = "../../__en/_images_en/buttons_en/wom_over_en.gif"


	//3rd button: Ontario VQA
	ontario3Here = new Image
	ontario3Out = new Image
	ontario3Over = new Image

	ontario3Here.src = "../../__en/_images_en/buttons_en/ontario_over_en.gif"
	ontario3Out.src = "../../__en/_images_en/buttons_en/ontario_en.gif"
	ontario3Over.src = "../../__en/_images_en/buttons_en/ontario_over_en.gif"
	
	
	//3rd button: cellarDirect
	cd3Here = new Image
	cd3Out = new Image
	cd3Over = new Image

	cd3Here.src = "../../__en/_images_en/buttons_en/cd_over_en.gif"
	cd3Out.src = "../../__en/_images_en/buttons_en/cd_en.gif"
	cd3Over.src = "../../__en/_images_en/buttons_en/cd_over_en.gif"

	// 4th button: essentialsCollection
	ec3Here = new Image
	ec3Out = new Image
	ec3Over = new Image

	ec3Here.src ="../../__en/_images_en/buttons_en/ec_over_en.gif"
	ec3Out.src ="../../__en/_images_en/buttons_en/ec_en.gif"
	ec3Over.src ="../../__en/_images_en/buttons_en/ec_over_en.gif"
	
	// 5th button: specialOffers
	so3Here = new Image
	so3Out = new Image
	so3Over = new Image

	so3Here.src = "../../__en/_images_en/buttons_en/so_over_en.gif"
	so3Out.src = "../../__en/_images_en/buttons_en/so_en.gif"
	so3Over.src = "../../__en/_images_en/buttons_en/so_over_en.gif"

	//6th button: events
	ev3Here = new Image
	ev3Out = new Image
	ev3Over = new Image

	ev3Here.src = "../../__en/_images_en/buttons_en/ev_over_en.gif"
	ev3Out.src =  "../../__en/_images_en/buttons_en/ev_en.gif"
	ev3Over.src = "../../__en/_images_en/buttons_en/ev_over_en.gif"

	// 7th button: classicsCatalogue
	cc3Here = new Image
	cc3Out = new Image
	cc3Over = new Image

	cc3Here.src = "../../__en/_images_en/buttons_en/cc_over_en.gif"
	cc3Out.src =  "../../__en/_images_en/buttons_en/cc_en.gif"
	cc3Over.src = "../../__en/_images_en/buttons_en/cc_over_en.gif"
	
} 
else  {
	
	//LEVEL 1 IN MAIN FOLDER
		//LEVEL 3 TOP IMAGES -IN CIRCULAR FOLDER
		
	nr1Here = ""
	nr1Out = ""
	nr1Over = ""
	document.nr1 = ""

	wom1Here = ""
	wom1Out = ""
	wom1Over = ""
	document.wom1 = ""

	ontario1Here = ""
	ontario1Out = ""
	ontario1Over = ""
	document.ontario1 = ""

	cd1Here = ""
	cd1Out = ""
	cd1Over = ""
	document.cd1 = ""

	ec1Here = ""
	ec1Out = ""
	ec1Over = ""
	document.ec1 = ""
	
	so1Here = ""
	so1Out = ""
	so1Over = ""
	document.so1 = ""
	
	eventsHere = ""
	eventsOut = ""
	eventsOver = ""
	document.events = ""	
	
	cc1Here = ""
	cc1Out = ""
	cc1Over = ""
	document.cc1 = ""
	
	//LEVEL 2 TOP IMAGES -IN CIRCULAR FOLDER
	
	// first button : newRelease
	circ_mainHere = ""
	circ_mainOut = ""
	circ_mainOver = ""
	document.circ_main = ""

	womHere = ""
	womOut = ""
	womOver = ""
	document.wom = ""

	ontarioHere = ""
	ontarioOut = ""
	ontarioOver = ""
	document.ontario = ""

	cdHere = ""
	cdOut = ""
	cdOver = ""
	document.cd = ""

	essentialsHere = ""
	essentialsOut = ""
	essentialsOver = ""
	document.essentials = ""
	
	futuresHere = ""
	futuresOut = ""
	futuresOver = ""
	document.futures = ""
	
	evenHere = ""
	evenOut = ""
	evenOver = ""
	document.even = ""	
	
	ccHere = ""
	ccOut = ""
	ccOver = ""
	document.cc = ""
	
	//LEVEL 3 TOP IMAGES -IN CIRCULAR FOLDER
		
	nr3Here = ""
	nr3Out = ""
	nr3Over = ""
	document.nr3 = ""

	wom3Here = ""
	wom3Out = ""
	wom3Over = ""
	document.wom3 = ""
		
	ontario3Here = ""
	ontario3Out = ""
	ontario3Over = ""
	document.ontario3 = ""

	cd3Here = ""
	cd3Out = ""
	cd3Over = ""
	document.cd3 = ""

	ec3Here = ""
	ec3Out = ""
	ec3Over = ""
	document.ec3 = ""
	
	so3Here = ""
	so3Out = ""
	so3Over = ""
	document.so3 = ""
	
	ev3Here = ""
	ev3Out = ""
	ev3Over = ""
	document.ev3 = ""	
	
	cc3Here = ""
	cc3Out = ""
	cc3Over = ""
	document.cc3 = ""
}


// ----------------------------------------------------START LEVEL 3 - TOP HEADER IMAGES--------------------------------------------------- 	

function top_navbar_Level1_Search() {
	//document.write(window.location)
    var mainStr1 //= new String
    mainStr1 = window.location.href 
    //document.write(mainStr1)
	document.write("<table bgcolor ='#FAFAFC' height='21'  border='0' align='left' cellpadding='0' cellspacing='0'><tr>")


    if (mainStr1.indexOf("nr1") != -1)
    {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='93' height='21'><IMG SRC='__en/_images_en/buttons_en/nr_over_en.gif' name='nr1' border = '0'></td>")
    } 
	else {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='93' height='21'><A HREF ='circular/circ_main.html' onMouseover='document.nr1.src=nr1Over.src' onMouseout='document.nr1.src=nr1Out.src' target='_blank'><IMG SRC='__en/_images_en/buttons_en/nr_en.gif' name='nr1' border = '0'></A></td> ")
	}

	if (mainStr1.indexOf("wom1") != -1) {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='120'><IMG SRC='__en/_images_en/buttons_en/wom_over_en.gif' name='wom' border = '0'></td>")	
	}
    else {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='120'><A HREF ='circular/wom.html' onMouseover='document.wom1.src=wom1Over.src' onMouseout='document.wom1.src=wom1Out.src' target='_blank'><IMG SRC='__en/_images_en/buttons_en/wom_en.gif' name='wom1' border ='0'></A></td>")
	}
	
	if (mainStr1.indexOf("ontario1") != -1) {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='93'><IMG SRC='__en/_images_en/buttons_en/ontario_over_en.gif' name='ontario1' border = '0'></td> ")	
	}
    else {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='93'><A HREF ='circular/ontario.html' onMouseover='document.ontario1.src=ontario1Over.src' onMouseout='document.ontario1.src=ontario1Out.src' target='_blank'><IMG SRC='__en/_images_en/buttons_en/ontario_en.gif' name='ontario1' border = '0'></A></td>")
	}
	
	if (mainStr1.indexOf("ec1") != -1) {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='120' height='21'><IMG SRC='__en/_images_en/buttons_en/ec_over_en.gif' name='ec1' border = '0'></td> ")	
	}
    else {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='120' height='21'><A HREF ='circular/essentials.html' onMouseover='document.ec1.src=ec1Over.src' onMouseout='document.ec1.src=ec1Out.src' target='_blank'><IMG SRC='__en/_images_en/buttons_en/ec_en.gif' name='ec1' border = '0'></A></td>")
	}
	
    if (mainStr1.indexOf("so1") != -1) {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='93' height='21'><IMG SRC='__en/_images_en/buttons_en/so_over_en.gif' name='so1' border = '0'></td> ")	
	}
    else {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='93' height='21'><A HREF ='futures/futures_main_intro.html' onMouseover='document.so1.src=so1Over.src' onMouseout='document.so1.src=so1Out.src' target='_blank'><IMG SRC='__en/_images_en/buttons_en/so_en.gif' name='so1' border = '0'></A></td>")
	}
	
    if (mainStr1.indexOf("events") != -1) {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='50 height='21'><IMG SRC='__en/_images_en/buttons_en/ev_over_en.gif' name='events' border = '0'></td>")	
	}
    else {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='50 height='21'><A HREF ='events.html' onMouseover='document.events.src=eventsOver.src' onMouseout='document.events.src=eventsOut.src' target='_blank'><IMG SRC='__en/_images_en/buttons_en/ev_en.gif' name='events' border ='0'></A></td> ")
	}

	 if (mainStr1.indexOf("cc1") != -1) {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='129'><IMG SRC='__en/_images_en/buttons_en/cc_over_en.gif' name='cc1' border = '0'></td> ")	
	}
    else {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='129'><A HREF ='classics/cc_main.html' onMouseover='document.cc1.src=cc1Over.src' onMouseout='document.cc1.src=cc1Out.src' target='_blank'><IMG SRC='__en/_images_en/buttons_en/cc_en.gif' name='cc1' border ='0'></A></td> ")
	}
	
    	document.write("<td bgcolor='#FAFAFC' valign='bottom' width='110' height='21'></td></tr></table>")
}


// ----------------------------------------------------START LEVEL 3 - TOP HEADER IMAGES--------------------------------------------------- 	

function top_navbar_Level1() {
	//document.write(window.location)
    var mainStr1 //= new String
    mainStr1 = window.location.href 
    //document.write(mainStr1)
	document.write("<table bgcolor ='#FAFAFC' height='21'  border='0' align='left' cellpadding='0' cellspacing='0'><tr>")


    if (mainStr1.indexOf("nr1") != -1)
    {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='93' height='21'><IMG SRC='__en/_images_en/buttons_en/nr_over_en.gif' name='nr1' border = '0'></td>")
    } 
	else {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='93' height='21'><A HREF ='circular/circ_main.html' onMouseover='document.nr1.src=nr1Over.src' onMouseout='document.nr1.src=nr1Out.src'><IMG SRC='__en/_images_en/buttons_en/nr_en.gif' name='nr1' border = '0'></A></td> ")
	}

	if (mainStr1.indexOf("wom1") != -1) {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='120'><IMG SRC='__en/_images_en/buttons_en/wom_over_en.gif' name='wom' border = '0'></td>")	
	}
    else {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='120'><A HREF ='circular/wom.html' onMouseover='document.wom1.src=wom1Over.src' onMouseout='document.wom1.src=wom1Out.src'><IMG SRC='__en/_images_en/buttons_en/wom_en.gif' name='wom1' border ='0'></A></td>")
	}
	
	if (mainStr1.indexOf("ontario1") != -1) {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='93'><IMG SRC='__en/_images_en/buttons_en/ontario_over_en.gif' name='ontario1' border = '0'></td> ")	
	}
    else {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='93'><A HREF ='circular/ontario.html' onMouseover='document.ontario1.src=ontario1Over.src' onMouseout='document.ontario1.src=ontario1Out.src'><IMG SRC='__en/_images_en/buttons_en/ontario_en.gif' name='ontario1' border = '0'></A></td>")
	}
	
	
	if (mainStr1.indexOf("ec1") != -1) {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='120' height='21'><IMG SRC='__en/_images_en/buttons_en/ec_over_en.gif' name='ec1' border = '0'></td> ")	
	}
    else {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='120' height='21'><A HREF ='circular/essentials.html' onMouseover='document.ec1.src=ec1Over.src' onMouseout='document.ec1.src=ec1Out.src'><IMG SRC='__en/_images_en/buttons_en/ec_en.gif' name='ec1' border = '0'></A></td>")
	}
	
    if (mainStr1.indexOf("so1") != -1) {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='93' height='21'><IMG SRC='__en/_images_en/buttons_en/so_over_en.gif' name='so1' border = '0'></td> ")	
	}
    else {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='93' height='21'><A HREF ='futures/futures_main_intro.html' onMouseover='document.so1.src=so1Over.src' onMouseout='document.so1.src=so1Out.src'><IMG SRC='__en/_images_en/buttons_en/so_en.gif' name='so1' border = '0'></A></td>")
	}
	
    if (mainStr1.indexOf("events") != -1) {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='50 height='21'><IMG SRC='__en/_images_en/buttons_en/ev_over_en.gif' name='events' border = '0'></td>")	
	}
    else {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='50 height='21'><A HREF ='events.html' onMouseover='document.events.src=eventsOver.src' onMouseout='document.events.src=eventsOut.src'><IMG SRC='__en/_images_en/buttons_en/ev_en.gif' name='events' border ='0'></A></td> ")
	}

	 if (mainStr1.indexOf("cc1") != -1) {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='129'><IMG SRC='__en/_images_en/buttons_en/cc_over_en.gif' name='cc1' border = '0'></td> ")	
	}
    else {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='129'><A HREF ='classics/cc_main.html' onMouseover='document.cc1.src=cc1Over.src' onMouseout='document.cc1.src=cc1Out.src'><IMG SRC='__en/_images_en/buttons_en/cc_en.gif' name='cc1' border ='0'></A></td> ")
	}
	
    	document.write("<td bgcolor='#FAFAFC'  ></a></td></tr></table>")
}


// ----------------------------------------------------END LEVEL 2 - TOP HEADER IMAGES--------------------------------------------------- 	

function top_navbar_Level2() {
	//document.write(window.location)
    var mainStr //= new String
    mainStr = window.location.href 
    //document.write(mainStr)
	document.write("<table bgcolor='#FAFAFC' height='21'  border='0' align='left'  cellpadding='0' cellspacing='0'><tr>")

 	if (mainStr.indexOf("circ_main") != -1) {
		document.write("<td bgcolor='#FAFAFC'  valign='bottom' width='93' height='21'><IMG SRC=' ../__en/_images_en/buttons_en/nr_over_en.gif' name='circ_main' border = '0'></td> ")	
	}
    else {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='93' height='21'><A HREF =' ../circular/circ_main.html' onMouseover='document.circ_main.src=circ_mainOver.src' onMouseout='document.circ_main.src=circ_mainOut.src'><IMG SRC=' ../__en/_images_en/buttons_en/nr_en.gif' name='circ_main'  border = '0'></A></td> ")
	}
     
    if (mainStr.indexOf("wom") != -1) {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='120'><IMG SRC=' ../__en/_images_en/buttons_en/wom_over_en.gif' name='wom' border = '0'></td>")	
	}
    else {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='120'><A HREF =' ../circular/wom.html' onMouseover='document.wom.src=womOver.src' onMouseout='document.wom.src=womOut.src'><IMG SRC=' ../__en/_images_en/buttons_en/wom_en.gif' name='wom' border ='0'></A></td>")
	}

	if (mainStr.indexOf("ontario") != -1) {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='93'><IMG SRC='../__en/_images_en/buttons_en/ontario_over_en.gif' name='ontario' border = '0'></td> ")	
	}
    else {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='93'><A HREF ='../circular/ontario.html' onMouseover='document.ontario.src=ontarioOver.src' onMouseout='document.ontario.src=ontarioOut.src'><IMG SRC='../__en/_images_en/buttons_en/ontario_en.gif' name='ontario' border = '0'></A></td>")
	}
   
   	    if (mainStr.indexOf("essentials") != -1) {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='120'><IMG SRC=' ../__en/_images_en/buttons_en/ec_over_en.gif' name='essentials' border = '0'></td>")	
	}
    else {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='120'><A HREF =' ../circular/essentials.html' onMouseover='document.essentials.src=essentialsOver.src' onMouseout='document.essentials.src=essentialsOut.src'><IMG SRC=' ../__en/_images_en/buttons_en/ec_en.gif' name='essentials' border = '0'></A></td>")
	}
	
    if (mainStr.indexOf("futures") != -1) {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='93' > <IMG SRC=' ../__en/_images_en/buttons_en/so_over_en.gif' name='futures' border = '0'></td> ")	
	}
    else {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='93'><A HREF =' ../futures/futures_main_intro.html' onMouseover='document.futures.src=futuresOver.src' onMouseout='document.futures.src=futuresOut.src'><IMG SRC=' ../__en/_images_en/buttons_en/so_en.gif' name='futures' border = '0'></A></td> ")
	}
	
    if (mainStr.indexOf("even") != -1) {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='50'><IMG SRC=' ../__en/_images_en/buttons_en/ev_over_en.gif' name='even' border = '0'></td> ")	
	}
    else {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='50'><A HREF =' ../events.html' onMouseover='document.even.src=evenOver.src' onMouseout='document.even.src=evenOut.src'><IMG SRC=' ../__en/_images_en/buttons_en/ev_en.gif' name='even' border ='0'></A></td> ")
	}
		
    if (mainStr.indexOf("cc") != -1) {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='129'><IMG SRC='../__en/_images_en/buttons_en/cc_over_en.gif' name='cc' border = '0'></td> ")	
	}
    else {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='129'><A HREF =' ../classics/cc_main.html' onMouseover='document.cc.src=ccOver.src' onMouseout='document.cc.src=ccOut.src'><IMG SRC=' ../__en/_images_en/buttons_en/cc_en.gif' name='cc' border ='0'></A></td> ")
	}
    	document.write("<td bgcolor='#FAFAFC'  ></td></tr></table>")
	
}

// ----------------------------------------------------END LEVEL 2 - TOP HEADER IMAGES--------------------------------------------------- 	



// ----------------------------START LEVEL 3 - TOP HEADER NAVIGATION  IMAGES--------------------------------------------------- 	

function top_navbar_Level3() {
	//document.write(window.location)
    var mainStr3 //= new String
    mainStr3 = window.location.href 
	document.write("<table bgcolor='#FAFAFC' height='21' border='0' cellpadding='0' cellspacing='0' align='left'><tr>")


    if (mainStr3.indexOf("nr3") != -1)
    {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='93' height='21'><IMG SRC='../../__en/_images_en/buttons_en/nr_over_en.gif' name='nr3' border = '0'></td> ")
    } 
	else {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='93' height='21'><A HREF ='../../circular/circ_main.html' onMouseover='document.nr3.src=nr3Over.src' onMouseout='document.nr3.src=nr3Out.src'><IMG SRC='../../__en/_images_en/buttons_en/nr_en.gif' name='nr3' border = '0'></A></td> ")
	}

    if (mainStr3.indexOf("wom3") != -1) {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='120' height='21'><IMG SRC='../../__en/_images_en/buttons_en/wom_over_en.gif' name='wom3' border = '0'></td> ")	
	}
    else {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='120' height='21'><A HREF ='../../circular/wom.html' onMouseover='document.wom3.src=wom3Over.src' onMouseout='document.wom3.src=wom3Out.src'><IMG SRC='../../__en/_images_en/buttons_en/wom_en.gif' name='wom3' border ='0'></A></td> ")
	}

	if (mainStr3.indexOf("ontario3") != -1) {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='93'><IMG SRC='../../__en/_images_en/buttons_en/ontario_over_en.gif' name='ontario3' border = '0'></td> ")	
	}
    else {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='93'><A HREF ='../../circular/ontario.html' onMouseover='document.ontario3.src=ontario3Over.src' onMouseout='document.ontario3.src=ontario3Out.src'><IMG SRC='../../__en/_images_en/buttons_en/ontario_en.gif' name='ontario3' border = '0'></A></td>")
	}
   	    if (mainStr3.indexOf("ec3") != -1) {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='120' height='21'><IMG SRC='../../__en/_images_en/buttons_en/ec_over_en.gif' name='ec3' border = '0'></td> ")	
	}
    else {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='120' height='21'><A HREF ='../../circular/essentials.html' onMouseover='document.ec3.src=ec3Over.src' onMouseout='document.ec3.src=ec3Out.src'><IMG SRC='../../__en/_images_en/buttons_en/ec_en.gif' name='ec3' border = '0'></A></td> ")
	}
	
    if (mainStr3.indexOf("so3") != -1) {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='93' height='21'><IMG SRC='../../__en/_images_en/buttons_en/so_over_en.gif' name='so3' border = '0'></td> ")	
	}
    else {
		document.write("<td bgcolor='#FAFAFC' valign='bottom'><A HREF ='../../futures/futures_main_intro.html' onMouseover='document.so3.src=so3Over.src' onMouseout='document.so3.src=so3Out.src'><IMG SRC='../../__en/_images_en/buttons_en/so_en.gif' name='so3' border = '0'></A></td> ")
	}
	
	if (mainStr3.indexOf("ev3") != -1) {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='50 height='21'><IMG SRC='../../__en/_images_en/buttons_en/ev_over_en.gif' name='ev3' border = '0'></td>")	
	}
    else {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='50 height='21'><A HREF ='../../events.html' onMouseover='document.ev3.src=ev3Over.src' onMouseout='document.ev3.src=ev3Out.src'><IMG SRC='../../__en/_images_en/buttons_en/ev_en.gif' name='ev3' border ='0'></A></td> ")
	}
	
	if (mainStr3.indexOf("cc3") != -1) {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='129' height='21'><IMG SRC='../../__en/_images_en/buttons_en/cc_over_en.gif' name='cc3' border = '0'></td> ")	
	}
    else {
		document.write("<td bgcolor='#FAFAFC' valign='bottom' width='129' height='21'><A HREF ='../../classics/cc_main.html' onMouseover='document.cc3.src=cc3Over.src' onMouseout='document.cc3.src=cc3Out.src'><IMG SRC='../../__en/_images_en/buttons_en/cc_en.gif' name='cc3' border ='0'></A></td>")
	}

	document.write("<td bgcolor='#FAFAFC'  ></td></tr></table>")
}

// ----------------------------------END LEVEL 3 - TOP HEADER IMAGES-------------------------------



// --------------------START LEVEL 3 - TOP HEADER IMAGES SEARCH VINTAGES LATEST ------------------
 
function headerButtonsMenuLevel3Monthly() {
	document.write(' <table width="800" height="62" border="0" align="center" cellpadding="0" cellspacing="0">');
	document.write(' <tr><td width="221" height="62" align="center" valign="middle">');
	document.write(' <a href="../../index.html" target="_top"><img src="../../__en/_images_en/VintageslogoEN.gif" alt="Vintages Fine Wine and Premium Spirits" width="220" height="42" border="0" align="middle"></a>');
	document.write('</td><td width="292"  align="center" valign="middle">&nbsp;</td><td width="291"></td></tr></table>');
	} 
 
function headerSearchLevel3() {
	
document.write('<table width="800" height="94" border="0" align="center" cellpadding="0" cellspacing="0">');
document.write('<tr height="83"><td width="193" height="94" align = "center"><table width="183"  height="76" align="center" valign= "top">');
document.write('<tr><td width="168" height="21" align ="left" valign="middle">');
document.write('<form action="../../frame_results.html" method="get" name="inputForm">');
document.write('<input type="text" name="ITEM_NAME" onKeyPress="checkEnter(event)" size="18">');
document.write(' <a href="javascript:document.inputForm.submit();"> ');
document.write('<img src="../../images/search_buttons_en/keyword_search.gif" alt="Search" border=0></a><br>');
document.write('<a href="../../frame_search.html" target="_top" valign="top">Advanced Product Search</a></form>');
document.write('</td></tr></table></td>');
document.write('<td width="495"  align="left" valign="top">');
document.write('<img src="../../media_common/index-wines-features.jpg" width="495" height="97">');
document.write('</td>');		
document.write('<td width="112" align = "center" valign="middle"><a href="http://www.vintageslatest.com" target="_blank"><img src="../../media_common/btn_vintages_latest.gif" width="112" height="97" border="0"></a></td></tr>');
document.write('</table>');
							
}
function headerSearchLevel2() {
	
document.write('<table width="800" height="94" border="0" align="center" cellpadding="0" cellspacing="0">');
document.write('<tr height="83"><td width="193" height="94" align = "center"><table width="183"  height="76" align="center" valign= "top">');
document.write('<tr><td width="168" height="21" align ="left" valign="middle">');
document.write('<form action="../frame_results.html" method="get" name="inputForm">');
document.write('<input type="text" name="ITEM_NAME" onKeyPress="checkEnter(event)" size="18">');
document.write(' <a href="javascript:document.inputForm.submit();"> ');
document.write('<img src="../images/search_buttons_en/keyword_search.gif" alt="Search" border=0></a><br>');
document.write('<a href="../frame_search.html" target="_top" valign="top">Advanced Product Search</a></form>');
document.write('</td></tr></table></td>');
document.write('<td width="495"  align="left" valign="top">');
document.write('<img src="../media_common/index-wines-features.jpg" width="495" height="97">');
document.write('</td>');		
document.write('<td width="112" align = "center" valign="middle"><a href="http://www.vintageslatest.com" target="_blank"><img src="../media_common/btn_vintages_latest.gif" width="112" height="97" border="0"></a></td></tr>');
document.write('</table>');
							
}
// --------------------END LEVEL 3 - TOP HEADER IMAGES SEARCH VINTAGES LATEST ------------------
