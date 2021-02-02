function ContextMenuItem(text, callback, icon =  "", style = {})
{
	this.text = text;
	this.callback = callback;
	this.activeTarget = null;	
	
	this.toElement = function()
	{
		let container = document.createElement("span");
		container.style.cursor = "pointer";
		container.style.width = "calc(100% - 1em)";
		container.style.display = "flex";
		container.style.flexDirection = "row";
		container.style.alignItems = "center";
		container.style.padding = "0.5em";
		
		for(let rule in style)
		{
			container.style[rule] = style[rule];
		}
		
		container.addEventListener("click", (event) => { this.callback(this.activeTarget, event.clientX, event.clientY); });
		container.addEventListener("mouseover", () => { container.style.background = "rgba(0, 0, 0, 0.1)"});
		container.addEventListener("mouseout", () => { container.style.background = "none"});
				
		let image = document.createElement("img");
		image.src = icon;
		image.style.width = "1em";
		image.style.height = "1em";
		image.style.marginRight = "0.5em";
		
		if(icon.length == 0)
		{
			image.style.visibility = "hidden";
		}
		
		container.appendChild(image);
		
		let content = document.createElement("span");
		content.innerHTML = text;
		content.style.width = "calc(100% - 1.5em)";
		container.appendChild(content);
		
		return container;
	};
}

function ContextMenuLink(text, url, icon =  "", style = {})
{
	this.text = text;
	this.url = url;
	this.activeElement = null;
	
	this.toElement = function() {
		let container = document.createElement("a");
		container.style.cursor = "pointer";
		container.style.width = "calc(100% - 1em)";
		container.style.display = "flex";
		container.style.flexDirection = "row";
		container.style.alignItems = "center";
		container.style.padding = "0.5em";
		
		for(let rule in style)
		{
			container.style[rule] = style[rule];
		}
		
		container.href = url;
		
		container.addEventListener("mouseover", () => { container.style.background = "rgba(0, 0, 0, 0.1)"});
		container.addEventListener("mouseout", () => { container.style.background = "none"});
				
		let image = document.createElement("img");
		image.src = icon;
		image.style.width = "1em";
		image.style.height = "1em";
		image.style.marginRight = "0.5em";
		
		if(icon.length === 0)
		{
			image.style.visibility = "hidden";
		}
		
		container.appendChild(image);
		
		let content = document.createElement("span");
		content.innerHTML = text;
		content.style.width = "calc(100% - 1.5em)";
		container.appendChild(content);
		
		return container;
	};
}

function ContextMenuSeparator(style = {})
{
	this.activeElement = null;
	
	this.toElement = function() {
		let element = document.createElement("hr");
		element.style.width = "100%";
		element.style.border = "none";
		element.style.borderTop = "solid 1px rgba(0, 0, 0, 0.3)";
		element.style.margin = "0";
		
		for(let rule in style)
		{
			element.style[rule] = style[rule];
		}
		
		return element;
	};
}

function ContextMenu(name)
{
	this.name = name;
	this.content = [];
	this.activeTarget = null;
	
	this.addItem = function(item){
		this.content.push(item);
	};
	
	this.addSeparator = function(){
		this.content.push(new ContextMenuSeparator());
	};
	
	this.setActiveTarget = function(element){
		this.activeTarget = element;
		this.content.forEach((item) => { item.activeTarget = this.activeTarget; });
	};
	
	this.toElement = function(x, y)
	{
		let element = document.createElement("div");
		element.id = _CONTEXT_DRAWER_NAME;
		
		element.style.display = "flex";
		element.style.flexDirection = "column";
		element.style.alignItems = "start";
		element.style.justifyContent = "start";

		element.style.fontSize = "0.75em";
		element.style.backgroundColor = "white";
		element.style.color = "black";
		element.style.border = "solid 1px black";
		element.style.borderRadius = "0.5em";
		
		element.style.minWidth = "250px";
		element.style.position = "absolute";
		element.style.left = x + "px";
		element.style.top = y + "px";
		
		this.content.forEach(item => {
			element.appendChild(item.toElement());
		});
		
		return element;
	};
}

const _CONTEXT_DRAWER_NAME = "context";
const _Context = new DrawerBase(_CONTEXT_DRAWER_NAME);

_Context.NO_CONTEXT_ATTRIBUTE = "nocontext";
_Context.CONTEXT_ATTRIBUTE = "contextmenu";

_Context.contexts = {};
_Context.addContextMenu = function(contextMenu)
{
	this.contexts[contextMenu.name] = contextMenu;
};

_Context.disableContext = function(element)
{
	element.addEventListener("contextmenu", function(event){
		event.preventDefault();
		event.stopPropagation();
	});
};

_Context.addContextListener = function(element)
{
	let contextMenu = this.contexts[element.getAttribute(this.CONTEXT_ATTRIBUTE)];
	
	element.addEventListener("contextmenu", function(event){
		event.preventDefault();
		event.stopPropagation();
		
		window.getDrawersInstance().getDrawer(_CONTEXT_DRAWER_NAME).removeContextMenu();
		
		contextMenu.setActiveTarget(element);
		document.body.appendChild(contextMenu.toElement(event.clientX, event.clientY));
	});
	
	element.addEventListener("click", function(event){
		window.getDrawersInstance().getDrawer(_CONTEXT_DRAWER_NAME).removeContextMenu();
	});
};

_Context.init = function()
{
	document.querySelectorAll("[" + this.NO_CONTEXT_ATTRIBUTE + "]").forEach((element) => { this.disableContext(element); });
	document.querySelectorAll("[" + this.CONTEXT_ATTRIBUTE + "]").forEach((element) => { this.addContextListener(element); });
};

_Context.removeContextMenu = function()
{
	let openedContext = document.getElementById(_CONTEXT_DRAWER_NAME);
	if(openedContext !== null)
	{
		openedContext.remove();
	}
};

window.getDrawersInstance().loadDrawer(_Context);
window.addEventListener("click", function(){
		window.getDrawersInstance().getDrawer(_CONTEXT_DRAWER_NAME).removeContextMenu();
});
