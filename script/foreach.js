const _FOREACH_DRAWER_NAME = "foreach";
const _Foreach = new DrawerBase(_FOREACH_DRAWER_NAME);

_Foreach.FOREACH_ATTRIBUTE = "foreach";
_Foreach.ASYNC_FOREACH_ATTRIBUTE = "async-foreach";

_Foreach.syncForeach = function(element)
{
	let arrayName = element.getAttribute(this.FOREACH_ATTRIBUTE);
	let array = typeof window[arrayName] === "function" ? window[arrayName]() : window[arrayName];

	this.generateItems(element, array);
}

_Foreach.asyncForeach = function(element)
{
	let arrayName = element.getAttribute(this.ASYNC_FOREACH_ATTRIBUTE);
	
	window[arrayName].then(array => {
		this.generateItems(element, array);
	});
}

_Foreach.generateItems = function(element, array)
{
	let root = element.parentElement;
	element.remove();
	
	for(let item of array)
	{		
		let itemElement = element.cloneNode(true);
		
		for(let key in item)
		{
			var keyMatcher = new RegExp("{{[ \n\t]*" + key + "[ \n\t]*}}", 'g');
			itemElement.innerHTML = itemElement.innerHTML.replaceAll(keyMatcher, item[key]);
		}
		
		root.appendChild(itemElement);
	}
}

_Foreach.init = function()
{
	document.querySelectorAll("[" + this.FOREACH_ATTRIBUTE + "]").forEach(element => {
		this.syncForeach(element);
	});
	
	document.querySelectorAll("[" + this.ASYNC_FOREACH_ATTRIBUTE + "]").forEach(element => {
		this.asyncForeach(element);
	});
};

window.getDrawersInstance().loadDrawer(_Foreach);
