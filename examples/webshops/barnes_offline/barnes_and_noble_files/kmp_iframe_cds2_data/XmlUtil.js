var XmlUtil = {
 /**
 * Create a new Document object. If no arguments are specified,
 * the document will be empty. If a root tag is specified, the document
 * will contain that single root tag. If the root tag has a namespace
 * prefix, the second argument must specify the URL that identifies the
 * namespace.
 */
newDocument: function(rootTagName, namespaceURL) {
  if (!rootTagName) rootTagName = "";
  if (!namespaceURL) namespaceURL = "";
  if (document.implementation && document.implementation.createDocument) {
    // This is the W3C standard way to do it
    return document.implementation.createDocument(namespaceURL, rootTagName, null);
  }
  else { // This is the IE way to do it
    // Create an empty document as an ActiveX object
    // If there is no root element, this is all we have to do
    var doc = new ActiveXObject("Microsoft.XMLDOM");
    // If there is a root tag, initialize the document
    if (rootTagName) {
      // Look for a namespace prefix
      var prefix = "";
      var tagname = rootTagName;
      var p = rootTagName.indexOf(':');
      if (p != -1) {
        prefix = rootTagName.substring(0, p);
        tagname = rootTagName.substring(p+1);
      }
      // If we have a namespace, we must have a namespace prefix
      // If we don't have a namespace, we discard any prefix
      if (namespaceURL) {
        //if (!prefix) prefix = "a0"; // What Firefox uses
      }
      else prefix = "";
      // Create the root element (with optional namespace) as a
      // string of text
      var text = "<" + (prefix?(prefix+":"):"") +  tagname +
          (namespaceURL
           ?(" xmlns:" + prefix + '="' + namespaceURL +'"')
           :"") +
          "/>";
      // And parse that text into the empty document
      doc.loadXML(text);
    }
    return doc;
  }
},

/**
 * Synchronously load the XML document at the specified URL and
 * return it as a Document object
 */

load: function(url) {
    // Create a new document with the previously defined function
    var xmldoc = XmlUtil.newDocument();
    xmldoc.async = false;  // We want to load synchronously
    xmldoc.load(url);      // Load and parse
    return xmldoc;         // Return the document
},

parseXml: function(xml) {
   var dom = null;
   if (window.DOMParser) {
      try { 
         dom = (new DOMParser()).parseFromString(xml, "text/xml"); 
      } 
      catch (e) { dom = null; alert(e); }
   }
   else if (window.ActiveXObject) {
      try {
         dom = new ActiveXObject('Microsoft.XMLDOM');
         dom.async = false;
         if (!dom.loadXML(xml)) // parse error ..

            window.alert(dom.parseError.reason + dom.parseError.srcText);
      } 
      catch (e) { dom = null; }
   }
   else
      alert("cannot parse xml string!");
   return dom;
},

xslTransform:function(xmlUrl,xslUrl,elId) {       
    var xml = XmlUtil.load(xmlUrl);
    var output = null;
    if (typeof XSLTProcessor != "undefined") {
        try { 
            xsl = new XSLTProcessor(); 
            xsl.importStylesheet(XmlUtil.load(xslUrl));
            
            for (var key in XslParams.paramsCollection) {
                xsl.setParameter("",key,XslParams.paramsCollection[key]);
            }   
            output = xsl.transformToFragment(xml, document);
            if (elId) {
                var container = document.getElementById(elId);
                if (container) {
                    container.innerHTML = "";
                    container.appendChild(output);
                }
            }
            if (output)
                return output;
        } 
        catch (e) { 
            return null; 
        }
    }
    else if (window.ActiveXObject) {
        try {
            var xslDoc, docProcessor, docCache;
            xslDoc = new ActiveXObject("MSXML2.FreeThreadedDOMDocument");
            xslDoc.async = false;
            xslDoc.load(xslUrl);
            
            docCache = new ActiveXObject("MSXML2.XSLTemplate");
            docCache.stylesheet = xslDoc;
            
            docProcessor = docCache.createProcessor();
            docProcessor.input = xml;
            
            for (var key in XslParams.paramsCollection) {
                docProcessor.addParameter(key,XslParams.paramsCollection[key]);
            } 
            docProcessor.transform();
            output = docProcessor.output;
            if (elId) {
                var container = document.getElementById(elId);
                if (container)
                    container.innerHTML = output;
            }
            if (output)
                return output
        } 
        catch (e) { 
            return null;
        }
    }
},
/*	This work is licensed under Creative Commons GNU LGPL License.

	License: http://creativecommons.org/licenses/LGPL/2.1/
   Version: 0.9
	Author:  Stefan Goessner/2006
	Web:     http://goessner.net/ 
*/
json2xml: function (o, tab) {
   var toXml = function(v, name, ind) {
      var xml = "";
      if (v instanceof Array) {
         for (var i=0, n=v.length; i<n; i++)
            xml += ind + toXml(v[i], name, ind+"\t") + "\n";
      }
      else if (typeof(v) == "object") {
         var hasChild = false;
         xml += ind + "<" + name;
         for (var m in v) {
            if (m.charAt(0) == "@")
               xml += " " + m.substr(1) + "=\"" + v[m].toString() + "\"";
            else
               hasChild = true;
         }
         xml += hasChild ? ">" : "/>";
         if (hasChild) {
            for (var m in v) {
               if (m == "#text")
                  xml += v[m];
               else if (m == "#cdata")
                  xml += "<![CDATA[" + v[m] + "]]>";
               else if (m.charAt(0) != "@")
                  xml += toXml(v[m], m, ind+"\t");
            }
            xml += (xml.charAt(xml.length-1)=="\n"?ind:"") + "</" + name + ">";
         }
      }
      else {
         xml += ind + "<" + name + ">" + v.toString() +  "</" + name + ">";
      }
      return xml;
   }, xml="";
   for (var m in o)
      xml += toXml(o[m], m, "");
   return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
}

};

var XslParams = {
    paramsCollection: {},
    displayParams: function() {
        for (var key in this.paramsCollection) {
            alert("XslParams.paramsCollection['"+key+"'] is " + this.paramsCollection[key])
        }   
    }
}

