/* Buttons Identifiers */
var vc_buttontype_sml				= 1;
var vc_buttontype_med				= 2;
var vc_buttontype_lrg				= 3;
var vc_buttontype_xlon				= 4;
var vc_buttontype_xloff				= 5;
var vc_buttontype_preordsml			= 6;
var vc_buttontype_preordmed			= 7;
var vc_buttontype_preordlrg			= 8;
var vc_buttontype_preordlrg_xlon	= 9;
var vc_buttontype_preordlrg_xloff	= 10;
var vc_buttontype_search			= 11;
var vc_buttontype_search_xlane		= 12;
var vc_buttontype_search_preord		= 13;
var vc_buttontype_product			= 14;
var vc_buttontype_product_xlane		= 15;
var vc_buttontype_product_preord	= 16;
var vc_buttontype_new				= 17;
var vc_buttontype_used				= 18;
var vc_buttontype_sml2				= 19;
var vc_buttontype_preordsml2		= 20;
var vc_buttontype_oopresult			= 21;
var vc_buttontype_proceedcheckout	= 22;
var vc_buttontype_preord_proceed	= 23;
var vc_buttontype_univ_standard		= 24;
var vc_buttontype_univ_preorder		= 25;
var vc_buttontype_univ_large_added  = 26;
var vc_buttontype_univ_preorder_large_added = 27;	
var vc_buttontype_univ_cds2 =	28;
var vc_buttontype_univ_cds2_preorder = 29;
var vc_buttontype_cairoused1 = 30;
var vc_buttontype_cairoused2 = 31;
var vc_buttontype_addtocart = 32;
var vc_buttontype_preordernow = 33;
var vc_buttontype_univ06_cds2 =34;




/* Function Definitions */
function get_cookie (CookieName) {
	var counter;
	var CookieSet;
	var CookiePieces;
	var CookieFound = "";

	if (document.cookie.length < 1) {
		return(CookieFound);
		}

	CookieSet = document.cookie.split(';');

	for (counter = 0; ((counter < CookieSet.length) && (CookieFound == "")); counter++) {
		CookiePieces = CookieSet[counter].split ('=');
		if (CookiePieces[0].substring(0,1) == ' ') {
			CookiePieces[0] = CookiePieces[0].substring(1,CookiePieces[0].length);
			}
		if (CookiePieces[0] == CookieName) {
			arrShift(CookiePieces);
			CookieFound = CookiePieces.join('=');
			}
		}

	return(replaceChars(CookieFound));
	}
	
function replaceChars(entry) {
	replace_char = "+"; // replace this
	replace_with = " "; // with this
	temp = "" + entry; // temporary holder

	while (temp.indexOf(replace_char)>-1) {
		pos= temp.indexOf(replace_char);
		temp = "" + (temp.substring(0, pos) + replace_with + 
		temp.substring((pos + replace_char.length), temp.length));
		}
	return(temp);
	}


function vc_get_prodids () {
	var regex;
	var counter;
	var CookieSet;
	var CookiePieces;
	var CookieFound = "";

	if (vc_prodids_processed) {
		return("");
		}
	vc_prodids_processed = true;

	regex = /[&?]vcprodid=([^&]+)/i;
	if (regex.exec(window.location.search) != null) {
		arrPush(vc_prodids,RegExp.$1.toUpperCase());
		}

	CookieFound = get_cookie("vcprodid");
	if (CookieFound == "") {
		return("");
		}
	CookieSet = CookieFound.split('&')

	for (counter = 0; counter < CookieSet.length; counter++) {
		CookiePieces = CookieSet[counter].split ('=');
		if (CookiePieces[0].substring(0,1) == ' ') {
			CookiePieces[0] = CookiePieces[0].substring(1,CookiePieces[0].length);
			}
		if (CookiePieces[1].substring(0,1) == ' ') {
			CookiePieces[1] = CookiePieces[1].substring(1,CookiePieces[1].length);
			}
		arrPush(vc_prodids,CookiePieces[0].toUpperCase());
		arrPush(vc_prodids,CookiePieces[1].toUpperCase());
		}
	}

