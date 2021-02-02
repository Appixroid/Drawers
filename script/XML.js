const _XML_DRAWER_NAME = "XML";
const _XML = new DrawerBase(_XML_DRAWER_NAME);


_XML.parser = new DOMParser();

_XML.parse = function(str) {
	return this.parser.parseFromString(str, "text/xml");
};

_XML.stringify = function(doc)
{
	return doc.documentElement.outerHTML;
};

_XML.init = function(){};

window.getDrawersInstance().loadDrawer(_XML);
