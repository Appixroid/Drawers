const _AJAX_DRAWER_NAME = "ajax";
const _Ajax = new DrawerBase(_AJAX_DRAWER_NAME);

_Ajax.GET_METHOD = "GET";
_Ajax.POST_METHOD = "POST";

_Ajax.URL_KEY_VALUE_SEPARATOR = "=";
_Ajax.URL_ATTRIBUTE_SEPARATOR = "&";
_Ajax.URL_QUERY_STRING_SEPARATOR = "?";

_Ajax.AJAX_READY_STATE = 4;
_Ajax.HTTP_SUCCESS_CODE = 200;

_Ajax.getCorrectRequestObject = function()
{
	if (window.XMLHttpRequest)
	{
		return new XMLHttpRequest();
	}
	else
	{
		return new ActiveXObject("Microsoft.XMLHTTP");
	} 
};

_Ajax.fillHeadersOfRequest = function(headers, request)
{
	for(let header in headers)
	{
		request.setRequestHeader(header, headers[header]);
	}
};

_Ajax.urlEncode = function(data)
{
	let url = "";
	
	for(let key in data)
	{
		url += key + this.URL_KEY_VALUE_SEPARATOR + data[key] + this.URL_ATTRIBUTE_SEPARATOR;
	}
	
	return url.endsWith(this.URL_ATTRIBUTE_SEPARATOR) ? url.substring(0, url.length - 1) : url;
};

_Ajax.request = function(method, url, postData, onSuccess, onError, additionalHeaders = {})
{
	let request = this.getCorrectRequestObject();
	request.open(method, url, true);
	this.fillHeadersOfRequest(additionalHeaders, request);
	
	const AJAX_READY_STATE = this.AJAX_READY_STATE;
	const HTTP_SUCCESS_CODE = this.HTTP_SUCCESS_CODE;
	
	request.onreadystatechange = function() {
		if(this.readyState == AJAX_READY_STATE)
		{
			if(this.status == HTTP_SUCCESS_CODE)
			{
				onSuccess(this.responseText);
			}
			else
			{
				onError(this.status);
			}
		}
	};
	
	if(method == this.POST_METHOD)
	{
		request.send(postData);
	}
	else
	{
		request.send();
	}
};

_Ajax.get = function(url, data, onSuccess, onError, additionalHeaders = {})
{
	this.request(this.GET_METHOD, url + this.URL_QUERY_STRING_SEPARATOR + this.urlEncode(data), "", onSuccess, onError, additionalHeaders);
};

_Ajax.post = function(url, data, onSuccess, onError, additionalHeaders = {})
{
	this.request(this.POST_METHOD, url, this.urlEncode(data), onSuccess, onError, additionalHeaders);
};

_Ajax.init = function()
{
};

window.getDrawersInstance().loadDrawer(_Ajax);