function vc_show_cartbutton (prodid, buttontype) {
	var counter_outer;
	var counter_inner;
	var idfound = false;

	if (vc_goodbrowser) {
		vc_get_prodids();

		prodid = prodid.toUpperCase().split('|');

		for (counter_outer = 0; (counter_outer < vc_prodids.length) && !idfound; counter_outer++) {
			for (counter_inner = 0; (counter_inner < prodid.length) && !idfound; counter_inner++) {
				if (prodid[counter_inner] == vc_prodids[counter_outer]) {
					idfound = true;
					}
				}
			}
		}

	if (buttontype == vc_buttontype_sml) {
		document.write(idfound ? vc_button_sml_hot : vc_button_sml_cold);
		return(true);
		}
	if (buttontype == vc_buttontype_med) { 
		document.write(idfound ? vc_button_med_hot : vc_button_med_cold);
		return(true);
		}
	if (buttontype == vc_buttontype_lrg) { 
		document.write(idfound ? vc_button_lrg_hot : vc_button_lrg_cold);
		return(true);
		}
	if (buttontype == vc_buttontype_xlon) { 
		document.write(idfound ? vc_button_xlon_hot : vc_button_xlon_cold);
		return(true);
		}
	if (buttontype == vc_buttontype_xloff) { 
		document.write(idfound ? vc_button_xloff_hot : vc_button_xloff_cold);
		return(true);
		}
	if (buttontype == vc_buttontype_preordsml) { 
		document.write(idfound ? vc_button_preordsml_hot : vc_button_preordsml_cold);
		return(true);
		}
	if (buttontype == vc_buttontype_preordmed) { 
		document.write(idfound ? vc_button_preordmed_hot : vc_button_preordmed_cold);
		return(true);
		}
	if (buttontype == vc_buttontype_preordlrg) { 
		document.write(idfound ? vc_button_preordlrg_hot : vc_button_preordlrg_cold);
		return(true);
		}
	if (buttontype == vc_buttontype_preordlrg_xlon) { 
		document.write(idfound ? vc_button_preordlrg_xlon_hot : vc_button_preordlrg_xlon_cold);
		return(true);
		}
	if (buttontype == vc_buttontype_preordlrg_xloff) { 
		document.write(idfound ? vc_button_preordlrg_xloff_hot : vc_button_preordlrg_xloff_cold);
		return(true);
		}
	if (buttontype == vc_buttontype_search) { 
		document.write(idfound ? vc_button_search_hot : vc_button_search_cold);
		return(true);
		}
	if (buttontype == vc_buttontype_search_xlane) { 
		document.write(idfound ? vc_button_search_xlane_hot : vc_button_search_xlane_cold);
		return(true);
		}
	if (buttontype == vc_buttontype_search_preord) { 
		document.write(idfound ? vc_button_search_preord_hot : vc_button_search_preord_cold);
		return(true);
		}
	if (buttontype == vc_buttontype_product) { 
		document.write(idfound ? vc_button_product_hot : vc_button_product_cold);
		return(true);
		}
	if (buttontype == vc_buttontype_product_xlane) { 
		document.write(idfound ? vc_button_product_xlane_hot : vc_button_product_xlane_cold);
		return(true);
		}
	if (buttontype == vc_buttontype_product_preord) { 
		document.write(idfound ? vc_button_product_preord_hot : vc_button_product_preord_cold);
		return(true);
		}
	if (buttontype == vc_buttontype_new) { 
		document.write(idfound ? vc_button_new_hot : vc_button_new_cold);
		return(true);
		}
	if (buttontype == vc_buttontype_used) { 
		document.write(idfound ? vc_button_used_hot : vc_button_used_cold);
		return(true);
		}
	if (buttontype == vc_buttontype_sml2) {
		document.write(idfound ? vc_button_sml_hot2 : vc_button_sml_cold2);
		return(true);
		}
	if (buttontype == vc_buttontype_preordsml2) { 
		document.write(idfound ? vc_button_preordsml_hot2 : vc_button_preordsml_cold2);
		return(true);
		}
	if (buttontype == vc_buttontype_oopresult) { 
		document.write(idfound ? vc_button_oopresult_hot : vc_button_oopresult_cold);
		return(true);
		}
	if (buttontype == vc_buttontype_proceedcheckout) { 
		document.write(idfound ? vc_button_proceedcheckout_hot : vc_button_proceedcheckout_cold);
		return(true);
		}
	if (buttontype == vc_buttontype_univ_standard) { 
		document.write(idfound ? vc_button_univ_standard_hot : vc_button_univ_standard_cold);
		return(true);
		}	
	if (buttontype == vc_buttontype_univ_preorder	) { 
		document.write(idfound ? vc_button_univ_preorder_hot : vc_button_univ_preorder_cold);
		return(true);
		}	
		
	if (buttontype == vc_buttontype_preord_proceed) { 
		document.write(idfound ? vc_button_proceedcheckout_hot : vc_button_preordsml_cold2);
		return(true);
		}
		
	if (buttontype == vc_buttontype_univ_large_added) {
		document.write(idfound ? vc_buttontype_univ_large_hot : vc_button_univ_standard_cold);
		return(true);
		}

	if (buttontype == vc_buttontype_univ_preorder_large_added	) { 
		document.write(idfound ? vc_buttontype_univ_large_hot : vc_button_univ_preorder_cold);
		return(true);
		}	
	if (buttontype == vc_buttontype_univ_cds2) { 
		document.write(idfound ? vc_button_univ_cds2_hot : vc_button_univ_cds2_cold);
		return(true);
		}	
		
	if (buttontype == vc_buttontype_univ_cds2_preorder) { 
		document.write(idfound ? vc_buttontype_univ_cds2_preorder_hot : vc_buttontype_univ_cds2_preorder_cold);
		return(true);
		}
		
	if (buttontype == vc_buttontype_cairoused1) {
		document.write(idfound ? vc_button_cairoused1_hot : vc_button_cairoused1_cold);
		return(true);
		}	
	
	if (buttontype == vc_buttontype_cairoused2) {
		document.write(idfound ? vc_button_cairoused2_hot : vc_button_cairoused2_cold);
		return(true);
		}
	
	if (buttontype == vc_buttontype_addtocart) {
		document.write(idfound ? vc_button_addtocart_hot : vc_button_addtocart_cold);
		return(true);
		}
	
	if (buttontype == vc_buttontype_preordernow) {
		document.write(idfound ? vc_button_preordernow_hot : vc_button_preordernow_cold);
		return(true);
		}		
	
	if (buttontype == vc_buttontype_univ06_cds2) {
		document.write(idfound ? vc_button_addtocart_hot : vc_button_univ06_cds2_cold);
		return(true);
		}
	
	document.write("Javascript Error: show_cartbutton(prodid,buttontype) [buttontype not recognized]]");
	return(false);
	}

