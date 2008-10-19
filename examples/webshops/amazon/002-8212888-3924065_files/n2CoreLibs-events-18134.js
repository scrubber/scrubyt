//! ################################################################
//! Copyright (c) 2004-2005 Amazon.com, Inc., and its Affiliates.
//! All rights reserved.
//! Not to be reused without permission
//! $Change: 1238354 $
//! $Revision: #8 $
//! $DateTime: 2006/12/11 17:12:12 $
//! ################################################################
function n2EventsInitLibrary() { // Begin library code wrapper. Goes all the way to the bottom of the file
if (window.goN2LibMon) goN2LibMon.beginLoad('events', 'n2CoreLibs');
window.N2Instance = function(oFeature) {
this.className = 'N2Instance';
this.version = '1.1.0';
this.oFeature = oFeature;
this._timers = new Object(); // HASH of timerids for this object, indexed by timer name.
this.nSTATEDORMANT = 0;
this.nSTATEPREOPEN = 1;
this.nSTATEOPENING = 2;
this.nSTATEVISIBLE = 3;
this.nSTATECLOSING = 4;
this.activeState = this.nSTATEDORMANT;
this.instanceName = null;
this.oRegFeatureOpened = null;
}
new N2Instance();
window.N2Instance.prototype.getFeature = function() {
return this.oFeature;
}
window.N2Instance.prototype.getFeatureID = function() {
return (this.oRegFeatureOpened ? this.oRegFeatureOpened.getFeatureID() : "");
}
window.N2Instance.prototype.setRegFeatureOpened = function(oRegFeatureOpened) {
this.oRegFeatureOpened = oRegFeatureOpened;
}
window.N2Instance.prototype.getRegFeatureOpened = function() {
return this.oRegFeatureOpened;
}
window.N2Instance.prototype.getInstanceName = function() {
return this.instanceName;
}
window.N2Instance.prototype.getInstanceNameFromLinkInfo = function(oLNI) {
;
return null;
}
window.N2Instance.prototype._setInstanceName = function(oLNI) {
;
var instanceName = this.getInstanceNameFromLinkInfo(oLNI);
if (instanceName != this.instanceName) {
this.clearAllTimers();
this.instanceName = instanceName;
}
}
window.N2Instance.prototype.isDormant = function() {
return (this.activeState <= this.nSTATEDORMANT);
}
window.N2Instance.prototype.isPreOpen = function() {
return (this.nSTATEDORMANT < this.activeState && this.activeState <= this.nSTATEPREOPEN);
}
window.N2Instance.prototype.isOpening = function() {
return (this.nSTATEPREOPEN < this.activeState && this.activeState <= this.nSTATEOPENING);
}
window.N2Instance.prototype.isVisible = function() {
return (this.nSTATEOPENING < this.activeState && this.activeState <= this.nSTATEVISIBLE);
}
window.N2Instance.prototype.isClosing = function() {
return (this.nSTATEVISIBLE < this.activeState);
}
window.N2Instance.prototype.isActive = function() {
return this.isVisible();
};
window.N2Instance.prototype.setTimer = function(timerName, nMSDelay, eventData) {
this.clearTimer(timerName);
var timerObject = new Object();
this._timers[timerName] = timerObject;
;//goN2Debug.info("N2Instance setting timer feature " + this.getFeatureID() + ", instance " + this.getInstanceName() + ", timer " + timerName + ", eventData " + eventData);
timerObject.eventData = eventData;
timerObject.timerid = setTimeout(
"N2Instance._timerFired('" +
this.getFeatureID() + "', '" +
this.getInstanceName() + "', '" +
timerName+"')",
nMSDelay);
}
window.N2Instance.prototype.clearTimer = function(timerName) {
var timerObject = this._timers[timerName];
if (timerObject) {
;
clearTimeout(timerObject.timerid);
this._timers[timerName] = 0;
}
}
window.N2Instance.prototype.clearAllTimers = function() {
;
for (var timerName in this._timers) {
this.clearTimer(timerName);
}
}
window.N2Instance._timerFired = function(featureID, instanceName, timerName) {
;
var oFeature = goN2Events.lookupFeature(featureID);
;
if (!oFeature) {
return;
}
var oInstance = oFeature.getInstance(featureID, instanceName);
;
if (!oInstance) {
return;
}
var timerObject = oInstance._timers[timerName];
oInstance._timers[timerName] = 0;
;
oInstance[timerName](timerObject.eventData);
}
window.N2FInstance = function(oFeature) {
N2FInstance.parentClass.call(this, oFeature);
this.className = 'N2FInstance';
this.version = '1.1.0';
this.bPreOpenDuringClose = false;
this.bMouseIsIn = false;
}
window.N2FInstance.prototype = new N2Instance();
window.N2FInstance.parentClass = N2Instance;
window.N2FInstance.prototype.getRawObject = function() {
;
return null;
}
window.N2FInstance.prototype.getInstanceNameFromLinkInfo = function(oLNI) {
var name = N2FInstance.getInstanceNameFromLinkInfo(oLNI);
return name;
}
window.N2FInstance.getInstanceNameFromLinkInfo = function(oLNI) {
;
var name = (oLNI.getID() ? N2Feature.prefixFInstanceNames + oLNI.getID() : null);
return name;
}
window.N2FInstance.prototype.isStatic = function() {
return false;
}
window.N2FInstance.prototype.assignInstance = function(oLNI) {
if (!this.isDormant()) {
;
return false;
}
this._setInstanceName(oLNI);
return true;
}
window.N2FInstance.prototype.overlayClosed = function() {
return;
}
window.N2FInstance.prototype.notifyFInstanceHasMouse = function(bMouseIsInInstance) {
var bMouseWasIn = this.bMouseIsIn;
this.bMouseIsIn = bMouseIsInInstance;
if (this.oFeature.isDisabled()) {
return;
}
if (this.isStatic()) {
return;
}
if (bMouseWasIn && !bMouseIsInInstance) {
;
this._scheduleClose(this.getRegFeatureOpened().getDelayCloseAfter());
} else if (!bMouseWasIn && bMouseIsInInstance) {
;
this._cancelClose();
}
}
window.N2FInstance.prototype.mouseOverHotspotTrack = function(oLNI) {
;//goN2Debug.info("feature instance mouseOverHotspotTrack; feature " + oLNI.getFeature() + ", feature instance '" + this.getInstanceName() + "'");
var oRegFeature = goN2Events.lookupRegFeature(oLNI.getFeature());
;
if (this.oFeature.isDisabled()) {
return;
}
this._cancelClose();
}
window.N2FInstance.prototype.mouseOverHotspotOpen = function(oLNI, nFeatureFlags) {
;//goN2Debug.info("feature instance mouseOverHotspotOpen; feature " + oLNI.getFeature() + ", feature instance '" + this.getInstanceName() + "'");
var oRegFeature = goN2Events.lookupRegFeature(oLNI.getFeature());
;
if (this.oFeature.isDisabled()) {
return;
}
if (this.activeState<=this.nSTATEPREOPEN || this.isClosing()) {
this._scheduleOpen(oLNI, nFeatureFlags, oRegFeature.getDelayShowAfter());
} else {
;
this._cancelClose();
}
}
window.N2FInstance.prototype.mouseOutHotspotClose = function(oLNI) {
;//goN2Debug.info("feature instance mouseOutHotspotClose; feature " + this.getFeatureID() + ", feature instance '" + this.getInstanceName() + "'");
var oRegFeature = goN2Events.lookupRegFeature(oLNI.getFeature());
;
if (this.activeState <= this.nSTATEDORMANT) {
} else if (this.activeState <= this.nSTATEPREOPEN) {
this._cancelOpen();
} else if (this.activeState <= this.nSTATEVISIBLE) {
this._scheduleClose(oRegFeature.getDelayReachWithin());
} else {
}
}
window.N2FInstance.prototype.clickHotspotOpen = function(oLNI, nFeatureFlags) {
;//goN2Debug.info("feature instance clickHotspotOpen; feature " + this.getFeatureID() + ", feature instance '" + this.getInstanceName() + "'");
var oRegFeature = goN2Events.lookupRegFeature(oLNI.getFeature());
;
this.openNow(oLNI, nFeatureFlags);
}
window.N2FInstance.prototype.mouseOver = function() {
;//goN2Debug.info("feature instance mouseOver; feature " + this.getFeatureID() + ", feature instance '" + this.getInstanceName() + "'");
this.notifyFInstanceHasMouse(true);
}
window.N2FInstance.prototype.mouseOut = function() {
;//goN2Debug.info("feature instance mouseOut; feature " + this.getFeatureID() + ", feature instance '" + this.getInstanceName() + "'");
this.notifyFInstanceHasMouse(false);
}
window.N2FInstance.prototype._scheduleOpen = function(oLNI, nFeatureFlags, nMSDelay) {
this.setRegFeatureOpened(goN2Events.lookupRegFeature(oLNI.getFeature()));
;
var eventData = new Object();
eventData.oLNI = oLNI;
eventData.nFeatureFlags = nFeatureFlags;
this.setTimer("_timedOpen", nMSDelay, eventData);
if (this.isClosing()) {
this.bPreOpenDuringClose = true;
} else {
this.activeState = this.nSTATEPREOPEN;
}
}
window.N2FInstance.prototype._timedOpen = function(eventData) {
if (this.oFeature.isDisabled()) {
return;
}
this.openNow(eventData.oLNI, eventData.nFeatureFlags);
}
window.N2FInstance.prototype._cancelOpen = function() {
;
this.clearTimer("_timedOpen");
}
window.N2FInstance.prototype._scheduleClose = function(nMSDelay) {
;
if (this.isStatic()) {
return;
}
this.setTimer("_timedClose", nMSDelay, null);
}
window.N2FInstance.prototype._timedClose = function(eventData) {
this.closeNow();
}
window.N2FInstance.prototype._cancelClose = function() {
;
this.clearTimer("_timedClose");
}
window.N2FInstance.prototype.openNow = function(oLNI, nFeatureFlags) {
;
}
window.N2FInstance.prototype.closeNow = function(bImmediate) {
;
}
window.N2FInstanceWrapper = function(oWrapperFeature) {
N2FInstanceWrapper.parentClass.call(this, oWrapperFeature); // Call the base class constructor function.
this.className = 'N2FInstanceWrapper';
this.version = '1.1.0';
this.oWrappedFeature = null; // must be null except when Active.
}
window.N2FInstanceWrapper.prototype = new N2FInstance();
window.N2FInstanceWrapper.parentClass = N2FInstance;
window.N2FInstanceWrapper.prototype.isStatic = function() {
return ((this.oWrappedFeature && this.oWrappedFeature.isStatic) ? this.oWrappedFeature.isStatic() : false);
}
window.N2FInstanceWrapper.prototype.getRawObject = function() {
;
return this.oWrappedFeature.getObject();
}
window.N2FInstanceWrapper.prototype.openNow = function(oLNI, nFeatureFlags) {
;//goN2Debug.info("feature instance wrapper openNow; feature " + oLNI.getFeature() + ", feature instance '" + this.getInstanceNameFromLinkInfo(oLNI) + "'");
;
if (this.oFeature.isDisabled()) {
return;
}
var oFInstanceActive = this.oFeature.getActiveWrappedFInstance();
if (oFInstanceActive) {
oFInstanceActive.closeNow(true);
}
this.oWrappedFeature = this.oFeature.getWrappedFeatureObj();
this.oFeature.setActiveWrappedFInstance(this);
if (!this.oWrappedFeature.isVisible())
{
;
this._cancelOpen();
this.setRegFeatureOpened(goN2Events.lookupRegFeature(oLNI.getFeature()));
var oHotspot = this._createHotspotObj(oLNI, nFeatureFlags);
this.oWrappedFeature.show(oHotspot);
if (this.oWrappedFeature.isVisible()) {
goN2Events.toggleObjects("hide", this.oFeature.getWrappedFeatureActiveElement().id);
this._setStateFromWrappedFeature(this.nSTATEVISIBLE);
} else {
this.oWrappedFeature = null;
this.oFeature.setActiveWrappedFInstance(null);
this._setStateFromWrappedFeature(this.nSTATEDORMANT);
}
} else {
;
this._setStateFromWrappedFeature(this.nSTATEVISIBLE);
}
}
window.N2FInstance.prototype.overlayClosed = function() {
if (this.oWrappedFeature) {
this.oWrappedFeature = null;
this.oFeature.setActiveWrappedFInstance(null);
}
this._setStateFromWrappedFeature(this.nSTATEDORMANT);
}
window.N2FInstanceWrapper.prototype._setStateFromWrappedFeature = function(activeStateExpected) {
if (this.oWrappedFeature && this.oWrappedFeature.isVisible()) {
this.activeState = this.nSTATEVISIBLE;
} else {
this.activeState = this.nSTATEDORMANT;
}
;
if (this.activeState != activeStateExpected) {
;
}
}
window.N2FInstanceWrapper.prototype.closeNow = function(bImmediate) {
;//goN2Debug.info("feature instance wrapper closeNow; feature " + this.getFeatureID() + ", feature instance '" + this.getInstanceName() + "'");
if (this.isStatic()) {
return;
}
var oWrappedFeature = this.oWrappedFeature;
if (oWrappedFeature && oWrappedFeature.isVisible()) {
this._cancelClose();
var nAnimateCloseSaved;
if (bImmediate) {
nAnimateCloseSaved = this._smashNAnimateClose(oWrappedFeature, 0);
}
try {
;
oWrappedFeature.hide();
} catch (e) {
if (bImmediate) {
this._smashNAnimateClose(oWrappedFeature, nAnimateCloseSaved);
}
throw(e);
}
if (bImmediate) {
this._smashNAnimateClose(oWrappedFeature, nAnimateCloseSaved);
}
;
if (this.oWrappedFeature) {
this.oWrappedFeature = null;
this.oFeature.setActiveWrappedFInstance(null);
}
goN2Events.toggleObjects("show");
} else {
;
}
this._setStateFromWrappedFeature(this.nSTATEDORMANT);
this.setRegFeatureOpened(null);
}
window.N2FInstanceWrapper.prototype._smashNAnimateClose = function(oWrappedFeature, newValue) {
var oldValue = oWrappedFeature.nAnimateClose;
oWrappedFeature.nAnimateClose = newValue;
return oldValue;
}
window.N2FInstanceWrapper.prototype._createHotspotObj = function(oLNI, nFeatureFlags) {
if (goN2U.isUndefOrNull(nFeatureFlags)) {
nFeatureFlags = 0;
}
var oHotspot = new Object();
oHotspot.id = "";
oHotspot.objectname = "";
oHotspot.abstop = "";           // abs y within the document
oHotspot.absleft = "";          // abs x within the document
oHotspot.top = "";              // abs y within the window [relative to the document]
oHotspot.left = "";             // abs x within the window [relative to the document]
oHotspot.bottom = "";
oHotspot.right = "";
oHotspot.availAbove = 0;
oHotspot.availUnder = 0;
oHotspot.availLeft = 0;
oHotspot.availRight = 0;
oHotspot.scrollLeft = 0;
oHotspot.scrollTop = 0;
oHotspot.clientHeight = 0;
oHotspot.clientWidth = 0;
oHotspot.staticFlag = 0;
var sFeatureID = oLNI.getFeature();
;
var sLinkID = oLNI.getLinkID();
var oLink = goN2U.getRawObject(sLinkID);
oHotspot.oLink = oLink;
var sName = oLNI.getLinkName();
if (sName != oLink.id) {
oHotspot.sNameOverride = sName;
}
;
oHotspot.featureID = sFeatureID;
;
oHotspot.relatedFeatureObj = this.oWrappedFeature;
oHotspot.staticFlag = nFeatureFlags;
oHotspot.scrollLeft = goN2U.getScrollLeft();
oHotspot.scrollTop = goN2U.getScrollTop();
oHotspot.clientHeight = goN2U.getInsideWindowHeight();
oHotspot.clientWidth = goN2U.getInsideWindowWidth();
;
;
oHotspot.href = oLink.href;
var sTmp;
var re = /([\r\n])/gi;
sTmp = oLink.innerHTML;
oHotspot.linkHTML = sTmp.replace(re, " ");
sTmp = goN2U.isUndefOrNull(oLink.innerText) ? oLink.innerHTML : oLink.innerText;
oHotspot.linkText = sTmp.replace(re, " ");
;
;
;
;
oHotspot.absleft = goN2U.getScrolledElementLeft(oLink);
oHotspot.abstop = goN2U.getScrolledElementTop(oLink);
oHotspot.left = goN2U.getObjectLeft(oLink) - oHotspot.scrollLeft;
oHotspot.top = goN2U.getObjectTop(oLink) - oHotspot.scrollTop;
oHotspot.width = goN2U.getObjectWidth(oLink);
oHotspot.height = goN2U.getObjectHeight(oLink);
var elChild = oLink.firstChild;
if ( (oHotspot.width == 0) && elChild ){
oHotspot.width = goN2U.getObjectWidth(elChild);
oHotspot.height = goN2U.getObjectHeight(elChild);
} else if ( goN2U.isMozilla5() ) {
var aChildren = oLink.childNodes
var nChildren = aChildren.length;
for (var i=0;i<nChildren;i++) {
elChild = aChildren[i];
if ((elChild.nodeType == 1) && (elChild.tagName == 'IMG')) {
oHotspot.bottom = oHotspot.top + goN2U.getObjectHeight(oLink);
oHotspot.height = goN2U.getObjectHeight(elChild);
var oldTop = oHotspot.top;
oHotspot.top = oHotspot.bottom - oHotspot.height;
oHotspot.abstop = oHotspot.abstop + (oHotspot.top-oldTop);
break;
}
}
}
oHotspot.right = oHotspot.left + oHotspot.width;
oHotspot.bottom = oHotspot.top + oHotspot.height;
oHotspot.sLinkID = sLinkID;
; //oLink set earlier
oHotspot.availAbove = oHotspot.abstop - oHotspot.scrollTop - 1;
oHotspot.availUnder = oHotspot.clientHeight - (oHotspot.abstop + oHotspot.height - oHotspot.scrollTop);
oHotspot.availLeft = oHotspot.absleft - oHotspot.scrollLeft - 1;
oHotspot.availRight = oHotspot.clientWidth - (oHotspot.absleft + oHotspot.width - oHotspot.scrollLeft);
return oHotspot;
}
window.N2HInstance = function(oFeature) {
N2HInstance.parentClass.call(this, oFeature); // Call the base class constructor function.
this.className = 'N2HInstance';
this.version = '1.1.0';
}
window.N2HInstance.prototype = new N2Instance();
window.N2HInstance.parentClass = N2Instance;
window.N2HInstance.prototype.getInstanceNameFromLinkInfo = function(oLNI) {
return N2HInstance.getInstanceNameFromLinkInfo(oLNI);
}
window.N2HInstance.getInstanceNameFromLinkInfo = function(oLNI) {
;
;
return N2Feature.prefixHInstanceNames + oLNI.getLinkID();
}
window.N2HInstance.prototype.getLinkInfoFromInstanceName = function(sInstanceName) {
return N2HInstance.getInstanceNameFromLinkInfo(sInstanceName);
}
window.N2HInstance.getLinkInfoFromInstanceName = function(sInstanceName) {
;
var prefixLength = N2Feature.prefixHInstanceNames.length;
;
var sLinkID = sInstanceName.substr(prefixLength, sInstanceName.length-prefixLength);
return goN2U.getLinkNameInfo(sLinkID);
}
window.N2HInstance.prototype.mouseOverTrack = function(oLNI) {
if (this.oFeature.isDisabled()) {
return;
}
;//goN2Debug.info("hotspot mouseOverTrack; hotspot id " + oLNI.getLinkID() + ", name " + oLNI.getLinkName());
var oFInstance = this.oFeature.getFeatureInstance(oLNI);
if (oFInstance) {
oFInstance.mouseOverHotspotTrack(oLNI);
}
}
window.N2HInstance.prototype.mouseOverOpen = function(oLNI, nFeatureFlags) {
if (this.oFeature.isDisabled()) {
return;
}
;//goN2Debug.info("hotspot mouseOverOpen; hotspot id " + oLNI.getLinkID() + ", name " + oLNI.getLinkName());
var oFInstance = this.oFeature.getFeatureInstance(oLNI);
if (!oFInstance) {
oFInstance = this.oFeature.createFeatureInstance(oLNI);
}
if (oFInstance) {
oFInstance.mouseOverHotspotOpen(oLNI, nFeatureFlags);
} else {
;
}
}
window.N2HInstance.prototype.mouseClickOpen = function(oLNI, nFeatureFlags) {
;//goN2Debug.info("hotspot mouseClickOpen; hotspot id " + oLNI.getLinkID() + ", name " + oLNI.getLinkName());
if (this.oFeature.isDisabled()) {
return;
}
var oFInstance = this.oFeature.getFeatureInstance(oLNI);
if (!oFInstance) {
oFInstance = this.oFeature.createFeatureInstance(oLNI);
}
if (oFInstance) {
oFInstance.clickHotspotOpen(oLNI, nFeatureFlags);
} else {
;
}
}
window.N2HInstance.prototype.mouseOutClose = function(oLNI) {
;//goN2Debug.info("hotspot mouseOutClose; hotspot id " + oLNI.getLinkID() + ", name " + oLNI.getLinkName());
if (this.oFeature.isDisabled()) {
return;
}
var oFInstance = this.oFeature.getFeatureInstance(oLNI);
if (oFInstance) {
oFInstance.mouseOutHotspotClose(oLNI);
}
}
window.N2RegFeature = function(oFeature, sFeatureID, mouseOverFn, mouseOutFn, clickFn) {
this.className = 'N2RegFeature';
this.version = '1.1.0';
if (!oFeature) {
return;
}
if (!mouseOverFn) {
mouseOverFn = n2MouseOverHotspotNop;
}
if (!mouseOutFn) {
mouseOutFn = n2MouseOutHotspotNop;
}
this._sFeatureID = sFeatureID;
this._oFeature = oFeature;
this._timerDelays = new Object();
this._timerDelays.showAfter  = 400;
this._timerDelays.reachWithin = 600;
this._timerDelays.closeAfter = 400;
this._eventsRegistry = new Object();
this._registeredFunctions = new Object();
this._preProcessEventFunction('onmouseover', mouseOverFn);
this._preProcessEventFunction('onmouseout', mouseOutFn);
this._preProcessEventFunction('onclick', clickFn);
}
new N2RegFeature();
window.N2RegFeature.prototype.getFeatureID = function() { return this._sFeatureID; }
window.N2RegFeature.prototype.getFeature = function() { return this._oFeature; }
window.N2RegFeature.prototype.getEventHelperFunction = function(event) {
return this._registeredFunctions[event];
}
window.N2RegFeature.prototype._preProcessEventFunction = function(event, fname)
{
try {
;
var code = eval(fname)
this._eventsRegistry[event] = fname;
this._registeredFunctions[event] = code;
;
}
catch (e) {
;
}
}
window.N2RegFeature.prototype.attachEventsToLink = function(elem) {
for (var event in this._eventsRegistry) {
if (this._eventsRegistry[event]) {
;
elem[event] = this._registeredFunctions[event];
}
}
}
window.N2RegFeature.prototype.setDelays = function(nShowAfter, nReachWithin, nCloseAfter) {
var a, b, c;
a = this._timerDelays.showAfter   = goN2U.isUndefOrNull(nShowAfter)   ? this._timerDelays.showAfter   : nShowAfter;
b = this._timerDelays.reachWithin = goN2U.isUndefOrNull(nReachWithin) ? this._timerDelays.reachWithin : nReachWithin;
c = this._timerDelays.closeAfter  = goN2U.isUndefOrNull(nCloseAfter)  ? this._timerDelays.closeAfter  : nCloseAfter;
;
}
window.N2RegFeature.prototype.getDelayShowAfter = function() {
return this._timerDelays.showAfter;
}
window.N2RegFeature.prototype.getDelayReachWithin = function() {
return this._timerDelays.reachWithin;
}
window.N2RegFeature.prototype.getDelayCloseAfter = function() {
return this._timerDelays.closeAfter;
}
window.N2Feature = function() {
this.className = 'N2Feature';
this.version = '1.1.0';
this._timeDisabledUntil = null;
this._nDefaultDisableMs = 5000;
this._oHInstance = new N2HInstance(this);
}
new N2Feature();
window.N2Feature.prefixHInstanceNames = "HS_";
window.N2Feature.prefixFInstanceNames = "FI_";
window.N2Feature.prototype.closeAllInstances = function(bImmediate) {
;
}
window.N2Feature.prototype.notifyMouseOwner = function(oRegFeatureMouseOwner, sInstanceNameMouseOwner) {
;
}
window.N2Feature.prototype.disableFeature = function(nMSDelay) {
if (!nMSDelay) {
nMSDelay = this._nDefaultDisableMs;
}
this.clossAll(false);
var date = new Date();
var now = date.getTime();
this._timeDisabledUntil = now + nMSDelay;
}
window.N2Feature.prototype.isDisabled = function() {
var bDisabled = false;
if (this._timeDisabledUntil) {
var date = new Date();
var now = date.getTime();
if (now < this._timeDisabledUntil) {
bDisabled = true;
} else {
this._timeDisabledUntil = null;
}
}
return bDisabled;
}
window.N2Feature.prototype.getFeatureInstance = function(oLNI_or_featureID, sInstanceName) {
;
return null;
}
window.N2Feature.prototype.createFeatureInstance = function(oLNI) {
;
return null;
}
window.N2Feature.prototype.getFeatureInstanceName = function(oLNI) {
return N2FInstance.getInstanceNameFromLinkInfo(oLNI);
}
window.N2Feature.prototype.getHotspotInstance = function(oLNI_or_featureID, sInstanceName) {
return this._oHInstance;
}
window.N2Feature.prototype.getHotspotInstanceName = function(oLNI) {
return N2HInstance.getInstanceNameFromLinkInfo(oLNI);
}
window.N2Feature.prototype.getLinkInfoFromHotspotInstanceName = function(sInstanceName) {
return N2HInstance.getLinkInfoFromInstanceName(sInstanceName);
}
window.N2Feature.prototype.isHotspotInstanceName = function(sInstanceName) {
;
if (sInstanceName) {
return (sInstanceName.substr(0,N2Feature.prefixHInstanceNames.length) == N2Feature.prefixHInstanceNames);
}
return false;
}
window.N2Feature.prototype.getInstance = function(featureID, sInstanceName) {
;
if (sInstanceName.substr(0,N2Feature.prefixHInstanceNames.length) == N2Feature.prefixHInstanceNames) {
return this.getHotspotInstance(featureID, sInstanceName);
} else if (sInstanceName.substr(0,N2Feature.prefixFInstanceNames.length) == N2Feature.prefixFInstanceNames) {
return this.getFeatureInstance(featureID, sInstanceName);
}
;
return null;
}
window.N2FeatureWrapper = function(sFeatureID, oWrappedFeature, wrappedFeatureObjectName) {
N2FeatureWrapper.parentClass.call(this);  // THIS line MUST come first -- executes parent constructor
this.className = 'N2FeatureWrapper';
this.version = '1.1.0';
this._oWrappedFeature = oWrappedFeature; // JSF 1.0 Feature object
this._wrappedFeatureObjectName = wrappedFeatureObjectName;
this._oActiveFInstance = null; // the active feature instance, if any.
this._featureInstances = new Object();
}
window.N2FeatureWrapper.prototype = new N2Feature();
window.N2FeatureWrapper.parentClass = N2Feature;
window.N2FeatureWrapper.prototype.getWrappedFeatureObjectName = function() { return this._wrappedFeatureObjectName; }
window.N2FeatureWrapper.prototype.getWrappedFeatureObj = function() { return this._oWrappedFeature; }
window.N2FeatureWrapper.prototype.getActiveWrappedFInstance = function() { return this._oActiveFInstance; }
window.N2FeatureWrapper.prototype.setActiveWrappedFInstance = function(oWrappingInstance) {
;
this._oActiveFInstance = oWrappingInstance;
}
window.N2FeatureWrapper.prototype.getWrappedFeatureActiveElement = function() {
return (this._oWrappedFeature.isActive() ? this._oWrappedFeature.getObject() : null);
}
window.N2FeatureWrapper.prototype.getWrappedMouseOutCallback = function() {
return this._oWrappedFeature.myMouseOutCallback;
}
window.N2FeatureWrapper.prototype.getFeatureInstance = function(oLNI_or_featureID, sInstanceName) {
var featureID;
if (typeof oLNI_or_featureID == "string") {
featureID = oLNI_or_featureID;
} else {
var oLNI = oLNI_or_featureID;
featureID = oLNI.getFeature();
sInstanceName = N2FInstance.getInstanceNameFromLinkInfo(oLNI);
}
for (var id in this._featureInstances) {
if (id == featureID + "|" + sInstanceName) {
return this._featureInstances[id];
}
}
return null;
}
window.N2FeatureWrapper.prototype.notifyMouseOwner = function(oRegFeatureMouseOwner, sInstanceNameMouseOwner) {
var oFeatureMouseOwner = (oRegFeatureMouseOwner ? oRegFeatureMouseOwner.getFeature() : null);
var featureIDMouseOwner = (oRegFeatureMouseOwner ? oRegFeatureMouseOwner.getFeatureID() : "");
for (var id in this._featureInstances) {
var idArray = id.split("|");
var featureID = idArray[0];
var oFInstance = this._featureInstances[id];
oFInstance.notifyFInstanceHasMouse(
this == oFeatureMouseOwner &&                           // needed because featureIDs might be null
oFInstance.getFeatureID() == featureIDMouseOwner &&
oFInstance.getInstanceName() == sInstanceNameMouseOwner );
}
if (oFeatureMouseOwner==this && this.isHotspotInstanceName(sInstanceNameMouseOwner)) {
var oLNI = this.getLinkInfoFromHotspotInstanceName(sInstanceNameMouseOwner);
if (oLNI) {
var hotspotElem = goN2U.getRawObject(oLNI.getLinkID());
var helperFunction = oRegFeatureMouseOwner.getEventHelperFunction("onmouseover");
if (hotspotElem && helperFunction) {
helperFunction.call(hotspotElem);
}
}
}
}
window.N2FeatureWrapper.prototype.closeAllInstances = function(bImmediate) {
; // gets the wrapped feature, not the instance!  But uncalled, so it's OK.
var oFInstance = this.getWrappedFeatureActiveElement();
if (oFInstance) {
oFInstance.closeNow(bImmediate);
}
}
window.N2FeatureWrapper.prototype.createFeatureInstance = function(oLNI) {
var oWrappingInstance = new N2FInstanceWrapper(this);
oWrappingInstance.assignInstance(oLNI);
var id = oLNI.getFeature() + "|" + oWrappingInstance.getInstanceNameFromLinkInfo(oLNI);
;
this._featureInstances[id] = oWrappingInstance;
return oWrappingInstance;
}
window.N2Events = function() {
this.className = 'N2Events';
this.version = '1.1.0';
this._nextAvailId = 0;
this._oFeatureMouseOwner = null;    // the instance's feature
this._sInstanceNameMouseOwner = ""; // the instance name
this._nParentSeeks=3;
this._bAnalyzeHREFs=false;
this._sAutoFeatureID='autoexp';
this._featureChangedTimer = null;
this._featureRegistry = new Object();
this.fSEMISTATIC = N2Events.fSEMISTATIC;
this.fSTATICWITHCLOSE = N2Events.fSTATICWITHCLOSE;
this.initialize = function()
{
if (!this._initialized) {
; // safety net failed
this._initialized = true;
N2ChainEventHandler('onmousemove',
function(evt) {
evt = (evt) ? evt : window.event;
if (typeof goN2Events == "object") {
goN2Events._mouseMoved(evt);
}
},
'N2EventsMouse');
;
} else {
;
}
}
this.registerFeature = function(sFeatureID, featureObjectOrObjectName, mouseOverFn, mouseOutFn, clickFn) {
;
;
var oFeature;
if (typeof featureObjectOrObjectName == "object") {
oFeature = featureObjectOrObjectName;
} else {
var oWrappedFeature = this._evalWrappedFeatureObjectName(featureObjectOrObjectName);
if (oWrappedFeature == null) {
;
return;
}
oFeature = this._getFeatureFromWrappedFeature(oWrappedFeature);
if (!oFeature) {
oFeature = new N2FeatureWrapper(sFeatureID, oWrappedFeature, featureObjectOrObjectName);
}
}
var oRegFeature = new N2RegFeature(oFeature, sFeatureID, mouseOverFn, mouseOutFn, clickFn);
this._featureRegistry[sFeatureID] = oRegFeature;
}
this._evalWrappedFeatureObjectName = function(wrappedFeatureObjectName) {
var oWrappedFeature = null;
try {
oWrappedFeature = eval(wrappedFeatureObjectName);
}
catch (e) {
}
return oWrappedFeature;
}
this.lookupRegFeature = function(sFeatureID) {
return this._featureRegistry[sFeatureID];
}
this.lookupFeature = function(sFeatureID) {
var oRegFeature = this._featureRegistry[sFeatureID];
return (oRegFeature ? oRegFeature.getFeature() : null);
}
this._getFeatureFromWrappedFeature = function(oWrappedFeature) {
for (var sFeatureID in this._featureRegistry) {
var oRegFeature = this._featureRegistry[sFeatureID];
var oFeature = oRegFeature.getFeature();
if (oFeature.getWrappedFeatureObj &&
oFeature.getWrappedFeatureObj() === oWrappedFeature
) {
return oFeature;
}
}
}
this._searchForActiveFeature = function(elementMouse) {
var oFeatureActive = null;
for (var sFeatureID in this._featureRegistry) {
var oFeature = this._featureRegistry[sFeatureID].getFeature();
var oWrappedFeature = oFeature.getWrappedFeatureObj();
if (oWrappedFeature.isStatic()) {
continue;
}
var elementFeature = oFeature.getWrappedFeatureActiveElement();
if (goN2U.elementIsContainedBy(elementMouse, elementFeature)) {
if (oFeatureActive && oFeatureActive!==oFeature) {
;
}
oFeatureActive = oFeature;
}
}
return oFeatureActive;
}
this.setFeatureDelays = function(sFeatureID, nShowAfter, nReachWithin, nCloseAfter) {
var oRegFeature = this._featureRegistry[sFeatureID];
if (!oRegFeature) {
;
return;
}
oRegFeature.setDelays(nShowAfter, nReachWithin, nCloseAfter);
}
this.analyzeHREFS = function(b) { this._bAnalyzeHREFs = b; }
this.setAutoFeatureID = function(s) { this._sAutoFeatureID=s; }
this.broadcastMouseOwner = function(oRegFeatureMouseOwner, sInstanceNameMouseOwner) {
var oFeatureMouseOwner = (oRegFeatureMouseOwner ? oRegFeatureMouseOwner.getFeature() : null);
if (oFeatureMouseOwner!==this._oFeatureMouseOwner || sInstanceNameMouseOwner!=this._sInstanceNameMouseOwner ) {
this._oFeatureMouseOwner = oFeatureMouseOwner;
this._sInstanceNameMouseOwner = sInstanceNameMouseOwner;
for (var sFeatureID in this._featureRegistry) {
var oFeature = this._featureRegistry[sFeatureID].getFeature();
oFeature.notifyMouseOwner(oRegFeatureMouseOwner, sInstanceNameMouseOwner);
}
}
}
this.instanceIsNotMouseOwner = function(oRegFeature, sInstanceName) {
var oFeature = oRegFeature.getFeature();
if (oFeature===this._oFeatureMouseOwner && sInstanceName==this._sInstanceNameMouseOwner ) {
this._oFeatureMouseOwner = null;
this._sInstanceNameMouseOwner = "";
}
}
this._attachEventsToLink = function(elem, name) {
var modified = false;
var nameArray = name.split("|");
if (nameArray.length < N2Events.nMINHOTSPOTNAMECOMPONENTS) {
return false;
}
var sFeatureID = nameArray[0];
var oRegFeature = this.lookupRegFeature(sFeatureID);
if (sFeatureID && oRegFeature) {
;
if (!elem.id) {
elem.setAttribute("id","lnx"+this._nextAvailId);
;
this._nextAvailId++;
}
oRegFeature.attachEventsToLink(elem);
modified = true;
}
return modified;
}
this._mouseMoved = function(evt)
{
;
var name;
var elem;
if (goN2U.bIsIE)
elem = evt.srcElement;
else
elem = evt.target;
var elemBase = elem; // save the element on which the event was generated
if (elem) {
if (!elem.name && this._bAnalyzeHREFs) {
var sHref = elem.href;
if (elem.tagName == 'IMG') {
var i = 2; //this._nParentSeeks;
var parentElem = goN2U.getParentElement(elem);
while ( parentElem && i ) {
if (parentElem.href) {
sHref = parentElem.href;
break;
}
parentElem = goN2U.getParentElement(parentElem);
i--;
}
}
if (sHref) {
var aRE = new Array();
aRE[0] = /\/exec\/obidos\/ASIN\/([^\/]*)\//;
aRE[1] = /\/exec\/obidos\/am\/[^=]+=ASIN\/([^\/]+)/;
aRE[2] = /\/exec\/obidos\/tg\/detail\/-\/([^\/]*)\//;
aRE[3] = /\/exec\/obidos\/am\/[^\/]+\/detail\/-\/([^\/]*)\//;
sHref = unescape(sHref);
for (var i=0;i<aRE.length;i++) {
var aResults = sHref.match(aRE[i]);
if (aResults) {
var sASIN = aResults[1];
var sNameVal = this._sAutoFeatureID + '|a|' + sASIN;
;
elem.name = sNameVal;
break;
}
}
}
} // END bAnalyzeHREFs
if (!elem.name || (typeof elem.name != 'string')) {
var i = this._nParentSeeks;
var parentElem = goN2U.getParentElement(elem);
while ( parentElem && i ) {
if (parentElem.name && (typeof parentElem.name == 'string')) {
elem = parentElem;
break;
}
parentElem = goN2U.getParentElement(parentElem);
i--;
}
}
name = elem.name;
if (name && (typeof name == 'string') && goN2U.isUndefOrNull(elem.onmouseout)) {
if (this._attachEventsToLink(elem, name)) {
;
if (goN2U.bIsIE && elem.getAttribute("onmouseover")){
;
elem.onmouseover();
} else if (elem['onmouseover']){   // Mozillla
;
elem['onmouseover']();
} else {
;
}
}
}
} else {
;
}
var bIsInInstance = false;
var oRegFeature = null;     // non-null if bIsInInstance
var sInstanceName = null;   // non-null if bIsInInstance
if (elem) {
var oFeature = this._searchForActiveFeature(elem); // see fixme comment on _searchForActiveFeature
if (oFeature) {
var oInstance = oFeature.getActiveWrappedFInstance();
;
bIsInInstance = true;
oRegFeature = oInstance.getRegFeatureOpened();
sInstanceName = oInstance.getInstanceName();
}
}
if (!bIsInInstance && elem && elem.name && (typeof elem.name == 'string')) {
var nameArray = elem.name.split("|");
if (nameArray.length >= N2Events.nMINHOTSPOTNAMECOMPONENTS) {
var oLNI = goN2U.getLinkNameInfo(elem.id);
if (oLNI) {
var sFeatureID = oLNI.getFeature();
oRegFeature = this.lookupRegFeature(sFeatureID);
if (oRegFeature) {
var oFeature = oRegFeature.getFeature();
bIsInInstance = true;
sInstanceName = oFeature.getHotspotInstanceName(oLNI);
}
}
}
}
this.broadcastMouseOwner(oRegFeature, sInstanceName);
}
this.addEventHandler = function(eventID, fn) {
var r;
if (window.addEventListener) {
window.addEventListener(eventID, fn, false);
r = true;
} else if (window.attachEvent) {
r = document.attachEvent("on"+eventID, fn);
} else {
;
r = false;
}
;
return r;
}
this.removeEventHandler = function(eventID, fn) {
var r;
if (window.removeEventListener) {
window.addEventListener(eventID, fn, false);
r = true;
} else if (window.detachEvent) {
r = document.detachEvent("on"+eventID, fn);
} else {
;
r = false;
}
;
return r;
}
this.toggleObjects = function(etype, element)
{
var thisLeft;
var thisTop;
var thisRight;
var thisBottom;
if (etype != "hide") {
;
} else {
var oElement = goN2U.getRawObject(element);
if (!oElement) {
;
return;
}
;
thisLeft = goN2U.getObjectLeft(oElement);
thisTop = goN2U.getObjectTop(oElement);
thisRight = thisLeft + goN2U.getObjectWidth(oElement);
thisBottom = thisTop + goN2U.getObjectHeight(oElement);
}
this._checkPopOverObjects("EMBED", etype, thisLeft, thisTop, thisRight, thisBottom);
this._checkPopOverObjects("OBJECT", etype, thisLeft, thisTop, thisRight, thisBottom);
this._checkPopOverObjects("IFRAME", etype, thisLeft, thisTop, thisRight, thisBottom);
if (goN2U.bIsIE) {
this._checkPopOverObjects("select", etype, thisLeft, thisTop, thisRight, thisBottom);
}
}
this._checkPopOverObjects = function(tagName, etype, thisLeft, thisTop, thisRight, thisBottom) {
var myObjs = document.getElementsByTagName(tagName);
var i;
for (i=0; i<myObjs.length; i++) {
var oElem = myObjs[i];
if ((oElem.id && oElem.id.substring(0,4) == '_po_' ) ||
(oElem.name && oElem.name.substring(0,4) == '_po_') ) {
continue;
}
if (tagName.toLowerCase() == 'iframe') {
try {
oElem = goN2U.getIFrameDocument(oElem).body;
} catch(e) {
;
}
}
if (etype != "hide") {
oElem.style.visibility = "visible";
} else {
oElem.style.visibility = this._isFInstanceOverElement(thisLeft, thisTop, thisRight, thisBottom, oElem) ? "hidden" : "visible";
}
}
}
this._isFInstanceOverElement = function(thisLeft, thisTop, thisRight, thisBottom, menuObj)
{
var mL = goN2U.getObjectLeft(menuObj);
var mT = goN2U.getObjectTop(menuObj);
var mR = mL + goN2U.getObjectWidth(menuObj);
var mB = mT + goN2U.getObjectHeight(menuObj);
var pL = thisLeft;
var pT = thisTop;
var pR = thisRight;
var pB = thisBottom;
if ( (mL >= pL) && (mL <= pR) && (mT >= pT) && (mT <= pB) )  return true;
if ( (mL >= pL) && (mL <= pR) && (mB >= pT) && (mB <= pB) )  return true;
if ( (mR >= pL) && (mR <= pR) && (mT >= pT) && (mT <= pB) )  return true;
if ( (mR >= pL) && (mR <= pR) && (mB >= pT) && (mB <= pB) )  return true;
if ( (mL >= pL) && (mL <= pR) && (mT <= pT) && (mB >= pB) )  return true;
if ( (pL >= mL) && (pL <= mR) && (pT >= mT) && (pT <= mB) )  return true;
if ( (pL >= mL) && (pL <= mR) && (pB >= mT) && (pB <= mB) )  return true;
if ( (pR >= mL) && (pR <= mR) && (pT >= mT) && (pT <= mB) )  return true;
if ( (pR >= mL) && (pR <= mR) && (pB >= mT) && (pB <= mB) )  return true;
return false;
}
this.disableFeature = function(featureID, delay) {
var oFeature = this.lookupFeature(featureID);
;
if (oFeature) {
oFeature.disableFeature(nMSDelay);
}
}
this.featureIsDisabled = function(featureID) {
var bDisabled = false;
var oFeature = this.lookupFeature(featureID);
;
if (oFeature) {
bDisabled = oFeature.isDisabled();
}
return bDisabled;
}
this.qaAddIDsToNamedLinks = function() {
var mylinks = document.getElementsByTagName("a");
for (var i=0; i<mylinks.length; i++) {
var name = mylinks[i].getAttribute("name");
if (name && (typeof name == 'string')) {
var nameArray = name.split("|");
if ( nameArray.length>=N2Events.nMINHOTSPOTNAMECOMPONENTS && !mylinks[i].id ) {
mylinks[i].setAttribute("id","lnx"+this._nextAvailId);
;
this._nextAvailId++;
}
}
}
}
this.invokeFeature = function(linkID, bShow, sNameOverride, nFeatureFlags) {
var elem = goN2U.getRawObject(linkID);
if (elem == null) {
;
return;
}
nFeatureFlags |= this.fSTATICWITHCLOSE;
var oLNI = goN2U.getLinkNameInfo(linkID, sNameOverride);
if (!oLNI) {
;
return;
}
var oFeature = this.lookupFeature(oLNI.getFeature());
var oFInstance = oFeature.getFeatureInstance(oLNI);
if (!oFInstance && bShow) {
oFInstance = oFeature.createFeatureInstance(oLNI);
}
if (!oFInstance) {
;
return;
}
if (bShow) {
;
oFInstance.openNow(oLNI, nFeatureFlags);
} else {
;
oFInstance.closeNow();
}
}
this.qaTestFeature = function(sLinkID, bShow, sNameOverride, sFlags){
;
this.invokeFeature(sLinkID, bShow, sNameOverride, sFlags)
}
this.mouseOverHotspotOpen = function(hotspotElement, nFeatureFlags) {
;
var oRegFeature = null;
var oFeature = null;
var sInstanceName;
var oHInstance = null;
var oLNI = goN2U.getLinkNameInfo(hotspotElement.id);
if (oLNI) {
oRegFeature = goN2Events.lookupRegFeature(oLNI.getFeature());
oFeature = oRegFeature.getFeature();
sInstanceName = oFeature.getHotspotInstanceName(oLNI);
oHInstance = oFeature.getHotspotInstance(oLNI);
}
this.broadcastMouseOwner(oRegFeature, sInstanceName);
if (oHInstance) {
oHInstance.mouseOverOpen(oLNI, nFeatureFlags);
} else {
;
}
}
this.mouseOverHotspotTrack = function(hotspotElement) {
;
var oRegFeature = null;
var oFeature = null;
var oHInstance = null;
var sInstanceName;
var oLNI = goN2U.getLinkNameInfo(hotspotElement.id);
if (oLNI) {
oRegFeature = goN2Events.lookupRegFeature(oLNI.getFeature());
oFeature = oRegFeature.getFeature();
sInstanceName = oFeature.getHotspotInstanceName(oLNI);
oHInstance = oFeature.getHotspotInstance(oLNI);
}
this.broadcastMouseOwner(oRegFeature, sInstanceName);
if (oHInstance) {
oHInstance.mouseOverTrack(oLNI);
} else {
;
}
}
this.mouseClickHotspotOpen = function(hotspotElement, nFeatureFlags) {
;
var oRegFeature = null;
var oFeature = null;
var oHInstance = null;
var oLNI = goN2U.getLinkNameInfo(hotspotElement.id);
if (oLNI) {
oRegFeature = goN2Events.lookupRegFeature(oLNI.getFeature());
oFeature = oRegFeature.getFeature();
oHInstance = oFeature.getHotspotInstance(oLNI);
}
this.broadcastMouseOwner(oRegFeature, oFeature.getHotspotInstanceName(oLNI));
if (oHInstance) {
oHInstance.mouseClickOpen(oLNI, nFeatureFlags);
} else {
;//goN2Debug.warning("N2Events mouseClickHotspotOpen -- unknown hotspot '" + (oFeature ? oFeature.getHotspotInstanceName(oLNI) : "") + "'");
}
return false;
}
this.mouseOutHotspotClose = function(hotspotElement) {
;
var oRegFeature = null;
var oFeature = null;
var oHInstance = null;
var oLNI = goN2U.getLinkNameInfo(hotspotElement.id);
if (oLNI) {
oRegFeature = goN2Events.lookupRegFeature(oLNI.getFeature());
oFeature = oRegFeature.getFeature();
oHInstance = oFeature.getHotspotInstance(oLNI);
}
if (oHInstance) {
oHInstance.mouseOutClose(oLNI);
} else {
;//goN2Debug.warning("N2HEvents mouseOutHotspotClose -- unknown hotspot '" +  (oFeature ? oFeature.getHotspotInstanceName(oLNI) : "") + "'");
}
if (oRegFeature) {
this.instanceIsNotMouseOwner(oRegFeature, oFeature.getHotspotInstanceName(oLNI));
}
}
this.mouseOutHotspotTrack = function(hotspotElement) {
;
var oLNI = goN2U.getLinkNameInfo(hotspotElement.id);
if (oLNI) {
var oRegFeature = goN2Events.lookupRegFeature(oLNI.getFeature());
if (oRegFeature) {
this.instanceIsNotMouseOwner(oRegFeature, oRegFeature.getFeature().getHotspotInstanceName(oLNI));
}
}
}
this._getFInstanceFromCallbackArg = function(oFInstanceOrWrappedFeature) {
var oFInstance;
if (!goN2U.objIsInstanceOf(oFInstanceOrWrappedFeature, N2FInstance)) {
var oFeature = this._getFeatureFromWrappedFeature(oFInstanceOrWrappedFeature);
;
oFInstance = oFeature.getActiveWrappedFInstance();
;
} else {
oFInstance = oFInstanceOrWrappedFeature;
;
}
return oFInstance;
}
this.mouseOverFeature = function(oFInstanceOrWrappedFeature) {
;
if (!oFInstanceOrWrappedFeature) {
;
return;
}
var oFInstance = this._getFInstanceFromCallbackArg(oFInstanceOrWrappedFeature);
if (oFInstance) {
this.broadcastMouseOwner(oFInstance.getRegFeatureOpened(), oFInstance.getInstanceName());
oFInstance.mouseOver();
}
}
this.mouseOutFeature = function(oFInstanceOrWrappedFeature) {
;
if (!oFInstanceOrWrappedFeature) {
;
return;
}
var oFInstance = this._getFInstanceFromCallbackArg(oFInstanceOrWrappedFeature);
if (oFInstance) {
this.instanceIsNotMouseOwner(oFInstance.getRegFeatureOpened(), oFInstance.getInstanceName());
oFInstance.mouseOut();
}
}
this.overlayClosed = function(oFInstanceOrWrappedFeature) {
;
if (!oFInstanceOrWrappedFeature) {
;
return;
}
var oFInstance = this._getFInstanceFromCallbackArg(oFInstanceOrWrappedFeature);
oFInstance.overlayClosed();
this.toggleObjects("show");
;
}
this.overlayChanged = function(oFInstanceOrWrappedFeature) {
;
if (!oFInstanceOrWrappedFeature) {
;
return;
}
if (this._featureChangedTimer) {
clearTimeout(this._featureChangedTimer);
}
var oFInstance = this._getFInstanceFromCallbackArg(oFInstanceOrWrappedFeature);
var oElem = oFInstance.getRawObject();
;
if (oElem) {
this._featureChangedTimer = setTimeout("goN2Events._overlayChangedTimerAction('"+oElem.id+"')", 200);
}
}
this._overlayChangedTimerAction = function(sElementID) {
;
this.toggleObjects("show", sElementID);
this.toggleObjects("hide", sElementID);
this._featureChangedTimer = null;
}
}
window.N2Events.fNONSTATIC = 0;
window.N2Events.fSEMISTATIC = 1;
window.N2Events.fSTATICWITHCLOSE = 3;
window.N2Events.nMINHOTSPOTNAMECOMPONENTS = 2; // name="feature|type|key..." must have at least feature and type
window.goN2Events = new N2Events();
goN2Events.initialize();
window.n2InitEvents = function() {
;
}
window.qaAddIDsToNamedLinks = function() { goN2Events.qaAddIDsToNamedLinks(); };
window.n2MouseOverFeature = function(oFInstanceOrWrappedFeature) { goN2Events.mouseOverFeature(oFInstanceOrWrappedFeature); }
window.n2MouseOutFeature = function(oFInstanceOrWrappedFeature) { goN2Events.mouseOutFeature(oFInstanceOrWrappedFeature); }
window.n2OverlayClosed = function(oFInstanceOrWrappedFeature) { goN2Events.overlayClosed(oFInstanceOrWrappedFeature); }
window.n2OverlayChanged = function(oFInstanceOrWrappedFeature) { goN2Events.overlayChanged(oFInstanceOrWrappedFeature); }
window.n2MouseOverHotspotNop = function() {
if (typeof goN2Events == "object") {
return goN2Events.mouseOverHotspotTrack(this);
}
}
window.n2MouseOverHotspot = function() {
if (typeof goN2Events == "object") {
return goN2Events.mouseOverHotspotOpen(this, N2Events.fNONSTATIC);
}
}
window.n2MouseOverHotspotStatic = function() {
if (typeof goN2Events == "object") {
return goN2Events.mouseOverHotspotOpen(this, N2Events.fSTATICWITHCLOSE);
}
}
window.n2MouseOverHotspotSemiStatic = function() {
if (typeof goN2Events == "object") {
return goN2Events.mouseOverHotspotOpen(this, N2Events.fSEMISTATIC);
}
}
window.n2HotspotClick = function() {
if (typeof goN2Events == "object") {
return goN2Events.mouseClickHotspotOpen(this, N2Events.fNONSTATIC);
}
}
window.n2HotspotClickStatic = function() {
if (typeof goN2Events == "object") {
return goN2Events.mouseClickHotspotOpen(this, N2Events.fSTATICWITHCLOSE);
}
}
window.n2HotspotClickSemiStatic = function() {
if (typeof goN2Events == "object") {
return goN2Events.mouseClickHotspotOpen(this, N2Events.fSEMISTATIC);
}
}
window.n2MouseOutHotspotNop = function() {
if (typeof goN2Events == "object") {
goN2Events.mouseOutHotspotTrack(this);
}
}
window.n2MouseOutHotspot = function() {
if (typeof goN2Events == "object") {
if (window.event && event.toElement) {
var grabberId = (goN2U.isDefined(N2SimplePopover) ? N2SimplePopover.sClickGrabberID : goN2U.sAnimationDivID);
if (event.toElement.id == goN2U.sAnimationDivID || event.toElement.id == grabberId) {
;
return;
}
}
goN2Events.mouseOutHotspotClose(this);
}
}
window.n2HotspotDisableFeature = function(nMs, oFInstanceOrWrappedFeature) {
if (typeof goN2Events != "object") {
return;
}
if (!oFInstanceOrWrappedFeature) {
;
return;
}
;
var oFeature;
if (_n2ObjectIsFInstance(oFInstanceOrWrappedFeature)) {
var oFInstance = oFInstanceOrWrappedFeature;
oFeature = oFInstance.getFeature();
} else {
oFeature = goN2Events._getFeatureFromWrappedFeature(oFInstanceOrWrappedFeature);
;
}
oFeature.disableFeature(nMS);
return true;
}
if (window.goN2LibMon) goN2LibMon.endLoad('events');
} // END library code wrapper
n2RunIfLoaded("utilities", n2EventsInitLibrary, "events");