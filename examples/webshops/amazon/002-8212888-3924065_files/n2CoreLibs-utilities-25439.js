//! ################################################################
//! This file contains both original and merged/adapted code .
//! Except where indicated, all code is 
//! Copyright (c) 2004 Amazon.com, Inc., and its Affiliates.
//! All Rights Reserved.
//! Not to be reused without permission
//! $Change: 948279 $
//! $Revision: #29 $
//! $DateTime: 2006/06/28 15:42:35 $
if ((typeof gbN2Loaded != 'undefined') && !goN2Initializer.isReady()) {
window.oTheDoc = document;
window.oTheBody = oTheDoc.body;
window.oTheHead = document.getElementsByTagName('head').item(0);
window.gaTD = {};
var goN2Dbg = window.goN2Debug;
goN2Initializer.runThisWhen = function (sWhen, fFn, sComment) {
if (goN2Dbg) {
;
;
}
if ( (typeof fFn != 'function') || fFn == null) return false;	
sWhen = sWhen.toLowerCase();
if ( (sWhen =='inbody' && document.body) || this.aEventsRun[sWhen] ){
fFn();
} else {
this.aHandlers[this.aHandlers.length] = { sWhen: sWhen, fFn: fFn, sComment: sComment };
}
return true
};
goN2Initializer.initializeThis = goN2Initializer.runThisWhen;
goN2Initializer.run = function (sWhen) {
sWhen = (typeof sWhen == 'undefined') ? null : sWhen;
sWhen = sWhen.toLowerCase();
this.aEventsRun[sWhen] = true;
if (goN2Dbg) { 
;//goN2Debug.info("N2Initializer called with " + (sWhen ? "'"+sWhen+"'" : "null"));
}
var aH = this.aHandlers;
var len = aH.length;
for (var i=0;i<len;i++) {
var oTmp = aH[i];
if ((oTmp.bCalled != true) &&
(oTmp.fFn) &&
( (sWhen == null) || (oTmp.sWhen && (oTmp.sWhen == sWhen)))
) {
if (goN2Dbg) {
;   
}
if (oTmp.fFn) {
oTmp.fFn();
} 
oTmp.bCalled = true;
}
}
}
function n2RunEvent(sWhen) {
goN2Initializer.run(sWhen);
}
goN2LibMon.bJSLoaded = false;
goN2LibMon.bCSSLoaded = false;
goN2LibMon.nREQUESTLOAD = -2;
goN2LibMon.nBEGINLOAD = -3;
goN2LibMon.requestLoad = function (sLibID, sFeatureID) {
var oTmp = this.aLibs[sLibID];
if (oTmp) { oTmp.nDuration= this.nREQUESTLOAD; }
};
goN2LibMon.beginLoad = function (sLibID, sFeatureID) {
var oTmp = this.aLibs[sLibID];
if (oTmp) { 
oTmp.sFeature = sFeatureID;
oTmp.nBegin = new Date().getTime();
oTmp.nDuration= this.nBEGINLOAD;
}
};
goN2LibMon.endLoad = function (sLibID, nStatus) {
var oTmp = this.aLibs[sLibID];
if (oTmp) { 
oTmp.nDuration = new Date().getTime() - oTmp.nBegin; 
oTmp.bLoaded=true;
}
var bALL=this.allLibsLoaded();
goN2Initializer.run(sLibID+'loaded');
if (bALL) {
gbN2Loaded = this.bJSLoaded = true;
goN2Initializer.run('lastlibraryloaded');
}
};
goN2LibMon.allLibsLoaded = function () {
var bAllLoaded=true;
for (var key in this.aLibs) {
if (this.aLibs[key] && this.aLibs[key].nDuration <0) { bAllLoaded=false; }
}
return bAllLoaded;
};
goN2LibMon.confirmJSLoaded = goN2LibMon.isJSLoaded = function() { return this.bJSLoaded; };
goN2LibMon.confirmCSSLoaded = goN2LibMon.isCSSLoaded = function() { return true; };
function n2LibraryIsLoaded (sLibID) {
var oTmp = goN2LibMon.aLibs[sLibID];
if (oTmp) 
return oTmp.bLoaded;
return false;
}
goN2Initializer.isReady = function() {return true;}
n2RunEvent('n2Loader:safetyNet:loaded')
}
if (window.goN2LibMon) goN2LibMon.beginLoad('utilities', 'n2CoreLibs');
function N2Utilities() {
this.className = 'N2Utilities';
this.version = '1.0.1';
this.revision= '$Revision: #29 $';
this.initialized = false;
this.bIsCSS;
this.bIsW3C;
this.bIsIE4;
this.bIsNN4;
this.bIsIE6CSS;
this.bIsIE;
this.bIsSafari;
this.browser_version;
//! * **********************************************************************
//! The following section of this file code was mainly adapted from: 
//! "Dynamic HTML:The Definitive Reference"
//! 2nd Edition
//! by Danny Goodman
//! Published by O'Reilly & Associates  ISBN 1-56592-494-0
//! http://www.oreilly.com
//! http://www.amazon.com/exec/obidos/tg/detail/-/0596003161/qid=1049505315
//! Copyright 2002 Danny Goodman.  All Rights Reserved.
//! Some minor changes and additions have been made to suit the 
//! current application requirements and to enhance functionality.
//! ************************************************************************ 
this.initDHTMLAPI = function () {
if (document.images) {
this.bIsCSS = (document.body && document.body.style) ? true : false;
this.bIsW3C = (this.bIsCSS && document.getElementById) ? true : false;
this.bIsIE4 = (this.bIsCSS && document.all) ? true : false;
this.bIsNN4 = (document.layers) ? true : false;
this.bIsIE6CSS = (document.compatMode && document.compatMode.indexOf("CSS1") >= 0) ? true : false;
this.bIsSafari = (navigator.userAgent.indexOf("AppleWebKit") > -1) ? true : false;
}
}
this.seekLayer = function (oDoc, sName) {
var elem;
for (var i = 0; i < oDoc.layers.length; i++) {
if (oDoc.layers[i].name == sName) {
elem = oDoc.layers[i];
break;
}
if (oDoc.layers[i].document.layers.length > 0) {
elem = this.seekLayer(document.layers[i].document, sName);
}
}
return elem;
}
this.getRawObject = function (obj) {
;
}
this._getRawObject = function (obj, bFailureOK) {
var elem;
;
if (!obj) {
return null;
}
if (typeof obj == "string") {
if (this.bIsW3C) {
elem = document.getElementById(obj);
} else if (this.bIsIE4) {
elem = document.all(obj);
} else if (this.bIsNN4) {
elem = this.seekLayer(document, obj);
}
if ( this.isUndefOrNull(elem) && !bFailureOK ) {
;
}		
} else {
elem = obj;
}
return elem;
}
this.getObject = function (obj) {
var elem = this.getElement(obj);
if (elem && this.bIsCSS) {
elem = elem.style;
}
return elem;
}
this.shiftTo = function (obj, x, y) {
var oStyle = this.getElementStyle(obj);
if (oStyle) {
if (this.bIsCSS) {
var units = (typeof oStyle.left == "string") ? "px" : 0; 
oStyle.left = x + units;
oStyle.top = y + units;
} else if (this.bIsNN4) {
oStyle.moveTo(x,y)
}
}
}
this.shiftBy = function (obj, deltaX, deltaY) {
var oStyle = this.getElementStyle(obj);
if (oStyle) {
if (this.bIsCSS) {
var units = (typeof oStyle.left == "string") ? "px" : 0; 
oStyle.left = this.getElementLeft(obj) + deltaX + units;
oStyle.top = this.getElementTop(obj) + deltaY + units;
} else if (this.bIsNN4) {
oStyle.moveBy(deltaX, deltaY);
}
}
}
this.setZIndex = function (obj, zOrder) {
var oStyle = this.getElementStyle(obj);
if (oStyle) {	oStyle.zIndex = zOrder; }
}
this.setBGColor = function (obj, color) {
var oStyle = this.getElementStyle(obj);
if (oStyle) {
if (this.bIsNN4) {
oStyle.bgColor = color;
} else if (this.bIsCSS) {
oStyle.backgroundColor = color;
}
}
}
this.show = function (obj) {
var oStyle = this.getElementStyle(obj);
if (oStyle) {	oStyle.visibility = "visible"; }
}
this.hide = function (obj) {
var oStyle = this.getElementStyle(obj);
if (oStyle) {	oStyle.visibility = "hidden";	} 
}
this.MOZALPHAMAX = 255./256.;
this.getAlphaLevel = function (elem) {
var oElem = this.getElement(elem);
var ret;
if (oElem) {
var style = oElem.style;
if (oElem.filters && oElem.filters.alpha) {
ret = oElem.filters.alpha.opacity;
} else if (style) {
if (this.isDefined(style.MozOpacity)) {
var strOpacity = style.MozOpacity;
if (strOpacity.length > 0) {
ret = parseFloat(style.MozOpacity);
if (ret >= this.MOZALPHAMAX && this.isDefined(style.azdMozOpacity)) {
var saved = parseFloat(style.azdMozOpacity);
if (saved >= this.MOZALPHAMAX) {
ret = saved;
}
}
ret = ret * 100;
}
} else if (this.isDefined(style.opacity)) {
ret = (style.opacity.length==0 ? 1 : parseFloat(style.opacity)) * 100;
} else if (this.isDefined(style.KhtmlOpacity)) {
ret = (style.KhtmlOpacity.length==0 ? 1 : parseFloat(style.KhtmlOpacity)) * 100;
}
}
}
if (this.isUndefined(ret)) {
ret = 100; // presume that no set opacity means opaque
;
}
return ret;
}
this.setAlphaLevel = function (elem, level) {
level = (level <= 0 ? 0 : (level >= 100 ? 100 : level));
var oElem = this.getElement(elem);
;
if (oElem) {
var style = oElem.style
if (oElem.filters) {
var filters = oElem.filters;
if (!filters.alpha) {
;
this.addClass(oElem, "n2Fadable");
filters = oElem.filters; // object changed by adding a filter
;
}
if (filters.alpha) {
filters.alpha.opacity = level;
} else {
; 
}
} else  if (style && this.isDefined(style.MozOpacity)) {
var reqLevel = level * 0.01;
var mozLevel = (reqLevel > this.MOZALPHAMAX ? this.MOZALPHAMAX : reqLevel);
if (mozLevel != reqLevel) {
;
}
style.MozOpacity = mozLevel;
style.azdMozOpacity = "" + reqLevel; // store as string (just as MozOpacity is) to get same rounding
} else if (style && this.isDefined(style.opacity)) {
var reqLevel = "" + (level * 0.01);
style.opacity = reqLevel;
} else if (style && this.isDefined(style.KhtmlOpacity)) {
var reqLevel = "" + (level * 0.01);
ret = (style.KhtmlOpacity.length==0 ? 1 : parseFloat(style.KhtmlOpacity)) * 100;
} else {
;
}
} 
}
this.getElementLeft = function (obj)  {
var oElem = this.getElement(obj);
var result = 0;
if (oElem) {
var cssDecl, defaultView = document.defaultView;
if (defaultView && 
(typeof defaultView.getComputedStyle == 'function') && 
(cssDecl=defaultView.getComputedStyle(oElem, null)) 
) {
result = cssDecl.getPropertyValue("left");
} else if (oElem.currentStyle) {
result = oElem.currentStyle.left;
} else if (oElem.style) {
result = oElem.style.left;
} else if (this.bIsNN4) {
result = oElem.left;
}
result = parseInt(result);
if (isNaN(result)) {
result = this.getPageElementLeft(oElem);
}
}
return result;
}
this.getElementTop = function (obj)  {
var oElem = this.getElement(obj);
var result = 0;
if (oElem) {
var cssDecl, defaultView = document.defaultView;
if (defaultView && 
(typeof defaultView.getComputedStyle == 'function') && 
(cssDecl=defaultView.getComputedStyle(oElem, null)) 
) {
result = cssDecl.getPropertyValue("top");
} else if (oElem.currentStyle) {
result = oElem.currentStyle.top;
} else if (oElem.style) {
result = oElem.style.top;
} else if (this.bIsNN4) {
result = oElem.top;
}
}
result = parseInt(result); 
if (isNaN(result)) {
result = this.getPageElementTop(oElem);
}
return result;
}
this.getElementWidth = function (obj)  {
var oElem = this.getElement(obj);
var result = 0;
if (oElem) {
if (oElem.width && this.isMozilla5()) {
result = oElem.width;
} else if (oElem.offsetWidth) {
result = oElem.offsetWidth;
} else if (oElem.clip && oElem.clip.width) {
result = oElem.clip.width;
} else if (oElem.style && oElem.style.pixelWidth) {
result = oElem.style.pixelWidth;
}
}
return parseInt(result);
}
this.getElementHeight = function (obj)  {
var oElem = this.getElement(obj);
var result = 0;
if (oElem) {
if (oElem.height && this.isMozilla5()) {
result = oElem.height;
} else if (oElem.offsetHeight) {
result = oElem.offsetHeight;
} else if (oElem.clip && oElem.clip.height) {
result = oElem.clip.height;
} else if (oElem.style && oElem.style.pixelHeight) {
result = oElem.style.pixelHeight;
}
}
return parseInt(result);
}
this.getInsideWindowWidth = function () {
if (window.innerWidth) {
return window.innerWidth;
} else if (document.body && document.body.clientWidth) {
return document.body.clientWidth;
}
;
return 0;
}
this.getInsideWindowHeight = function () {
if (window.innerHeight) {
return window.innerHeight;
} else if (document.body && document.body.clientHeight) {
return document.body.clientHeight;
}
;
return 0;
}
//! ************************************************************
//! 	END CODE derived from "Dynamic HTML:The Definitive Reference"
//! 	2nd Edition
//! 	by Danny Goodman
//! 	Published by O'Reilly & Associates  ISBN 1-56592-494-0
//! 	http://www.oreilly.com
//! 	Copyright 2002 Danny Goodman.  All Rights Reserved. 
//! ################################################################
//! All the code that follows is Copyright 2003 Amazon.com.
//! All Rights Reserved.
//! ************************************************************ 
//! Copyright (c) Amazon.com 2003, 2004.  All Rights Reserved.
//! Not to be reused without permission
//! ################################################################
this.initialize = function () {
this.initDHTMLAPI();
var agid = navigator.userAgent.toLowerCase();
this.bIsIE = (agid.indexOf("msie") != -1);
this.bIsGecko = (agid.indexOf("gecko") != -1);
this.bIsFirefox = (agid.indexOf("firefox") != -1);
this.browser_version = parseInt(navigator.appVersion);
this.getRawObject = this._getRawObject;	// rest to use the correct fn.
this.getElement = this._getRawObject;
this.getElementStyle = this.getObject;
this.getObjectWidth  = this.getElementWidth;
this.getObjectHeight = this.getElementHeight;
this.getObjectLeft   = this.getElementLeft;
this.getObjectTop    = this.getElementTop;
this.sAnimationDivID = 'goN2UAnimatedBox'; //WARNING: events.js uses goN2U.sAnimationDivID
this.bAnimateBoxRunning = false;
this.initialized = true;
;
}
this.isIE = function () { return this.bIsIE; }
this.isW3C = function () { return this.bIsW3C; }
this.isMozilla5 = function () { return this.bIsGecko && this.browser_version>=5 && !this.bIsSafari; }
this.isFirefox = function () { return this.bIsFirefox && this.browser_version>=5; }
this.isSafari = function () { return this.bIsSafari; }
this.exists = function(obj) {
return ( !this.isUndefOrNull(this.getElement(obj)) );
}
this.display = function (obj, type) {
var oStyle = this.getElementStyle(obj);
if (oStyle) {
if(this.bIsIE || this.isMozilla5())
oStyle.display = this.isDefined(type) ? type : "block";
else {
oStyle.display = "block";
}
}
}
this.undisplay = function (obj) {
var oStyle = this.getElementStyle(obj);
if (oStyle) {
oStyle.display = 'none';
} 
}
this.isDisplayed = function(obj) {
var oStyle = this.getElementStyle(obj);
if (oStyle) {
return oStyle.display != 'none';
}
return true;
}
this.toggleDisplay = function (obj, type) {
var oStyle = this.getElementStyle(obj);
if (oStyle) {
if (oStyle.display == 'none')
this.display (obj, type);
else 
this.undisplay(obj);
}
}
this.toggleDualDisplay = function (obj1, obj2) {
this.toggleDisplay(obj1);
this.toggleDisplay(obj2);
}
this.getScrollLeft = function() {
if (document.documentElement.scrollLeft) {
return  document.documentElement.scrollLeft;
} else {
return  document.body.scrollLeft;
}
}
this.getScrollTop = function() {
if (document.documentElement.scrollTop) {
return document.documentElement.scrollTop;
} else {
return document.body.scrollTop;
}
}
this.setScrollLeft = function(n) {
if (document.documentElement.scrollLeft) {
document.documentElement.scrollLeft = n;
} else {
document.body.scrollLeft = n;
}
}
this.setScrollTop = function(n) {
if (document.documentElement.scrollTop) {
document.documentElement.scrollTop=n;
} else {
document.body.scrollTop=n;
}
}
this.animateScrollTo = function(nTo, nStep, nDelay, nStepInc) {
var nTop = goN2U.getScrollTop();
nStepInc = this.isDefined(nStepInc) ? nStepInc : 20;
nStep = nStep ? nStep+=nStepInc : 20;
nDelay = nDelay ? nDelay : 25;
if (nTop > nTo) {
if (nTop > nTo+(nStep*1.5)) {
goN2U.setScrollTop(nTop-nStep);
setTimeout(function() { goN2U.animateScrollTo(nTo, nStep, nDelay, nStepInc); }, nDelay);
} else {
goN2U.setScrollTop(nTo);
}
} else {
if (nTop < nTo-(nStep*1.5)) {
goN2U.setScrollTop(nTop+nStep);
setTimeout(function() { goN2U.animateScrollTo(nTo, nStep, nDelay, nStepInc); }, nDelay);
} else {
goN2U.setScrollTop(nTo);
}
}
}
this.removeElementById = function(sID) {
var oElem = document.getElementById(sID);
if (oElem && oElem.parentNode && oElem.parentNode.removeChild) {
try {
oElem.parentNode.removeChild(oElem); 
;
} catch (e) {
;
}
} else {
;
}
}
this.adjustBy = function (obj, deltaX, deltaY, deltaW, deltaH) {
var oStyle = this.getElementStyle(obj);
if (oStyle) {
if (this.bIsCSS) {
var units = (typeof oStyle.left == "string") ? "px" : 0; 
oStyle.left = this.getElementLeft(obj) + deltaX + units;
oStyle.top = this.getElementTop(obj) + deltaY + units;
oStyle.width = this.getElementWidth(obj) + deltaW; // + units;
oStyle.height = this.getElementHeight(obj) + deltaH; // + units;
} else if (this.bIsNN4) {
oStyle.moveBy(deltaX, deltaY);
}
}
}
this.clip = function (obj, nTop, nRight, nBottom, nLeft) {
var oStyle = this.getElementStyle(obj);
oStyle.clip = "rect("+nTop+"px, " + nRight + "px, "+nBottom+"px, "+nLeft+"px)";		
}
this.setContent = function (sID, sHtml, sClass) {
var relem = this.getElement(sID);
if (relem) relem.innerHTML = sHtml;
if (sClass) this.setClass(sID, sClass);
}
this.setWidth = function (obj, n) {
var oStyle = this.getElementStyle(obj);
if (oStyle) {
if ((typeof oStyle.width == "string") && (typeof n == "number")) {
oStyle.width=n+"px";
} else {
oStyle.width = n;
}
}
}
this.setHeight = function (obj, n) {
var oStyle = this.getElementStyle(obj);
if (oStyle) {
if ((typeof oStyle.height == "string") && (typeof n == "number")) {
oStyle.height=n+"px";
} else {
oStyle.height = n;
}
}
}
this.getScrolledElementTop = function (elem) {
var top = this.getPageElementTop(elem);
if (elem) {
var bod = document.body;
var docParent = this.getParentElement(elem);
while (docParent !== null && docParent !== bod) {
top -= docParent.scrollTop;
docParent = this.getParentElement(docParent);
}                                      
}
return top;                           
}
this.getScrolledElementLeft = function (elem)	{
var left = this.getPageElementLeft(elem);
if (elem) {
var bod = document.body;
var docParent = this.getParentElement(elem);
while (docParent !== null && docParent !== bod) {
left -= docParent.scrollLeft;
docParent = this.getParentElement(docParent);
}                                      
}
return left;
}
this.getPageElementTop = function (elem) {
var top=0;
if (elem) {
top = elem.offsetTop;         
var parentObj = elem.offsetParent;  
while (parentObj != null) {
if(this.bIsIE) {
if( (parentObj.tagName != "TABLE") && (parentObj.tagName != "BODY") ) 
top += parentObj.clientTop; 
}
else {
if(parentObj.tagName == "TABLE") {
var nParBorder = parseInt(parentObj.border);
if(isNaN(nParBorder)) { 
var nParFrame = parentObj.getAttribute('frame');
if(nParFrame != null)
top += 1;
} else if(nParBorder > 0) {
top += nParBorder;        
}
}
}
top += parentObj.offsetTop;      
parentObj = parentObj.offsetParent; 
}                                      
}
return top;                           
}
this.getPageElementLeft = function (elem)	{
var left=0;
if (elem) {
left = elem.offsetLeft;         
var parentObj = elem.offsetParent;  
while (parentObj != null) {
if(this.bIsIE) {
if( (parentObj.tagName != "TABLE") && (parentObj.tagName != "BODY") ) 
left += parentObj.clientLeft; 
}
else {
if(parentObj.tagName == "TABLE") {
var nParBorder = parseInt(parentObj.border);
if(isNaN(nParBorder)) { 
var nParFrame = parentObj.getAttribute('frame');
if(nParFrame != null)
left += 1;
} else if(nParBorder > 0) {
top += nParBorder;        
}
}
}
left += parentObj.offsetLeft;      
parentObj = parentObj.offsetParent; 
}                                      
}
return left;
}
this.getParentElement = function (elem) {
if (elem) {
if(this.bIsIE) return elem.parentElement;
return elem.parentNode; 
}
return null;
}
this.elementIsContainedBy = function(elem, elemParent) {
if (this.isUndefOrNull(elem) || this.isUndefOrNull(elemParent)) {
return false;
}
while (true) {
if (elem === elemParent) {
return true;
}
var parent = this.getParentElement(elem);
if (parent === null) {
return false;
}
elem = parent;
}
}
this.classfixup;
if (document.all) this.classfixup = "className";
else this.classfixup = "class";
this.setClass = function (obj, style) {
var obj = this.getElement (obj);
;
if (obj) obj.setAttribute(this.classfixup, style,0);
}
this.getClassX = function (obj) {
var obj = this.getElement (obj);
if (obj) return obj.getAttribute(this.classfixup, 0);
return null;
}
this.addComma = function addComma(sNum) {
if (typeof sNum != "string") sNum = sNum.toString();
var aV = sNum.split('.');
sNum = aV[0];
var p0, p1, len, x=3;
if (sNum.length >x) {
for (x=3;(len=sNum.length)>x;x+=4 ) {
p0 = sNum.substring(0, len-x);
p1 = sNum.substring(len-x);
sNum = p0 +',' + p1;
}
}
if (aV[1]>=0)	sNum += '.' + aV[1];
return sNum;
}
this.preloadImages = new Array();
this.preloadImage = function (sImage, id) {
if (!id) id=this.preloadImages.length;
if (!this.preloadImages[id]) {
this.preloadImages[id]=new Image();
this.preloadImages[id].src=sImage;
;
}
}
this.getLinkNameInfo = function (sLinkID, sNameOverride) {
var oLNI = new N2LinkNameInfo(sLinkID, sNameOverride);
return (oLNI.getLinkID() ? oLNI : null);
}	
this.getIFrameDocument = function (id) {
var oIFrame = this.getElement(id);
if (oIFrame) {
if (oIFrame.contentDocument) {
return oIFrame.contentDocument; 
} else if (oIFrame.contentWindow) {
return oIFrame.contentWindow.document;
} else if (oIFrame.document) {
return oIFrame.document;
}
;
return null;
}
;
return null;
}
this.getIFrameWindow = function (id) {
var oIFrame = this.getElement(id);
if (oIFrame) {
if (oIFrame.contentWindow) {
return oIFrame.contentWindow;
}
;
return null;
}
;
return null;
}
this.n2FlashElement = function (id, styleOn, styleOff, count) {
n2DoFlashElement (id, styleOn, styleOff, count*2); 
}
this.n2DoFlashElement = function (id, styleOn, styleOrig, count) {
count--;
if (count % 2)
setClass(id, styleOn);
else
setClass(id, styleOrig);
if (count) {
setTimeout("n2DoFlashElement('" + id +"','" + styleOn + "','" + styleOrig + "'," + count +")", 500);
}
} 
this.animateBox = function (sl, st, sw, sh, fl, ft, fw, fh, nSteps, fnDone, style) {
var nHInc = parseInt((fl -sl)/nSteps);
var nVInc = parseInt((ft -st)/nSteps);
var nWdInc = parseInt((fw-sw)/nSteps);
var nHtInc = parseInt((fh-sh)/nSteps);
var o = goN2U.getElement(this.sAnimationDivID);
if (o && !this.bAnimateBoxRunning) {
this.bAnimateBoxRunning = true;
if (style) goN2U.setClass(this.sAnimationDivID, style);
goN2U.shiftTo(o, sl, st);
goN2U.show(o);
goN2U.setWidth(o, sw);
goN2U.setHeight(o, sh);
var fn = function() { goN2U._animateBox(goN2U.sAnimationDivID, nHInc, nVInc, nWdInc, nHtInc, nSteps, fnDone); };
setTimeout(fn, 25);
} else if (fnDone) {
fnDone();
}
}
this._animateBox = function (sID, nHInc, nVInc, nWdInc, nHtInc, nSteps, fnDone) {
goN2U.adjustBy(sID, nHInc, nVInc, nWdInc, nHtInc);
if (--nSteps >0) {
var fn = function() { goN2U._animateBox(sID, nHInc, nVInc, nWdInc, nHtInc, nSteps, fnDone); };
setTimeout(fn, 25);
} else {
goN2U.hide(sID);
if (fnDone) fnDone();
this.bAnimateBoxRunning = false;
}
}
this.expDivProcessing = false;
this.expDivSize = 30;
this.stepDone = true;
this.toggleDivHeight = function (theDiv, hidableElem, delay, fnDone, displayableElem){
var oParent = this.getElement(theDiv).parentNode;
if (oParent.style.display != "none")
this.collapseDivDual('h', theDiv, hidableElem, delay, fnDone, displayableElem);
else
this.expandDivDual('h', theDiv, hidableElem, delay, fnDone, displayableElem);
}
this.toggleDivWidth = function (theDiv, hidableElem, delay, fnDone, displayableElem){
var oParent = this.getElement(theDiv).parentNode;
if (oParent.style.display != "none")
this.collapseDivDual('w', theDiv, hidableElem, delay, fnDone, displayableElem);
else
this.expandDivDual('w', theDiv, hidableElem, delay, fnDone, displayableElem);
}
this.expandDivWidth = function (theDiv, hidableElem, delay, fnDone, displayableElem, bImmediate){
this.expandDivDual('w', theDiv, hidableElem, delay, fnDone, displayableElem, bImmediate);
}
this.expandDivHeight = function (theDiv, hidableElem, delay, fnDone, displayableElem, bImmediate){
this.expandDivDual('h', theDiv, hidableElem, delay, fnDone, displayableElem, bImmediate);
}
this.collapseDivWidth = function (theDiv, hidableElem, delay, fnDone, displayableElem, bImmediate){
this.collapseDivDual('w', theDiv, hidableElem, delay, fnDone, displayableElem, bImmediate);
}
this.collapseDivHeight = function (theDiv, hidableElem, delay, fnDone, displayableElem, bImmediate){
this.collapseDivDual('h', theDiv, hidableElem, delay, fnDone, displayableElem, bImmediate);
}
this.collapseExpandDivsWidth = function (divA, divB, delay){
this.collapseExpandDivsDual ('w', divA, divB, delay);
}
this.collapseExpandDivsHeight = function (divA, divB, delay){
this.collapseExpandDivsDual ('h', divA, divB, delay);
}
this.expandCalcStep = function (h) {
if (h <40) return h/2;
if (h <225) return 20;	//15
if (h <900) return parseInt(h/10); // h/15
return 100;	// 60
}
this.expandDivDual = function (mode, theDiv, hidableElem, delay, fnDone, displayableElem, bImmediate){
if (this.expDivProcessing) return;
this.expDivProcessing = true;
var theDivObj = this.getElement(theDiv);
var parentDiv = theDivObj.parentNode;
if (!parentDiv.id) { parentDiv.id = 'outer_' + theDivObj.id; }
this.expDivSize=0;
var maxSize;
if (mode == 'w' ) {
this.setWidth(parentDiv, this.expDivSize);
this.display(parentDiv);
maxSize = this.getElementWidth(theDivObj);
} else {
this.setHeight(parentDiv, this.expDivSize);
this.display(parentDiv);
maxSize = this.getElementHeight(theDivObj);
}
if (hidableElem) this.undisplay(hidableElem);
if (displayableElem) { this.display(displayableElem); }
if (bImmediate) {
this._expandDualFinal(mode, parentDiv, fnDone);
} else {
if (!delay || delay<20) { delay = 20; }
var step = 4;
this._expandDual(mode, parentDiv.id, maxSize, delay, step, fnDone, displayableElem);
}
}
this._expandDual = function (mode, parentDiv, maxSize, delay, step, fnDone, displayableElem){
if(this.expDivSize<maxSize) {
var nS = this.expDivSize;
if(nS>20){ step = this.expandCalcStep(maxSize); }
else if(nS>8) { step = 10; }
this.expDivSize = Math.min(this.expDivSize+=step, maxSize);
mode == 'w' ? this.setWidth(parentDiv, this.expDivSize) : this.setHeight(parentDiv, this.expDivSize);
setTimeout("goN2U._expandDual('"+mode+"','"+parentDiv+"',"+maxSize+","+delay+","+step+","+fnDone+",'"+displayableElem+"');",delay );
} else{
this._expandDualFinal(mode, parentDiv, fnDone);
}
}
this._expandDualFinal = function (mode, parentDiv, fnDone){
mode == 'w' ? this.setWidth(parentDiv, "auto") : this.setHeight(parentDiv, "auto");
this.expDivSize = 20;
this.expDivProcessing = false;
if(fnDone) fnDone();
}
this.collapseDivDual = function (mode, theDiv, hidableElem, delay, fnDone, displayableElem, bImmediate){
if (this.expDivProcessing) return;
this.expDivProcessing = true;
var theDivObj = this.getElement(theDiv);
var parentDiv = theDivObj.parentNode;
if (!parentDiv.id) { parentDiv.id = 'outer_' + theDivObj.id; }
if (!delay || delay<20) { delay = 20; }
this.expDivSize=0;
var size = (mode == 'w' ? this.getElementWidth(parentDiv) : this.getElementHeight(parentDiv));
var step = this.expandCalcStep(size);
if (hidableElem) this.undisplay(hidableElem);
var end = 0;
if(displayableElem) {
this.display(displayableElem,"inline");
end = (mode == 'w' ? this.getElementWidth(displayableElem) : this.getElementHeight(displayableElem));
this.undisplay(displayableElem);
}
if (bImmediate) {
this._collapseDualFinal(mode, parentDiv, hidableElem, fnDone, displayableElem);
} else {
this._collapseDual(mode, parentDiv.id, hidableElem, delay, step, fnDone, displayableElem, end)
}
}
this._collapseDual = function (mode, parentDiv, hidableElem, delay, step, fnDone, displayableElem, end){
this.expDivSize = (mode == 'w' ? this.getElementWidth(parentDiv) : this.getElementHeight(parentDiv));
var nRem = this.expDivSize-end;
if(nRem>0){
if(nRem<6){ step = 2; }
else if(nRem<11){ step = 4; }
else if(nRem<60){ step = 10; }
this.expDivSize -= step;
if (this.expDivSize <end) {
this.expDivSize = end;
}
mode == 'w' ? this.setWidth(parentDiv, this.expDivSize) : this.setHeight(parentDiv, this.expDivSize);
if (this.expDivSize>end) {
setTimeout("goN2U._collapseDual('"+mode+"','"+parentDiv+"','"+hidableElem+"',"+delay+","+step+","+fnDone+",'"+displayableElem+"',"+end+");",delay );
} else {
this._collapseDualFinal(mode, parentDiv, hidableElem, fnDone, displayableElem);
}
} else {
this._collapseDualFinal(mode, parentDiv, hidableElem, fnDone, displayableElem);
}
}
this._collapseDualFinal = function (mode, parentDiv, hidableElem, fnDone, displayableElem){
this.undisplay(parentDiv);
this.expDivProcessing = false;
if(displayableElem) this.display(displayableElem,"inline");
if(fnDone) fnDone();
}
this.getConfigurationObject = function(sID) {
var sClassName = 'go' + sID + 'Properties';
var obj;
if((typeof window[sClassName] != 'undefined') &&  (typeof window[sClassName] == 'object')) {
obj = window[sClassName];
} else {
obj = new Object;
}
obj.getValue = this._defaultConfigObjectGetValue;
obj.__sJSFID = sClassName;
return obj;
}
this._defaultConfigObjectGetValue = function(sID, sDefault) {
if (typeof this[sID] != 'undefined') {
return this[sID]; 
}
return sDefault;
}
this.collapseExpandDivsDual = function (mode, divA, divB, delay){
if (this.expDivProcessing) return;
this.expDivProcessing = true;
var divAObj = this.getElement(divA);
var divBObj = this.getElement(divB);
var divAParent = divAObj.parentNode;
var divBParent = divBObj.parentNode;
if (!divAParent.id) { divAParent.id = 'outer_' + divAObj.id; }
if (!divBParent.id) { divBParent.id = 'outer_' + divBObj.id; }
if (!delay || delay<20) { delay = 20; }
var size = (mode == 'w' ? this.getElementWidth(divAParent) : this.getElementHeight(divAParent));
var step = this.expandCalcStep(size);
this._comboCollapseDual(mode, divAParent.id, divBParent.id, delay, step);
}
this._comboCollapseDual = function (mode, divAParent, divBParent, delay, step){
this.expDivSize = (mode == 'w' ? this.getElementWidth(divAParent) : this.getElementHeight(divAParent));
if(this.expDivSize>step){
this.expDivSize-=step;
mode == 'w' ? this.setWidth(divAParent, this.expDivSize) :this.setHeight(divAParent, this.expDivSize); 
setTimeout("goN2U._comboCollapseDual('"+mode+"','"+divAParent+"','"+divBParent+"',"+delay+","+step+");", delay );
} else {
this.undisplay(divAParent);
this.display(divBParent);
this.setWidth(divBParent,"auto");
mode == 'w' ?  this.setWidth(divBParent,"auto") :this.setHeight(divBParent,"auto"); 
var maxSize = (mode == 'w' ? this.getElementWidth(divBParent) : this.getElementHeight(divBParent));
this.expDivSize = step;
mode == 'w' ?  this.setWidth(divBParent,this.expDivSize) :this.setHeight(divBParent,this.expDivSize); 
setTimeout("goN2U._comboExpandDual('"+mode+"','"+divBParent+"',"+maxSize+","+delay+","+step+");",delay );
}
}
this._comboExpandDual = function (mode,divBParent, maxSize, delay, step){
this.expDivSize =  (mode == 'w' ? this.getElementWidth(divBParent) : this.getElementHeight(divBParent));
if((this.expDivSize<maxSize) && (maxSize <1000)){
this.expDivSize+=step;
mode == 'w' ? this.setWidth(divBParent,this.expDivSize) : this.setHeight(divBParent,this.expDivSize); 
setTimeout("goN2U._comboExpandDual('"+mode+"','"+divBParent+"',"+maxSize+","+delay+","+step+");",delay );
} else{
mode == 'w' ? this.setWidth(divBParent,maxSize) : this.setHeight(divBParent,maxSize); 
this.show (divBParent);
this.expDivSize = 20;
this.expDivProcessing = false;
}
}
this.animateAlpha = function (sID, alphaStart, alphaFinal, nSteps, fnDone, style) {
var o = goN2U.getElement(sID);
if (!o) {
;
return;
}
alphaStart = (alphaStart <= 0 ? 0 : (alphaStart >= 100 ? 100 : alphaStart));
alphaFinal = (alphaFinal <= 0 ? 0 : (alphaFinal >= 100 ? 100 : alphaFinal));
if (this.isUndefined(o.azdAnimAlpha)) {
o.azdAnimAlpha = new Object();
o.azdAnimAlpha.bRunning = false;
}
var anim = o.azdAnimAlpha;
if (anim.bRunning) {
clearInterval(anim.intervalID);
;
anim.intervalID = undefined;
anim.bRunning = false;
}
var alphaDelta = alphaFinal-alphaStart;
var alphaStep = alphaDelta * 1.0 / nSteps; // force floating-point so alphaStep is non-zero
if (nSteps > 1 && Math.abs(alphaStep) > 0.0001) {
anim.alphaStep = alphaStep;
anim.alphaFinal = alphaFinal;
anim.fnDone = fnDone;
var alphaCur = this.getAlphaLevel(o);
anim.nDir = (alphaFinal-alphaCur) > 0 ? 1 : -1;
if (anim.nDir * alphaStep < 0) {
anim.alphaStep = -alphaStep;
}
if (alphaCur >= this.MOZALPHAMAX*100) {
this.setAlphaLevel(o, this.MOZALPHAMAX*100);
}
anim.bRunning = true;
var fn = new Function ("goN2U._animateAlpha('"+sID+"');");
anim.intervalID = setInterval(fn, 25);
} else {
this.setAlphaLevel(o, alphaFinal);
if (fnDone) {
fnDone();
}
}
}
this._animateAlpha = function (sID) {
var o = goN2U.getElement(sID);
if (!o) {
;
return;
}
var anim = o.azdAnimAlpha;
if (!anim.bRunning) {
clearInterval(anim.intervalID);
;
anim.intervalID = undefined;
return;
}
var alphaNext = this.getAlphaLevel(o) + anim.alphaStep;
if ((anim.alphaFinal-alphaNext) * anim.nDir > 0) {
this.setAlphaLevel(o, alphaNext);
} else {
this.setAlphaLevel(o, anim.alphaFinal);
clearInterval(anim.intervalID);
;
anim.intervalID = undefined;
anim.bRunning = false;
if (anim.fnDone) {
anim.fnDone();
}
}
}
this.animateAlphaCancel = function(sID) {
var o = goN2U.getElement(sID);
if (!o) {
;
return;
}
var anim = o.azdAnimAlpha;
clearInterval(anim.intervalID);
;
anim.intervalID = undefined;
anim.bRunning = false;
}
this.isUndefined = function (a) { return (typeof a == 'undefined'); }
this.isDefined   = function (a) { return typeof a != 'undefined'; }
this.isFunction  = function (a) { return typeof a == 'function'; }
this.isNull      = function (a) { return typeof a == 'object' && !a; }
this.isNumber    = function (a) { return typeof a == 'number' && isFinite(a); }
this.isObject    = function (a) { return (a && typeof a == 'object') || this.isFunction(a); }
this.isString    = function (a) { return typeof a == 'string'; }
this.isArray	 = function (a) { return this.isObject(a) && a.constructor == Array; }
this.isUndefOrNull = function (a) { return (typeof a == 'undefined') || (typeof a == 'object' && !a) }
this.objIsInstanceOf = function(obj, classObj) {
while (obj.__proto__) {
if (obj.__proto__ === classObj) {
return true;
}
obj = obj.__proto__;
}
return false;
}
this.templatize = function(oData, sTemplate)
{
var sHTML = '';
if (sTemplate.length > 0)
{
if (this.bIsSafari) {
var sHTML = sTemplate;
for (var i in oData) {
if (typeof(oData[i]) == "string") {
oData[i] = oData[i].replace(new RegExp("\\$", "g"), "&#36;");
}
sHTML = sHTML.replace(new RegExp("{" + i + "}", "g"), oData[i]);
}
sHTML = sHTML.replace(/{([^}]+)}/g, '');
} else {
sHTML = sTemplate.replace(/{([^}]+)}/g, function($0, $1) {
var sV = oData[$1];
if ( typeof sV != 'undefined'  ) {
return sV;
}
return '';
});
}
}
return sHTML;
}
this.extractMultipartValues = function(sVal, cSeparator, aPropertyNames, oProperties, sName) { 
if (!sVal || sVal.length == 0) {
return oProperties;
}
var aResult = sVal.split(cSeparator);
var nExpected = aPropertyNames.length;
if (aResult.length) {
if (aResult.length > nExpected) {
aResult[nExpected-1] = aResult.slice(nExpected-1).join('_');
}
if (goN2U.isUndefOrNull(oProperties)) {
oProperties = {};
}
if (!oProperties.aRawValues) {
oProperties.aRawValues=[];
}
oProperties.aRawValues[oProperties.aRawValues.length] = sVal;
var i;
for (i=0;i<aPropertyNames.length;i++) {
var sPropName = aPropertyNames[i];
var c = sPropName.charAt(0);
var val = aResult[i];
if (goN2U.isDefined(val)) {
switch (c) {
case 'a': val = val.split('|');
break;
case 'b': val = val ? true : false;
break;
case 'n': val = parseInt(val);
break;
}				       
oProperties[sPropName] = val;
} else {
;
}
}
}
return oProperties;
}
this.handleEvent = function (evt)
{
if (!evt && window.event) evt = window.event;
var elTarget = evt.srcElement || evt.target;
if (evt.stopPropagation) evt.stopPropagation();
evt.cancelBubble = true;
return true;
}
this.addHandler = function (el, evt, fn)
{
if (el.attachEvent)
return el.attachEvent("on"+evt, fn);
else if (el.addEventListener)
return (el.addEventListener(evt, fn, false), true);
else
return (el["on"+evt] = fn, true);
return false;
}
this.removeHandler = function (el, evt, fn)
{
if (el.detachEvent)
return el.detachEvent("on"+evt, fn);
else if (el.removeEventListener)
return (el.removeEventListener(evt, fn, false), true);
else
return (el["on"+evt] = null, true);
return false;
}
this.hasClass = function (el, sClass)
{
el = this.getElement(el);
if (el)
{
return new RegExp("\\b"+sClass+"\\b").test(el.className);
}
return false;
}
this.addClass = function (el, sClass)
{
el = this.getElement(el);
if (el)
{
if (!new RegExp("\\b"+sClass+"\\b").test(el.className)) {
el.className += ((el.className.length > 0) ? " " : '')+ sClass;
}
return true;
}
return false;
}
this.removeClass = function (el, sClass)
{
el = this.getElement(el);
if (el)
{
el.className = el.className.replace(new RegExp('\\b'+sClass+"\\b",'g'), '');
return true;
}
return false;
}
this.insertAdjacentHTML = function(oElm, sWhere, sHTML) 
{
if (oElm.insertAdjacentHTML && goN2U.isIE())
{
oElm.insertAdjacentHTML(sWhere, sHTML);
return;
} else if (oElm.ownerDocument && oElm.ownerDocument.createRange) 
{
var oRange = oElm.ownerDocument.createRange();
oRange.setStartBefore(oElm);
var oFrag = oRange.createContextualFragment(sHTML);
switch (sWhere)
{
case 'beforeBegin':
oElm.parentNode.insertBefore(oFrag,oElm)
break;
case 'afterBegin':
oElm.insertBefore(oFrag,oElm.firstChild);
break;
case 'beforeEnd':
oElm.appendChild(oFrag);
break;
case 'afterEnd':
if (oElm.nextSibling) 
{
oElm.parentNode.insertBefore(oFrag,oElm.nextSibling);
} else {
oElm.parentNode.appendChild(oFrag);
}
break;
default:
;
break;
}
} else 
{
;
}
}
this.addStyles = function(aStyles) {
var i, s, aS;
if (document.styleSheets.length == 0) {
var newcss = document.createElement("style");
newcss.type="text/css";
newcss.media="all";
document.getElementsByTagName("head")[0].appendChild(newcss);
}
var css = document.styleSheets[document.styleSheets.length-1];
for (i=0; i< aStyles.length; i++) {
s = aStyles[i];
if (css.insertRule) {
css.insertRule(s, 0);
} else if (css.addRule) {
if (aS = s.match(/^([^\{]*)\{([^\}]*)\}/))
css.addRule(aS[1], aS[2]);
}
}
}
} // END of goN2Utilities Class
if (typeof(HTMLElement) != 'undefined')
{
HTMLElement.prototype.insertAdjacentHTML = function(sWhere, sHTML)
{
goN2U.insertAdjacentHTML(this, sWhere, sHTML);
}
}
window.N2TextSizer=function(spanID) {
var spanEl = document.createElement("span");
if (spanEl) {
spanEl.setAttribute("id",spanID, 0);
document.body.appendChild(spanEl);
goN2U.hide(spanID);
this.span=spanEl; 	// expects goN2Utility class to have been initialized
this.sID = spanID;
this.style=null;
}
this.getStringWidth = function (txt, len) {
;
if (len) this.span.innerText = txt.substring(0, len);
else this.span.innerText = txt;
return goN2U.getElementWidth(this.sID); 
}
this.setStyle = function (style) {
if (style != this.style) {
goN2U.setClass (this.span, style);
this.style = style;
}
}
this.truncateToWidth = function (txt, width) {
var len = txt.length;
var txtwidth = this.getStringWidth(txt);
if (txtwidth >width) {
var reqlen = Math.floor(width/txtwidth*len) - 3;
var temptxt = txt.substring(0, reqlen);
temptxt += '...';
return temptxt;
} else {
return txt;
}
}
this.setContent = function (cont) {
this.span.innerHTML=cont;
return goN2U.getElementWidth(this.span);
}
this.getWidth = function () {
return goN2U.getElementWidth(this.span);
}
this.getHeight = function () {
return goN2U.getElementHeight(this.span);
}
}
window.N2FifoQueue=function(n) {
var current = 0;
var next = 0;
var size = n ? n : 20;
var q = new Array(n);
this.add = function (item) {
q[next] = item;
next++;	
if (next == size) next = 0;
q[next] = null;	// to ensure we don't have current go past
}
this.current = function () {
return q[current];
}
this.next = function () {
var val = null;
if (q[current]) current++;	// don't advance past stop fence
if (current == size) current = 0;
val = q[current];
return val;
}
this.nextExists = function () {
var val = null;
var temp = current;
if (q[temp]) temp++;	// don't advance past stop fence
if (temp == size) temp = 0;
return q[temp] != null;
}
this.toString = function () {
var txt = "Current: " + current + "\n";
txt += "Next: " + next + "\n";
for (i=0;i<size;i++) {
txt += "["+i+"] = " + q[i]; 
if (i == current) txt += " <-Current ";
if (i == next) txt += " <-Next";
txt +="\n";
}
return txt
}
}
window.N2BrowseStack=function(n) {
var current = -1;
var size = n ? n : 20;
var q = new Array(n);
this.add = function (item) {
current++;	
q[current] = item;
q[current+1] = null;	// once we add a new item any past it are toast
}
this.reset = function () {
current = -1;
q[0] = null;
q[1] = null;
}
this.previous = function (item) {
if (current >0) return q[current-1];	
return null;
}
this.current = function () {
return q[current];
}
this.next = function () {
return q[current+1];
}
this.goBack = function () { if (current >0) current--;	}
this.goForward = function () { if (q[current+1]) current++; }
this.toString = function () {
var txt = "Current: " + current + "\n";
for (i=0;i<=current;i++) {
txt += "["+i+"] = " + q[i].id; 
if (i == current) txt += " <-Current ";
txt +="\n";
}
return txt
}
}
window.N2LinkNameInfo=function(sLinkID, sNameOverride) {
if (sLinkID) {	
var oLink = goN2U.getElement(sLinkID);	
var sName = "";	
if (oLink) { 
sName = oLink.name;	
;
}
if (sNameOverride) {
sName = sNameOverride;	
;
}
if (sName) {
var tmpArray = sName.split("|");
if (tmpArray.length >1) {
this.sLinkID = sLinkID; 
this.sName = sName;
this.sFeature  = tmpArray[0];
this.sType = tmpArray[1];
this.sID = tmpArray[2];
this.sParams = tmpArray[3];
for (var i = 4; !goN2U.isUndefined(tmpArray[i]); i++) {
this.sParams = this.sParams + "|" + tmpArray[i];
}
}
}
} else {
;
}
this.getLinkID	= function () { return this.sLinkID; }
this.getLinkName= function () { return this.sName; }
this.getFeature	= function () { return this.sFeature; }
this.getType	= function () { return this.sType; }
this.getID		= function () { return this.sID; }
this.getParams	= function () { return this.sParams; }
}	
var gaN2HandlerChains = new Array();
var gaN2HandlerRunFns = new Array();
window.N2ChainEventHandler=function(sHandlerName, fFn, sComment) {
sHandlerName = sHandlerName.toLowerCase();
sComment = sComment ? sComment : 'unknown';
;
;
if ( (typeof fFn != 'function') || fFn == null) return false;
var aChain;
if (!gaN2HandlerChains[sHandlerName]) {
aChain = gaN2HandlerChains[sHandlerName] = new Array();
} else {
aChain =  gaN2HandlerChains[sHandlerName];
}
var oE = window;
if (sHandlerName != 'onload' && sHandlerName != 'onresize' && sHandlerName != 'onerror') {
oE = document.getElementsByTagName("body")[0];
if (oE == null) {
;
return;
}
}
if  (oE[sHandlerName])	{
if (oE[sHandlerName] != gaN2HandlerRunFns[sHandlerName]) {
aChain[0] = oE[sHandlerName];
var fn = new Function ("evt", "evt = evt ? evt : window.event; _N2RunHandlers(evt, '"+sHandlerName+"');");
gaN2HandlerRunFns[sHandlerName] = fn;
oE[sHandlerName] = fn;
}
var len = aChain.length;
;
aChain[len] = fFn;
} else {
;
oE[sHandlerName] = fFn;
}
return true;
}
function _N2RunHandlers( evt, sHandlerName ) {
var aH = gaN2HandlerChains[sHandlerName];
var len = aH.length;
for (var i=0;i<len;i++) {
aH[i](evt);
}		
}
N2ChainEventHandler('onload', 
function(){
n2RunEvent('onload');
n2RunEvent(gbN2Loaded ? 'onloadsuccess' : 'onloaderror');
},
'run onload events' );
window.goN2Drag = {
obj : null,
normalizeEvent : function (evt) {
evt = (evt) ? evt : ((window.event) ? window.event : null);
if (evt) {
if(!evt.target) {
evt.target = evt.srcElement;
}
} else {
;
}
return evt;
},
mouseDown : function(evt) {
evt = goN2Drag.normalizeEvent(evt);
if (evt) {
var oE = goN2Drag.obj = evt.target;
if (oE._n2bDraggable) {	
oE._n2SavedMouseMove = document.onmousemove;
oE._n2SavedMouseUp = document.onmouseup;
document.onmousemove = goN2Drag.mouseMove;
document.onmouseup = goN2Drag.mouseUp;
if (document.body && document.body.setCapture) {
document.body.setCapture();
;	
}
var mouseDownX = (evt.clientX)? evt.clientX : evt.pageX;
var mouseDownY = (evt.clientY)? evt.clientY : evt.pageY;
oE.dragOffsetX = mouseDownX - ((oE.offsetLeft) ? oE.offsetLeft : oE.left);
oE.dragOffsetY = mouseDownY - ((oE.offsetTop) ? oE.offsetTop : oE.top);
oE.buttonIsDown = true;
if (oE._oN2 && oE._oN2.mouseDown) {
oE._oN2.onMouseDown(evt)
}
}	
}
},
mouseMove : function(evt) {
evt = goN2Drag.normalizeEvent(evt);
if (evt) {
var oE = goN2Drag.obj;
if (oE.buttonIsDown) {
var nX = (evt.clientX)? evt.clientX : evt.pageX;
nX -= oE.dragOffsetX;
var nY = (evt.clientY)? evt.clientY : evt.pageY;
nY -= oE.dragOffsetY;
nX = Math.max(oE._n2nMinLeft, nX);
nX = Math.min(oE._n2nMaxLeft, nX);
nY = Math.max(oE._n2nMinTop, nY);
nY = Math.min(oE._n2nMaxTop, nY);
var bDoShift = true;
if (oE._oN2 && oE._oN2.onMoved) {
bDoShift = oE._oN2.onMoved(nX, nY);
}
if (bDoShift) {
goN2U.shiftTo(oE, nX, nY);
}
}
}		
},
mouseUp : function(evt) {
;
evt = goN2Drag.normalizeEvent(evt);
if (evt) {
var oE = goN2Drag.obj;
if (oE.buttonIsDown) {
if (document.body && document.body.releaseCapture) {
document.body.releaseCapture();
;	
}
oE.buttonIsDown = false;
if (oE._oN2 && oE._oN2.onMouseUp) {
oE._oN2.onMouseUp();
}
}
document.onmousemove = oE._n2SavedMouseMove;
document.onmouseup   = oE._n2SavedMouseUp;
}
},
makeDraggable : function (sID, nMinLeft, nMaxLeft, nMinTop, nMaxTop) {
var oE = goN2U.getElement(sID);
if (oE) {
oE["onmousedown"] = goN2Drag.mouseDown; 	
oE._n2bDraggable = true;
oE._n2nMinLeft = goN2U.isDefined(nMinLeft) ? nMinLeft : 0;
oE._n2nMaxLeft = goN2U.isDefined(nMaxLeft) ? nMaxLeft : 10000;
oE._n2nMinTop = goN2U.isDefined(nMinTop) ? nMinTop : 0;
oE._n2nMaxTop = goN2U.isDefined(nMaxTop) ? nMaxTop : 10000;
;
} else {
;
}
return oE;
}
}
var goN2U = new N2Utilities();
goN2U.initialize();
n2RunThisWhen('onload', 
function() { 
if (!document.body) {
alert("Error: Must initialize Utilities library in the body. (body not found)");
return;
}
var sID = goN2U.sAnimationDivID = 'goN2UAnimatedBox';
var o = document.createElement("div");
if (o) {
document.body.appendChild(o);
o.setAttribute("id",sID, 0);
goN2U.setClass(sID, 'animatedBox');
} else {
;
}
}, 'animate box creation' );
if (window.goN2LibMon) goN2LibMon.endLoad('utilities');