const _MOVABLE_DRAWER_NAME = "movable";
const _Movable = new DrawerBase(_MOVABLE_DRAWER_NAME);

_Movable.CONTINUOUS = "continuous";
_Movable.TELEPORT = "teleport";

_Movable.TARGET_ATTRIBUTE = "movetarget";
_Movable.LANDING_ATTRIBUTE = "movableon";
_Movable.STYLE_ATTRIBUTE = "movingstyle";
_Movable.IMAGE_ATTRIBUTE = "movingsrc";
_Movable.OVERLAP_ATTRIBUTE = "dropoverlap";

_Movable.movingEffect = "move";

_Movable.moveElementDuringDrag = function(event)
{
	let data = JSON.parse(event.dataTransfer.getData("text/plain"));

	let landingAreaId = data.landing;
	let targetId = data.target;	
	let currentElementId = event.target.id;
	
	if(landingAreaId == currentElementId || (data.overlap && targetId == currentElementId))
	{
		let element = document.getElementById(targetId);
		element.style.top = event.clientY + "px";
		element.style.left = event.clientX + "px";
	}
};

_Movable.addMover = function(element)
{
	let targetId = element.getAttribute(this.TARGET_ATTRIBUTE) || element.id;
	let landingAreaId = element.getAttribute(this.LANDING_ATTRIBUTE);
	let landingArea = document.getElementById(landingAreaId);
	let movementStyle = element.getAttribute(this.STYLE_ATTRIBUTE);
	let dropOverlap = element.getAttribute(this.OVERLAP_ATTRIBUTE);
	
	element.setAttribute("draggable", "true");

	element.addEventListener("dragstart", function(event){		
		let data = {
			overlap: dropOverlap == "true",
			target: targetId,
			landing: landingAreaId
		};
		
		event.dataTransfer.setData("text/plain", JSON.stringify(data));
		event.dataTransfer.dropEffect = this.movingEffect;
		
		let movingSrc = element.getAttribute(this.IMAGE_ATTRIBUTE);
		if(movingSrc != null && movingSrc != "")
		{
			ev.dataTransfer.setDragImage(movingSrc, 0, 0)
		}
	});
	
	landingArea.setAttribute("droppable", "true");
	
	let useContinuousMovement = movementStyle == this.CONTINUOUS;
	landingArea.addEventListener("dragover", function(event){
		event.preventDefault();
		
		if(useContinuousMovement)
		{
			window.getDrawersInstance().getDrawer(_MOVABLE_DRAWER_NAME).moveElementDuringDrag(event);
		}
	});
	
	landingArea.addEventListener("drop", function(event){
		event.preventDefault();
		window.getDrawersInstance().getDrawer(_MOVABLE_DRAWER_NAME).moveElementDuringDrag(event);
	});
};

_Movable.init = function()
{
	document.querySelectorAll("[" + this.LANDING_ATTRIBUTE + "]").forEach(function(element){
		this.addMover(element);
	});
};

window.getDrawersInstance().loadDrawer(_Movable);
