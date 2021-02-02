const _SIZABLE_DRAWER_NAME = "resizable";
const _Sizable = new DrawerBase(_SIZABLE_DRAWER_NAME);

_Sizable.RESIZE_ATTRIBUTE = "resize";
_Sizable.STYLE_ATTRIBUTE = "resizestyle";

_Sizable.CONTINUOUS = "continuous";
_Sizable.INSTANT = "instant";

_Sizable.currentResizingData = {target: "", startX: 0, startY: 0};

_Sizable.listenMouseMove = function(event) {
	let sizable = window.getDrawersInstance().getDrawer(_SIZABLE_DRAWER_NAME);
	let data = sizable.currentResizingData;
		
	let target = document.getElementById(data.target);
	let offsetX = event.clientX - data.startX;
	let offsetY = event.clientY - data.startY;
		
	if(event.shiftKey)
	{
		let maxOffset = Math.max(offsetX, offsetY);
		offsetX = maxOffset;
		offsetY = maxOffset;
	}
		
	let newWidth = parseInt(target.style.width) + offsetX;
	let newHeight = parseInt(target.style.height) + offsetY;
		
	target.style.width = newWidth + "px";
	target.style.height = newHeight + "px";
	
	sizable.currentResizingData.startX = event.clientX;
	sizable.currentResizingData.startY = event.clientY;
};

_Sizable.stopListeningMouseMove = function(event) {
	let sizable = window.getDrawersInstance().getDrawer(_SIZABLE_DRAWER_NAME);
	sizable.listenMouseMove(event);
	
	document.body.style.cursor = "auto";

	sizable.currentResizingData.target = "";
	document.body.removeEventListener("mousemove", sizable.listenMouseMove);
	document.body.removeEventListener("mouseup", sizable.stopListeningMouseMove);
}

_Sizable.addResizer = function(element) {
	let targetId = element.getAttribute(this.RESIZE_ATTRIBUTE);
	let isContinuous = element.getAttribute(this.STYLE_ATTRIBUTE) == this.CONTINUOUS;
	
	element.addEventListener("mousedown", function(event){		
		let sizable = window.getDrawersInstance().getDrawer(_SIZABLE_DRAWER_NAME);
		
		sizable.currentResizingData.target = targetId;
		sizable.currentResizingData.startX = event.clientX;
		sizable.currentResizingData.startY = event.clientY;
		
		document.body.style.cursor = window.getComputedStyle(element).cursor;
		
		if(isContinuous)
		{
			document.body.addEventListener("mousemove", sizable.listenMouseMove);
		}
			
		document.body.addEventListener("mouseup", sizable.stopListeningMouseMove);
	});
};

_Sizable.init = function() {
	document.querySelectorAll("[" + this.RESIZE_ATTRIBUTE + "]").forEach(element => {
		this.addResizer(element);
	});
};

window.getDrawersInstance().loadDrawer(_Sizable);