function arrShift (thearray) {
	var counter;
	var retval;

	retval = thearray[0];
	for (counter = 0; counter < (thearray.length - 1); counter++) {
		thearray[counter] = thearray[counter + 1];
		}
	thearray.length = thearray.length - 1;

	return(retval);
	}

function arrPush (thearray,value) {
	thearray[thearray.length] = value;
	}

/* Environment Values */
if (vc_webhost == null) { vc_webhost = "www.barnesandnoble.com"; }
if (vc_shophost == null) { vc_shophost = "cart.barnesandnoble.com"; }
if (vc_imagehost == null) { vc_imagehost = "images.barnesandnoble.com"; }
if (vc_slinkprefix == null) { vc_slinkprefix = "x=y"; }

/* Product Data */
var vc_prodids				= new Array(0);
var vc_prodids_processed	= false;
var vc_goodbrowser			= false;

/* Browser Test */
if (((navigator.appName == "Netscape") && (parseInt(navigator.appVersion) >= 4))
	||
	((navigator.appName == "Microsoft Internet Explorer") && (parseInt(navigator.appVersion) >= 4))) {
	vc_goodbrowser = true;
	}

/* Express lane account name */
var vc_xlname = unescape(get_cookie("XLANE"));


/* Button Definitions */
var vc_button_sml_hot				= '<IMG SRC="http://' + vc_imagehost + '/gresources/addtocart_sml_hot.gif" WIDTH="79" HEIGHT="25" BORDER="0" ALT="Item Added to Cart" VSPACE="3">';
var vc_button_sml_cold				= '<INPUT TYPE="IMAGE" NAME="AddToCart" SRC="http://' + vc_imagehost + '/gresources/addtocart_sml_cold.gif" WIDTH="80" HEIGHT="16" BORDER="0" ALT="Add to Cart" VSPACE="3">';
var vc_button_med_hot				= '<IMG SRC="http://' + vc_imagehost + '/gresources/addtocart_med_hot.gif" WIDTH="118" HEIGHT="13" BORDER="0" ALT="Item Added to Cart" VSPACE="3">';
var vc_button_med_cold				= '<INPUT TYPE="IMAGE" NAME="AddToCart" SRC="http://' + vc_imagehost + '/gresources/addtocart_sml_cold.gif" WIDTH="80" HEIGHT="16" BORDER="0" ALT="Add to Cart" VSPACE="3">';
var vc_button_lrg_hot				= '<IMG SRC="http://' + vc_imagehost + '/gresources/addtocart_lrg_hot.gif" WIDTH="120" HEIGHT="51" BORDER="0" ALT="Item Added to Cart" VSPACE="3">';
var vc_button_lrg_cold				= '<INPUT TYPE="IMAGE" NAME="AddToCart" SRC="http://' + vc_imagehost + '/gresources/addtocart_lrg_cold.gif" WIDTH="102" HEIGHT="25" BORDER="0" ALT="Add to Cart" VSPACE="3">';
var vc_button_xloff_hot				= '<IMG SRC="http://' + vc_imagehost + '/gresources/addtocart_xlx_hot.gif" WIDTH="119" HEIGHT="73" BORDER="0" ALT="This item has been added to your cart" VSPACE="3"><BR><IMG SRC="/gresources/cleardot.gif" ALT="" WIDTH="1" HEIGHT="9" BORDER="0"><BR><font size="-1" face="arial, helvetica, sans-serif"><B>Continue Browsing<BR>or<BR><A HREF="http://' + vc_shophost + '/shop/op.asp?step=fullCart&UIAction=editCart&' + vc_slinkprefix + '"><IMG SRC="http://' + vc_imagehost + '/gresources/vcart_checkout3.gif" WIDTH="126" HEIGHT="20" BORDER="0" ALT="Go To Checkout" VSPACE="7"></A></B></FONT><BR>';
var vc_button_xloff_cold			= '<font size="-1" face="arial, helvetica, sans-serif"><FONT COLOR="#003300"><B>Buy it Now!</B></FONT></FONT><BR><IMG SRC="/gresources/cleardot.gif" ALT="" WIDTH="1" HEIGHT="10" BORDER="0"><BR><FONT FACE="arial, helvetica, sans-serif" SIZE="-2"><INPUT TYPE="IMAGE" NAME="AddToCart" SRC="http://' + vc_imagehost + '/gresources/addtocart_lrg_cold.gif" WIDTH="102" HEIGHT="25" BORDER="0" ALT="Add to Cart" VSPACE="3"><IMG SRC="/gresources/cleardot.gif" ALT="" WIDTH="1" HEIGHT="5" BORDER="0"><BR><font size="-2" face="arial, helvetica, sans-serif">As you order, each item will be listed in Your Shopping Cart in the upper right corner. You may make changes at Checkout.</FONT><P><A HREF="http://' + vc_webhost + '/help/nc_safe_shopping.asp?' + vc_slinkprefix + '"><FONT SIZE="2" COLOR="#003300"><B>Safe Shopping Guarantee!</B></FONT></A><BR><BR>';
var vc_button_xlon_hot				= '<IMG SRC="http://' + vc_imagehost + '/gresources/addtocart_xlx_hot.gif" WIDTH="119" HEIGHT="73" BORDER="0" ALT="This item has been added to your cart" VSPACE="3"><BR><IMG SRC="/gresources/cleardot.gif" ALT="" WIDTH="1" HEIGHT="9" BORDER="0"><BR><font size="-1" face="arial, helvetica, sans-serif"><B>Continue Browsing<BR>or<BR><A HREF="http://' + vc_shophost + '/shop/op.asp?step=fullCart&UIAction=editCart&' + vc_slinkprefix + '"><IMG SRC="http://' + vc_imagehost + '/gresources/vcart_checkout3.gif" WIDTH="126" HEIGHT="20" BORDER="0" ALT="Go To Checkout" VSPACE="7"></A></B></FONT><BR>';
var vc_button_xlon_cold				= '<font size="-1" face="arial, helvetica, sans-serif"><FONT COLOR="#003300"><B>Two Easy Ways to Buy!</B></FONT></FONT><BR><IMG SRC="/gresources/cleardot.gif" ALT="" WIDTH="1" HEIGHT="10" BORDER="0"><BR><FONT FACE="arial, helvetica, sans-serif" SIZE="-2"><INPUT TYPE="IMAGE" NAME="AddToCart" SRC="http://' + vc_imagehost + '/gresources/addtocart_lrg_cold.gif" WIDTH="102" HEIGHT="25" BORDER="0" ALT="Add to Cart" VSPACE="3"><BR><IMG SRC="/gresources/cleardot.gif" ALT="" WIDTH="1" HEIGHT="5" BORDER="0"><BR><font size="-2" face="arial, helvetica, sans-serif">As you order, each item will be listed in Your Shopping Cart in the upper right corner. You may make changes at Checkout.</FONT><BR><BR><FONT SIZE="-1"><B>OR</B><SUB>&nbsp;</SUB></FONT><BR><FONT FACE="verdana"><B>Buy now and send to:<BR>' + vc_xlname + '</B></FONT><BR><IMG SRC="/gresources/cleardot.gif" ALT="" WIDTH="1" HEIGHT="3" BORDER="0"><BR><INPUT TYPE="IMAGE" NAME="ExpressLane" SRC="http://' + vc_imagehost + '/gresources/b2_isbnxls.gif" WIDTH="147" HEIGHT="24" BORDER="0" VSPACE="2" ALT="Express Checkout"><SUB>&nbsp;</SUB><BR><IMG SRC="http://' + vc_imagehost + '/gresources/arrow_tinyred.gif" ALT="" WIDTH="4" HEIGHT="7" BORDER="0">&nbsp;<A HREF="http://' + vc_shophost + '/account/account_exp.asp?' + vc_slinkprefix + '">Change my settings</A><BR>';
var vc_button_preordsml_hot			= '<IMG SRC="http://' + vc_imagehost + '/gresources/addtocart_med_hot.gif" WIDTH="118" HEIGHT="13" BORDER="0" ALT="Item Added to Cart" VSPACE="3">';
var vc_button_preordsml_cold		= '<INPUT TYPE="IMAGE" NAME="AddToCart" SRC="http://' + vc_imagehost + '/gresources/addtocart_preordsml_cold.gif" WIDTH="96" HEIGHT="16" BORDER="0" ALT="Pre-Order Now" VSPACE="3">';
var vc_button_preordmed_hot			= '<IMG SRC="http://' + vc_imagehost + '/gresources/addtocart_lrg_hot.gif" WIDTH="120" HEIGHT="51" BORDER="0" ALT="Item Added to Cart" VSPACE="3">';
var vc_button_preordmed_cold		= '<INPUT TYPE="IMAGE" NAME="AddToCart" SRC="http://' + vc_imagehost + '/gresources/addtocart_preordlrg_cold.gif" WIDTH="109" HEIGHT="25" BORDER="0" ALT="Pre-Order Now" VSPACE="3">';
var vc_button_preordlrg_hot			= '<IMG SRC="http://' + vc_imagehost + '/gresources/addtocart_xlx_hot.gif" WIDTH="119" HEIGHT="73" BORDER="0" ALT="This item has been added to your cart" VSPACE="3"><BR><IMG SRC="/gresources/cleardot.gif" ALT="" WIDTH="1" HEIGHT="9" BORDER="0"><BR><font size="-1" face="arial, helvetica, sans-serif"><B>Continue Browsing<BR>or<BR><A HREF="http://' + vc_shophost + '/shop/op.asp?step=fullCart&UIAction=editCart&' + vc_slinkprefix + '"><IMG SRC="http://' + vc_imagehost + '/gresources/vcart_checkout3.gif" WIDTH="126" HEIGHT="20" BORDER="0" ALT="Go To Checkout" VSPACE="7"></A></B></FONT><BR>';
var vc_button_preordlrg_cold		= '<font size="-1" face="arial, helvetica, sans-serif"><FONT COLOR="#003300"><B>Buy it Now!</B></FONT></FONT><BR><IMG SRC="/gresources/cleardot.gif" ALT="" WIDTH="1" HEIGHT="10" BORDER="0"><BR><FONT FACE="arial, helvetica, sans-serif" SIZE="-2"><INPUT TYPE="IMAGE" NAME="AddToCart" SRC="http://' + vc_imagehost + '/gresources/addtocart_preordlrg_cold.gif" WIDTH="109" HEIGHT="25" BORDER="0" ALT="Preorder Now" VSPACE="3"><IMG SRC="/gresources/cleardot.gif" ALT="" WIDTH="1" HEIGHT="5" BORDER="0"><BR><font size="-2" face="arial, helvetica, sans-serif">As you order, each item will be listed in Your Shopping Cart in the upper right corner. You may make changes at Checkout.</FONT><P><A HREF="http://' + vc_webhost + '/help/nc_safe_shopping.asp?' + vc_slinkprefix + '"><FONT SIZE="2" COLOR="#003300"><B>Safe Shopping Guarantee!</B></FONT></A><BR><BR>';
var vc_button_preordlrg_xlon_hot	= '<IMG SRC="http://' + vc_imagehost + '/gresources/addtocart_xlx_hot.gif" WIDTH="119" HEIGHT="73" BORDER="0" ALT="This item has been added to your cart" VSPACE="3"><BR><IMG SRC="/gresources/cleardot.gif" ALT="" WIDTH="1" HEIGHT="9" BORDER="0"><BR><font size="-1" face="arial, helvetica, sans-serif"><B>Continue Browsing<BR>or<BR><A HREF="http://' + vc_shophost + '/shop/op.asp?step=fullCart&UIAction=editCart&' + vc_slinkprefix + '"><IMG SRC="http://' + vc_imagehost + '/gresources/vcart_checkout3.gif" WIDTH="126" HEIGHT="20" BORDER="0" ALT="Go To Checkout" VSPACE="7"></A></B></FONT><BR>';
var vc_button_preordlrg_xlon_cold	= '<font size="-1" face="arial, helvetica, sans-serif"><FONT COLOR="#003300"><B>Two Easy Ways to Buy!</B></FONT></FONT><BR><IMG SRC="/gresources/cleardot.gif" WIDTH="1" HEIGHT="10" BORDER="0" ALT=""><BR><FONT FACE="arial, helvetica, sans-serif" SIZE="-2"><INPUT TYPE="IMAGE" NAME="AddToCart" SRC="http://' + vc_imagehost + '/gresources/addtocart_preordlrg_cold.gif" WIDTH="109" HEIGHT="25" BORDER="0" ALT="Preorder Now" VSPACE="3"><BR><IMG SRC="/gresources/cleardot.gif" ALT="" WIDTH="1" HEIGHT="5" BORDER="0"><BR><font size="-2" face="arial, helvetica, sans-serif">As you order, each item will be listed in Your Shopping Cart in the upper right corner. You may make changes at Checkout.</FONT><BR><BR><FONT SIZE="-1"><B>OR</B><SUB>&nbsp;</SUB></FONT><BR><FONT FACE="verdana"><B>Buy now and send to:<BR>' + vc_xlname + '</B></FONT><BR><IMG SRC="/gresources/cleardot.gif" ALT="" WIDTH="1" HEIGHT="3" BORDER="0"><BR><INPUT TYPE="IMAGE" NAME="ExpressLane" SRC="http://' + vc_imagehost + '/gresources/b2_isbnxls.gif" WIDTH="147" HEIGHT="24" BORDER="0" VSPACE="2" ALT="Express Checkout"><SUB>&nbsp;</SUB><BR><IMG SRC="http://' + vc_imagehost + '/gresources/arrow_tinyred.gif" ALT="" WIDTH="4" HEIGHT="7" BORDER="0">&nbsp;<A HREF="http://' + vc_shophost + '/account/account_exp.asp?' + vc_slinkprefix + '">Change my settings</A><BR>';
var vc_button_preordlrg_xloff_hot	= '<IMG SRC="http://' + vc_imagehost + '/gresources/addtocart_xlx_hot.gif" WIDTH="119" HEIGHT="73" BORDER="0" ALT="Item Added to Cart" VSPACE="3"><BR><IMG SRC="/gresources/cleardot.gif" ALT="" WIDTH="1" HEIGHT="9" BORDER="0"><BR><font size="-1" face="arial, helvetica, sans-serif"><B>Continue Browsing<BR>or<BR><A HREF="http://' + vc_shophost + '/shop/op.asp?step=fullCart&UIAction=editCart&' + vc_slinkprefix + '"><IMG SRC="http://' + vc_imagehost + '/gresources/vcart_checkout3.gif" WIDTH="126" HEIGHT="20" BORDER="0" ALT="Go To Checkout" VSPACE="7"></A></B></FONT><BR>';
var vc_button_preordlrg_xloff_cold	= '<font size="-1" face="arial, helvetica, sans-serif"><FONT COLOR="#003300"><B>Buy it Now!</B></FONT></FONT><BR><IMG SRC="/gresources/cleardot.gif" ALT="" WIDTH="1" HEIGHT="10" BORDER="0"><BR><FONT FACE="arial, helvetica, sans-serif" SIZE="-2"><INPUT TYPE="IMAGE" NAME="AddToCart" SRC="http://' + vc_imagehost + '/gresources/addtocart_preordlrg_cold.gif" WIDTH="109" HEIGHT="25" BORDER="0" ALT="Preorder Now" VSPACE="3"><IMG SRC="/gresources/cleardot.gif" ALT="" WIDTH="1" HEIGHT="5" BORDER="0"><BR><font size="-2" face="arial, helvetica, sans-serif">As you order, each item will be listed in Your Shopping Cart in the upper right corner. You may make changes at Checkout.</FONT><P><A HREF="http://' + vc_webhost + '/help/nc_safe_shopping.asp?' + vc_slinkprefix + '"><FONT SIZE="2" COLOR="#003300"><B>Safe Shopping Guarantee!</B></FONT></A><BR><BR>';
var vc_button_search_hot			= '<A HREF="http://' + vc_shophost + '/shop/op.asp?step=fullCart&UIAction=editCart&' + vc_slinkprefix + '"><IMG SRC="http://' + vc_imagehost + '/pimages/gresources/product/bCheckout_s.gif" WIDTH="153" HEIGHT="22" VSPACE="3" BORDER="0" ALT="Proceed to Checkout"></A><BR><FONT FACE="Arial, Helvetica, Sans-Serif" SIZE="-1" COLOR="#AA0000"><B>This item is in your <A HREF="http://' + vc_shophost + '/shop/op.asp?step=fullCart&UIAction=editCart&' + vc_slinkprefix + '">Cart</A>.</B></FONT>';
var vc_button_search_cold			= '<INPUT TYPE="IMAGE" NAME="AddToCart" SRC="http://' + vc_imagehost + '/pimages/gresources/product/bAddtoCart_s.gif" WIDTH="101" HEIGHT="22" BORDER="0" ALT="Add to Cart">';
var vc_button_search_xlane_hot		= '<A HREF="http://' + vc_shophost + '/shop/op.asp?step=fullCart&UIAction=editCart&' + vc_slinkprefix + '"><IMG SRC="http://' + vc_imagehost + '/pimages/gresources/product/bCheckout_s.gif" WIDTH="153" HEIGHT="22" VSPACE="3" BORDER="0" ALT="Proceed to Checkout"></A><BR><FONT FACE="Arial, Helvetica, Sans-Serif" SIZE="-1" COLOR="#AA0000"><B>This item is in your <A HREF="http://' + vc_shophost + '/shop/op.asp?step=fullCart&UIAction=editCart&' + vc_slinkprefix + '">Cart</A>.</B></FONT>';
var vc_button_search_xlane_cold		= '<INPUT TYPE="IMAGE" NAME="AddToCart" SRC="http://' + vc_imagehost + '/pimages/gresources/product/bAddtoCart_s.gif" WIDTH="101" HEIGHT="22" VSPACE="1" BORDER="0" ALT="Add to Cart"><BR><INPUT TYPE="IMAGE" NAME="ExpressLane" SRC="http://' + vc_imagehost + '/pimages/gresources/product/bExpress_s.gif" WIDTH="140" HEIGHT="22" VSPACE="1" BORDER="0" ALT="Express Checkout"><BR><FONT SIZE="-2" FACE="Arial, Helvetica, Sans-Serif">Buy now and send to <FONT FACE="Verdana"><B>' + vc_xlname + '</B></FONT><BR>or <A HREF="http://' + vc_shophost + '/account/account_exp.asp?' + vc_slinkprefix + '">change my settings</A>';
var vc_button_search_preord_hot		= '<A HREF="http://' + vc_shophost + '/shop/op.asp?step=fullCart&UIAction=editCart&' + vc_slinkprefix + '"><IMG SRC="http://' + vc_imagehost + '/pimages/gresources/product/bCheckout_s.gif" WIDTH="153" HEIGHT="22" VSPACE="3" BORDER="0" ALT="Proceed to Checkout"></A><BR><FONT FACE="Arial, Helvetica, Sans-Serif" SIZE="-1" COLOR="#AA0000"><B>This item is in your <A HREF="http://' + vc_shophost + '/shop/op.asp?step=fullCart&UIAction=editCart&' + vc_slinkprefix + '">Cart</A>.</B></FONT>';
var vc_button_search_preord_cold	= '<INPUT TYPE="IMAGE" NAME="AddToCart" SRC="http://' + vc_imagehost + '/pimages/gresources/product/bPreorder_s.gif" WIDTH="119" HEIGHT="22" BORDER="0" ALT="Pre-Order Now">';
var vc_button_product_hot			= '<A HREF="http://' + vc_shophost + '/shop/op.asp?step=fullCart&UIAction=editCart&' + vc_slinkprefix + '"><IMG SRC="http://' + vc_imagehost + '/pimages/gresources/product/bCheckout_p.gif" WIDTH="178" HEIGHT="26" VSPACE="3" BORDER="0" ALT="Proceed to Checkout"></A><BR><FONT FACE="Arial, Helvetica, Sans-Serif" SIZE="-1" COLOR="#AA0000"><B>This item is in your <A HREF="http://' + vc_shophost + '/shop/op.asp?step=fullCart&UIAction=editCart&' + vc_slinkprefix + '">Cart</A>.</B></FONT>';
var vc_button_product_cold			= '<INPUT TYPE="IMAGE" NAME="AddToCart" SRC="http://' + vc_imagehost + '/pimages/gresources/product/bAddtoCart_p.gif" WIDTH="118" HEIGHT="26" BORDER="0" ALT="Add to Cart">';
var vc_button_product_xlane_hot		= '<A HREF="http://' + vc_shophost + '/shop/op.asp?step=fullCart&UIAction=editCart&' + vc_slinkprefix + '"><IMG SRC="http://' + vc_imagehost + '/pimages/gresources/product/bCheckout_p.gif" WIDTH="178" HEIGHT="26" VSPACE="3" BORDER="0" ALT="Proceed to Checkout"></A><BR><FONT FACE="Arial, Helvetica, Sans-Serif" SIZE="-1" COLOR="#AA0000"><B>This item is in your <A HREF="http://' + vc_shophost + '/shop/op.asp?step=fullCart&UIAction=editCart&' + vc_slinkprefix + '">Cart</A>.</B></FONT>';
var vc_button_product_xlane_cold	= '<INPUT TYPE="IMAGE" NAME="AddToCart" SRC="http://' + vc_imagehost + '/pimages/gresources/product/bAddtoCart_p.gif" WIDTH="118" HEIGHT="26" VSPACE="1" BORDER="0" ALT="Add to Cart"><BR><INPUT TYPE="IMAGE" NAME="ExpressLane" SRC="http://' + vc_imagehost + '/pimages/gresources/product/bExpress_p.gif" WIDTH="160" HEIGHT="26" VSPACE="1" BORDER="0" ALT="Express Checkout"><BR><FONT SIZE="-2" FACE="Arial, Helvetica, Sans-Serif">Buy now and send to <FONT FACE="Verdana"><B>' + vc_xlname + '</B></FONT><BR>or <A HREF="http://' + vc_shophost + '/account/account_exp.asp?' + vc_slinkprefix + '">change my settings</A>';
var vc_button_product_preord_hot	= '<A HREF="http://' + vc_shophost + '/shop/op.asp?step=fullCart&UIAction=editCart&' + vc_slinkprefix + '"><IMG SRC="http://' + vc_imagehost + '/pimages/gresources/product/bCheckout_p.gif" WIDTH="178" HEIGHT="26" VSPACE="3" BORDER="0" ALT="Proceed to Checkout"></A><BR><FONT FACE="Arial, Helvetica, Sans-Serif" SIZE="-1" COLOR="#AA0000"><B>This item is in your <A HREF="http://' + vc_shophost + '/shop/op.asp?step=fullCart&UIAction=editCart&' + vc_slinkprefix + '">Cart</A>.</B></FONT>';
var vc_button_product_preord_cold	= '<INPUT TYPE="IMAGE" NAME="AddToCart" SRC="http://' + vc_imagehost + '/pimages/gresources/product/bPreorder_p.gif" WIDTH="137" HEIGHT="26" BORDER="0" ALT="Pre-Order Now">';
var vc_button_new_hot				= '<IMG SRC="http://' + vc_imagehost + '/gresources/addtocart_med_hot.gif" WIDTH="118" HEIGHT="13" BORDER="0" ALT="Item Added to Cart" VSPACE="3">';
var vc_button_new_cold				= '<INPUT TYPE="IMAGE" NAME="AddToCart" SRC="http://' + vc_imagehost + '/pimages/gresources/product/tAddNewtoCart_s.gif" WIDTH="133" HEIGHT="22" BORDER="0" ALT="Add NEW To Cart" VSPACE="3">';
var vc_button_used_hot				= '<IMG SRC="http://' + vc_imagehost + '/gresources/addtocart_med_hot.gif" WIDTH="118" HEIGHT="13" BORDER="0" ALT="Item Added to Cart" VSPACE="3">';
var vc_button_used_cold				= '<INPUT TYPE="IMAGE" NAME="AddToCart" SRC="http://' + vc_imagehost + '/pimages/gresources/product/tAddUsedtoCart_s.gif" WIDTH="135" HEIGHT="22" BORDER="0" ALT="Add USED To Cart" VSPACE="3">';
var vc_button_sml_hot2				= '<IMG SRC="http://' + vc_imagehost + '/pimages/gresources/product/itemincart_6-03.gif" WIDTH="71" HEIGHT="19" BORDER="0" ALT="Item Added" VSPACE="3">';
var vc_button_sml_cold2				= '<INPUT TYPE="IMAGE" NAME="AddToCart" SRC="http://' + vc_imagehost + '/pimages/gresources/product/addtocart_6-03.gif" WIDTH="71" HEIGHT="19" BORDER="0" ALT="Add to Cart" VSPACE="3">';
var vc_button_preordsml_cold2		= '<INPUT TYPE="IMAGE" NAME="AddToCart" SRC="http://' + vc_imagehost + '/pimages/gresources/product/preorder_6-03.gif" WIDTH="71" HEIGHT="19" BORDER="0" ALT="Pre-Order" VSPACE="3">';
var vc_button_preordsml_hot2		= '<IMG SRC="http://' + vc_imagehost + '/pimages/gresources/product/itemincart_6-03.gif" WIDTH="71" HEIGHT="19" BORDER="0" ALT="Item Added" VSPACE="3">';
var vc_button_oopresult_cold		= '<INPUT TYPE="IMAGE" NAME="AddToCart" SRC="http://' + vc_imagehost + '/pimages/gresources/product/bAddToCart_oop.gif" WIDTH="89" HEIGHT="19" BORDER="0" ALT="Add to Cart">';
var vc_button_oopresult_hot			= '<A HREF="http://' + vc_shophost + '/shop/op.asp?step=fullCart&UIAction=editCart&' + vc_slinkprefix + '" CLASS="oopResultsSm"><B>Proceed to<BR>Checkout</B></A>';
var vc_button_proceedcheckout_hot	= '<A HREF="http://' + vc_shophost + '/shop/op.asp?step=fullCart&UIAction=editCart&' + vc_slinkprefix + '" CLASS="oopResultsSm"><IMG SRC="http://' + vc_imagehost + '/pimages/gresources/proceedtochkout.gif" WIDTH="119" HEIGHT="19" BORDER="0" ALT="Item Added" VSPACE="3"></A>';
var vc_button_proceedcheckout_cold	= '<INPUT TYPE="IMAGE" NAME="AddToCart" SRC="http://' + vc_imagehost + '/pimages/gresources/product/addtocart_6-03.gif" WIDTH="71" HEIGHT="19" BORDER="0" ALT="Add to Cart" VSPACE="3">';
var vc_button_univ_standard_cold	= '<INPUT TYPE="IMAGE" NAME="AddToCart" SRC="http://' + vc_imagehost + '/pimages/gresources/product/AddtoCart_btn.gif" WIDTH="83" HEIGHT="21" BORDER="0" ALT="Add to Cart" CLASS="CartGraphic">';
var vc_button_univ_standard_hot		= '<A HREF="http://' + vc_shophost + '/shop/op.asp?step=fullCart&UIAction=editCart&' + vc_slinkprefix + '" CLASS="oopResultsSm"><IMG SRC="http://' + vc_imagehost + '/pimages/gresources/product/ItemAddCart.gif" WIDTH="193" HEIGHT="42" BORDER="0" ALT="Item Added" CLASS="CartGraphicAdded"></A>';
var vc_button_univ_preorder_cold	= '<INPUT TYPE="IMAGE" NAME="AddToCart" SRC="http://' + vc_imagehost + '/pimages/gresources/product/Preorder_btn.gif" WIDTH="105" HEIGHT="21" BORDER="0" ALT="Preorder Now" CLASS="CartGraphic">';
var vc_button_univ_preorder_hot		= vc_button_univ_standard_hot

