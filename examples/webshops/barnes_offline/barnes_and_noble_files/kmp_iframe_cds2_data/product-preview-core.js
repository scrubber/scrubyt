var ProductPreview =  {
    previewObj:null,
    windowObj:null,
    target:null,
    triggerTimer:null,
    targetTimer:null,
    findIsbnRE:new RegExp("(?:EAN|ISBN)=([0-9X]{10,13})&?", "i"),
    params: null,
    stylesheet:null,
    isShowing:false,
    productInCart:null,
    initialize:function() {
        if (xslStyleSheet)
            this.stylesheet = XmlUtil.parseXml(xslStyleSheet);
	    var links = document.getElementsByTagName("A");
	    for (var i=0; i<links.length; i++) {
	        var link = links[i];
	        if ((link.href.toLowerCase().indexOf("/search/product.asp") >= 0 || link.href.toLowerCase().indexOf("/booksearch/isbninquiry.asp") >= 0) && 
	        link.href.toLowerCase().indexOf("pv=y") > 0) {
		        link.onmouseover = function(){ProductPreview.triggerMouseOver(this)}; 
		        link.onmouseout = function(){ProductPreview.triggerMouseOut()};
	        }
	    }
	    // pwbab
	    var pwbab = document.getElementById("customerBought");
	    if (pwbab) {
	        var pwbLinks = pwbab.getElementsByTagName("A");
	        for (var i=0; i<pwbLinks.length; i++) {
		        pwbLinks[i].onmouseover = function(){ProductPreview.triggerMouseOver(this)}; 
		        pwbLinks[i].onmouseout = function(){ProductPreview.triggerMouseOut()};
	        }
	    }     
    },
    addEvent:function(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
        }
    },
    loadScript:function(url, id){
	    var script = document.getElementById(id);
	    if (script) {
		    script.parentNode.removeChild(script);
	    }
	    script = document.createElement("script");
	    script.type = "text/javascript";
	    script.id = id;	
	    script.src = url;
	    document.getElementsByTagName("head")[0].appendChild(script);
    },
    runXSL:function(JSONObj) {
        if (!(JSONObj.xml && JSONObj.xml.length > 0)) return;
        
        var xslDOM = this.stylesheet;
        var xml = XmlUtil.parseXml(JSONObj.xml);
        
        try {    
            this.addParamsToXml(xml);
        }
        catch (e) {}
        
        var output = null;

        if (typeof XSLTProcessor != "undefined") {
            try { 
                xsl = new XSLTProcessor(); 
                xsl.importStylesheet(xslDOM);
                output = xsl.transformToFragment(xml, document);

                this.windowObj.document.getElementById("previewContent").innerHTML = "";
                this.windowObj.document.getElementById("previewContent").appendChild(output);
                
                ProductPreview.renderDeliveryMessage();
            } 
            catch (e) { output = null; }
        }
        else if (window.ActiveXObject) {
            try {
                output = xml.transformNode(xslDOM);
                this.windowObj.document.getElementById("previewContent").innerHTML = output;
            } 
            catch (e) { output = null; }
        }
        if (output!=null) {
            ProductPreview.positionPreview();
        }
    },
    renderDeliveryMessage:function() {
        // XSL in non-IE browsers doesn't support disable output escaping - delivery message contains &lt; and &gt;
        var w = this.windowObj;
        if (w.document.getElementById("deliveryMessage") && w.document.getElementById("deliveryMessage").textContent)
            w.document.getElementById("deliveryMessage").innerHTML = w.document.getElementById("deliveryMessage").textContent;
    },
    createPreview:function(){
        this.previewObj = this.windowObj.document.getElementById("previewObj");
    
        if(!this.previewObj) {
		    this.previewObj = this.windowObj.document.createElement("DIV");
		    this.previewObj.id = "previewObj";
		    this.windowObj.document.body.appendChild(ProductPreview.previewObj);
		    this.previewObj.innerHTML = "<div class=\"dropshadow\"><div class=\"previewContent\" id=\"previewContent\"></div></div>";
		    
      		this.previewObj.onmouseover = function(){ProductPreview.targetMouseOver()};
            this.previewObj.onmouseout = function(){ProductPreview.targetMouseOut()};
            this.previewObj.onclick = function(){ProductPreview.hidePreview()};
	    }
	    this.windowObj.document.getElementById("previewContent").innerHTML = "";
	    ProductPreview.hidePreview();
    },
    hideDelay:500,
    triggerMouseOver:function(link) {
        this.targetTimer = clearTimeout(this.targetTimer);
        this.triggerTimer = clearTimeout(this.triggerTimer);
        this.triggerTimer = setTimeout(function(){ProductPreview.showPreview(link)},300);
    },
    triggerMouseOut:function() {
        this.triggerTimer = clearTimeout(this.triggerTimer);
        this.targetTimer = setTimeout(function(){ProductPreview.hidePreview()}, this.hideDelay);
    },
    showPreview:function(link){    
        if (this.isShowing) return; 
        this.isShowing = true;
        
        if (this.target==null || this.target != link) {
            this.target = link;
            this.params = this.target.search; // get the querystring attached
            
            this.windowObj = window;
            if (ProductPreview.isInFrame() && window.parent) 
                this.windowObj = window.parent;
            
            ProductPreview.createPreview();
            ProductPreview.callService();
        }
        else if (this.windowObj.document.getElementById("previewContent").innerHTML != "") {
            ProductPreview.hidePreview();
            ProductPreview.positionPreview();
        }       
    },
    targetMouseOver:function() {
        this.targetTimer = clearTimeout(this.targetTimer);
    },
    targetMouseOut:function() {    
        this.targetTimer = setTimeout(function(){ProductPreview.hidePreview()}, this.hideDelay);
    },
    hidePreview:function(){  
        this.isShowing   = false;          
        this.targetTimer = clearTimeout(this.targetTimer);
    
        if (this.previewObj) {    
            this.previewObj.style.display="none";
            this.previewObj.style.top = "";
            this.previewObj.style.left = "";
        }
    },
    callService:function(){
        var ean;
        var link = this.target;
	    var found = link.href.match(ProductPreview.findIsbnRE);
	    if (found && found.length==2)
		    ean = found[1];
    	
	    if (typeof hostname=="undefined") hostname = "http://services.barnesandnoble.com/v01_00/";
	    var serviceParams = ean + "&AppId=tempid&bnoutput=jsonstring&bncallback=callbackfunction&ProductDetail=Brief";
    	
        var url;
        if (link.href.indexOf("videogames")>-1)
            url = "";
        else if (link.href.indexOf("/search/product.asp")>-1)
            url = hostname + "MediaLookup?EANs=" + serviceParams;
        else
            url = hostname + "BookLookup?EANs=" + serviceParams;
        
        if (url!="" && ean!=null) {
            if (ean.length<=10) {
				//Convert the ISBN-10 to ISBN-13
				ISBN13 = '978' + ean.toString();				// prefix the default for ISBN10-to-13 numbers
				ISBN13 = ISBN13.substring(0, 12);				// get the first 12 numbers in the string
				weight = new Array(1,3,1,3,1,3,1,3,1,3,1,3);	// make an array of weights to multiply with
				var total = 0;	for ( var i=0; i<12; i++ ) {	// loop the string and build the total with the weights array
					t = ISBN13.charAt(i);						
					total += t * weight[i];
				}
				check = (total % 10);							// the check number is the modulus...
				check = 10 - check;								// ... subtrackted from 10	
				if ( check == 10 ) check = 0;					// and perhaps one decimal level back
				ProductPreview.checkCart(ISBN13 + check.toString());
			} else {
				ProductPreview.checkCart(ean);
			}
            ProductPreview.loadScript(url, "productLookup");
        }
    },
    positionPreview:function(){
        this.previewObj.style.display="";
        
	    var topPos = 0, leftPos = 0;
        var rePositionLeft = false, rePositionTop = false;
        var offSets = ProductPreview.getOffsets(this.target);
        var spacing = this.target.offsetWidth/2;
        leftPos = offSets.offsetLeft + 4 + spacing;    
	    topPos = offSets.offsetTop + this.target.offsetHeight + 4;
    	
	    if (ProductPreview.isInFrame()) {
	        var iframeObj = ProductPreview.getIFrameReference(window);
		    if (iframeObj) {
		        var iframeOffsets = ProductPreview.getOffsets(iframeObj);
			    leftPos += iframeOffsets.offsetLeft;
			    topPos += iframeOffsets.offsetTop;
		    }
	    }
    		
	    var windowDim = ProductPreview.getWindowScroll();
	    var w = 750; // fixed width layout ignore windowDim.width;
    	
	    var spaceWidth =  w - leftPos;
        rePositionLeft = spaceWidth < 320;
    	
	    var t = windowDim.top;
	    var h = windowDim.height;
	    var heightTooltip = this.previewObj.clientHeight;
    	
	    if (t+h-topPos < heightTooltip) {
	        topPos = topPos - this.target.offsetHeight - heightTooltip;
	        rePositionTop = true;
	    }
    	
	    if (!rePositionLeft) {
	        this.previewObj.style.top = topPos + "px";
	        this.previewObj.style.left = leftPos + "px";
	    }
	    else {
	        this.previewObj.style.left = leftPos - spacing - this.previewObj.clientWidth + "px";
	        if (!rePositionTop)
	            this.previewObj.style.top = topPos - this.target.offsetHeight + "px";
	        else
	             this.previewObj.style.top = topPos + this.target.offsetHeight + "px";
	    }
    },
    getOffsets:function(inputObj){
        var oL = 0, oT = 0; 
        while(inputObj) {
            oL += inputObj.offsetLeft || 0;
		    oT += inputObj.offsetTop || 0;
		    inputObj = inputObj.offsetParent;
        }
        return { offsetLeft: oL, offsetTop: oT }
    },
    // from script.aculo.us
    getWindowScroll:function(){
        var w = this.windowObj;
        var T, L, W, H;
        with (w.document) {
            if (w.document.documentElement && documentElement.scrollTop) {
              T = documentElement.scrollTop;
              L = documentElement.scrollLeft;
            } else if (w.document.body) {
              T = body.scrollTop;
              L = body.scrollLeft;
            }
            if (w.innerWidth) {
              W = w.innerWidth;
              H = w.innerHeight;
            } else if (w.document.documentElement && documentElement.clientWidth) {
              W = documentElement.clientWidth;
              H = documentElement.clientHeight;
            } else {
              W = body.offsetWidth;
              H = body.offsetHeight
            }
        }
        return { top: T, left: L, width: W, height: H };
    },
    isInFrame:function(){
        if (this.target.href.indexOf("inframe=y")>-1)
            return true;
        return false;
    },
    // from http://www.mojavelinux.com/cooker/demos/domTT/domLib.js
    getIFrameReference:function(in_frame){
	    if (in_frame.frameElement)
		    return in_frame.frameElement;
	    else {
		    var name = in_frame.name;
		    if (!name || !in_frame.parent) {
			    return null;
		    }
		    var candidates = in_frame.parent.document.getElementsByTagName("iframe");
		    for (var i = 0; i < candidates.length; i++) {
			    if (candidates[i].name == name) {
				    return candidates[i];
			    }
		    }
		    return null;
	    }
    },
    addParamsToXml:function(xml){
        var root = xml.getElementsByTagName("Product")[0];
        var paramsNode = xml.createElement("params");
        paramsNode.appendChild(xml.createTextNode(this.params));
        root.appendChild(paramsNode);
        var shophostNode = xml.createElement("shophost");
        shophostNode.appendChild(xml.createTextNode(this.windowObj.vc_shophost));
        root.appendChild(shophostNode);
        var slinkprefixNode = xml.createElement("slinkprefix");
        slinkprefixNode.appendChild(xml.createTextNode(this.windowObj.vc_slinkprefix));
        root.appendChild(slinkprefixNode);
        var itemAddedNode = xml.createElement("itemadded");
        itemAddedNode.appendChild(xml.createTextNode(this.productInCart));
        root.appendChild(itemAddedNode);
    },
    checkCart:function(prodid){
        this.productInCart = "n";
        
        if (this.windowObj.vc_get_prodids) {
	        this.windowObj.vc_get_prodids();
	        for (var counter=0; counter < this.windowObj.vc_prodids.length; counter++) {
		        if (prodid.indexOf(this.windowObj.vc_prodids[counter])>-1) {
                    this.productInCart = "y";
				    return;
			    }
	        }
	    }
    }
    
} // end 

function callbackfunction(response){
    if (response)
        ProductPreview.runXSL(response);
}

if (typeof XSLTProcessor != "undefined" || window.ActiveXObject) {
    loadCss('http://images.barnesandnoble.com/css/product-preview.css');
    ProductPreview.addEvent(window, "load", function(){ProductPreview.initialize()});
}