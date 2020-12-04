const _TRIGGER_DRAWER_NAME = "trigger";
const _Trigger = new DrawerBase(_TRIGGER_DRAWER_NAME);

_Trigger.TRIGGER_ATTRIBUTE = "trigger";
_Trigger.TRIGGER_STYLE_ATTRIBUTE = "trigger-style";

_Trigger.triggers = {};
_Trigger.triggerStyles = {};

_Trigger.listenForTrigger = function(element)
{
	let targetId = element.getAttribute(this.TRIGGER_ATTRIBUTE);
	
	let triggerStyle = element.getAttribute(this.TRIGGER_STYLE_ATTRIBUTE);
	triggerStyle = (typeof triggerStyle !== "undefined") ? triggerStyle : "block";
	
	let target = document.getElementById(targetId);
	
	this.triggers[targetId] = target;
	this.triggerStyles[targetId] = triggerStyle;
	target.style.display = "none";
	
	element.addEventListener("click", (event) => {
		let element = event.target;
		
		while(!element.hasAttribute(this.TRIGGER_ATTRIBUTE))
		{
			element = element.parentNode;
		}
		
		this.triggerElement(element);
	});
}

_Trigger.triggerElement = function(source)
{
	for(let triggerId in this.triggers)
	{
		this.triggers[triggerId].style.display = "none";
	}

	let triggerId = source.getAttribute(this.TRIGGER_ATTRIBUTE);
	this.triggers[triggerId].style.display = this.triggerStyles[triggerId];
}

_Trigger.init = function()
{
	document.querySelectorAll("[" + this.TRIGGER_ATTRIBUTE + "]").forEach(element => {
		this.listenForTrigger(element);
	});
};

window.getDrawersInstance().loadDrawer(_Trigger);