var vc_button_univ_cds2_cold = vc_button_univ_standard_cold	
	
var vc_button_univ_cds2_hot	= '<a href="http://' + vc_shophost + '/shop/op.asp?step=fullCart&UIAction=editCart&' + vc_slinkprefix + '"><img src="http://' + vc_imagehost + '/pimages/gresources/product/btn_ItemAdded.gif" width="128" height="27" border="0" alt="This item has been added to your cart."></a>';

var vc_buttontype_univ_cds2_preorder_cold = vc_button_univ_preorder_cold	

var vc_buttontype_univ_cds2_preorder_hot = vc_button_univ_cds2_hot

var vc_button_proceedcheckout_hot = '<A HREF="http://' + vc_shophost + '/shop/op.asp?step=fullCart&UIAction=editCart&' + vc_slinkprefix + '" CLASS="oopResultsSm"><IMG SRC="http://' + vc_imagehost + '/pimages/gresources/proceedtochkout.gif" WIDTH="119" HEIGHT="19" BORDER="0" ALT="Proceed to Checkout" VSPACE="3"></A>';
var vc_button_proceedcheckout_cold				= '<INPUT TYPE="IMAGE" NAME="AddToCart" SRC="http://' + vc_imagehost + '/pimages/gresources/product/addtocart_6-03.gif" WIDTH="71" HEIGHT="19" BORDER="0" ALT="Add to Cart" VSPACE="3">';

