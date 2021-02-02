class XMLHttpRequestBuilder
{
	constructor(request) {
		this.request = request;
	}
	
	build(method, url, headers) {
		this.request.open(method, url, true);
		this.fillHeaders(headers);
		return new BuildedXMLHttpRequest(this.request);
	}
	
	fillHeaders(headers) {
		if(headers !== undefined)
		{
			for(let header in headers)
			{
				this.request.setRequestHeader(header, headers[header]);
			}
		}
	}
};

class BuildedXMLHttpRequest
{
	constructor(request) {
		this.request = request;
		this.AJAX_READY_STATE = 4;
		this.HTTP_SUCCESS_CODE = 200;
	}

	send(data, onSuccess, onError) {
		this.request.onreadystatechange = () => {
			if(this.request.readyState === this.AJAX_READY_STATE)
			{
				if(this.request.status === this.HTTP_SUCCESS_CODE)
				{
					onSuccess(this.request.responseText);
				}
				else
				{
					onError(this.request.status);
				}
			}
		};

		this.request.send(data);
	}
};

class FetchRequestBuilder
{
	constructor() {
	}
	
	build(method, url, headers) {
		var options = {
			method: method,
			headers: this.buildHeaders(headers),
			mode: 'cors',
			cache: 'default'
		};
	
		return new BuildedFetchRequest(url, options);
	}
	
	buildHeaders(headersData) {
		let headers = new Headers();
		
		if(headers !== undefined)
		{
			for(let header in headersData)
			{
				headers.append(header, headersData[header]);
			}
		}
		return headers;
	}
}; 

class BuildedFetchRequest
{
	constructor(url, options)
	{
		this.url = url;
		this.options = options;
	}
	
	send(data, onSuccess, onError) {
		if(data !== undefined)
		{
			this.options.body = data;
		}
		
		fetch(this.url, this.options).then(response => {
			if(response.ok)
			{
				response.text().then(result => {
					onSuccess(result);			
				});
			}
			else
			{
				onError("Network Error");
			}
		}).catch(error => {
			onError(error);
		});
	}
};

const _AJAX_DRAWER_NAME = "ajax";
const _Ajax = new DrawerBase(_AJAX_DRAWER_NAME);

_Ajax.GET_METHOD = "GET";
_Ajax.POST_METHOD = "POST";

_Ajax.URL_KEY_VALUE_SEPARATOR = "=";
_Ajax.URL_ATTRIBUTE_SEPARATOR = "&";
_Ajax.URL_QUERY_STRING_SEPARATOR = "?";

_Ajax.urlEncode = function(data) {
	let url = "";
	
	if(data !== undefined)
	{
		for(let key in data)
		{
			url += key + this.URL_KEY_VALUE_SEPARATOR + data[key] + this.URL_ATTRIBUTE_SEPARATOR;
		}
	}
	
	return url.endsWith(this.URL_ATTRIBUTE_SEPARATOR) ? url.substring(0, url.length - 1) : url;
};

_Ajax.toFormData = function(data) {
	let formData = new FormData();
	
	if(data !== undefined)
	{
		for(let key in data)
		{
			formData.append(key, data[key]);
		}
	}
	
	return formData;
};

_Ajax.getRequestBuilder = function() {
	if(window.fetch)
	{
		return new FetchRequestBuilder();
	}	
	else if (window.XMLHttpRequest)
	{
		return new XMLHttpRequestBuilder(new XMLHttpRequest());
	}
	else
	{
		return new XMLHttpRequestBuilder(new ActiveXObject("Microsoft.XMLHTTP"));
	} 
};

_Ajax.request = function(method, url, postData, additionalHeaders, onSuccess, onError) {
	let requestBuilder = this.getRequestBuilder();
	let request = requestBuilder.build(method, url, additionalHeaders);
	
	if(onSuccess === undefined && onError === undefined)
	{
		return new Promise((success, error) => {
			request.send(postData, success, error);
		});
	}
	else
	{
		request.send(postData, success, error);
	}
};

_Ajax.get = function(url, data, additionalHeaders) {
	let fullUrl = url;
	
	if(data !== undefined)
	{
		fullUrl = url + this.URL_QUERY_STRING_SEPARATOR + this.urlEncode(data);
	}
	
	return this.request(this.GET_METHOD, fullUrl, undefined, additionalHeaders);
};

_Ajax.post = function(url, data, additionalHeaders) {
	return this.request(this.POST_METHOD, url, this.toFormData(data), additionalHeaders);
};

_Ajax.init = function() {};

window.getDrawersInstance().loadDrawer(_Ajax);