var vc_buttontype_univ_large_hot	= '<A HREF="http://' + vc_shophost + '/shop/op.asp?step=fullCart&UIAction=editCart&' + vc_slinkprefix + '" CLASS="oopResultsSm"><IMG SRC="http://' + vc_imagehost + '/pimages/gresources/product/ItemAdded_long.gif" WIDTH="230" HEIGHT="42" BORDER="0" ALT="Item Added" CLASS="CartGraphicAdded_Long"></A>';  

var vc_button_cairoused1_hot		= '<A HREF="http://' + vc_shophost + '/shop/op.asp?step=fullCart&UIAction=editCart&' + vc_slinkprefix + '" CLASS="oopResultsSm"><IMG SRC="http://' + vc_imagehost + '/pimages/gresources/product/itemincart_6-03.gif" WIDTH="71" HEIGHT="19" BORDER="0" ALT="Item Added" VSPACE="3"></A>';
var vc_button_cairoused1_cold		= '<INPUT TYPE="IMAGE" NAME="AddToCart" SRC="http://' + vc_imagehost + '/pimages/gresources/product/AddtoCart_btn.gif" WIDTH="83" HEIGHT="21" BORDER="0" ALT="Add to Cart">';

var vc_button_cairoused2_hot		= '<A HREF="http://' + vc_shophost + '/shop/op.asp?step=fullCart&UIAction=editCart&' + vc_slinkprefix + '" CLASS="oopResultsSm"><IMG SRC="http://' + vc_imagehost + '/pimages/gresources/product/itemincart_6-03.gif" WIDTH="71" HEIGHT="19" BORDER="0" ALT="Item Added" VSPACE="3"></A>';
var vc_button_cairoused2_cold		= '<INPUT TYPE="IMAGE" NAME="AddToCart" SRC="http://' + vc_imagehost + '/pimages/gresources/product/btn_addtocart_oop.gif" WIDTH="71" HEIGHT="21" BORDER="0" ALT="Add to Cart" VSPACE="3">';

var vc_button_addtocart_cold		= '<input type="image" name="AddToCart" src="http://' + vc_imagehost + '/pimages/gresources/product/btn_AddToCart.gif" width="83" height="21" border="0" alt="Add to Cart">';
var vc_button_addtocart_hot			= '<a href="http://' + vc_shophost + '/shop/op.asp?step=fullCart&UIAction=editCart&' + vc_slinkprefix + '"><img src="http://' + vc_imagehost + '/pimages/gresources/product/btn_ItemAdded.gif" width="128" height="27" border="0" alt="This item has been added to your cart."></a>';

var vc_button_preordernow_cold		= '<input type="image" name="AddToCart" src="http://' + vc_imagehost + '/pimages/gresources/product/btn_PreOrder.gif" width="105" height="21" border="0" alt="Preorder Now">';
var vc_button_preordernow_hot		= vc_button_addtocart_hot

var vc_button_univ06_cds2_cold = '<input type="image" name="AddToCart" src="http://' + vc_imagehost + '/pimages/gresources/product/AddtoCart_Dots3.gif" width="83" height="21" border="0" alt="Add to Cart">';

