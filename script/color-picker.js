const _COLOR_PICKER_DRAWER_NAME = "color-picker";
const _ColorPicker = new DrawerBase(_COLOR_PICKER_DRAWER_NAME);

_ColorPicker.PICKER_ATTRIBUTE = "color-picker";
_ColorPicker.COLOR_ATTRIBUTE = "color";
_ColorPicker.ID_ATTRIBUTE = "pickerid";

_ColorPicker.EVENT = new Event("change");
_ColorPicker.colorsTitle = "Colors";
_ColorPicker.customTitle = "Custom";

_ColorPicker.showPicker = function(parent, colors = [])
{
	let rect = parent.getBoundingClientRect();
	let id = parent.getAttribute(this.ID_ATTRIBUTE) || "";

	let picker = document.createElement("div");	
	
	picker.id = id;
	
	picker.style.padding = "1%";
	picker.style.maxWidth = "125px";
	picker.style.textAlign = "center";
	picker.style.position = "absolute";
	picker.style.top = (rect.top + (rect.width / 2)) + "px";
	picker.style.left = (rect.left + (rect.height / 2)) + "px";
	picker.style.backgroundColor = "white";
	picker.style.boxShadow = "3px 3px 10px";
	picker.style.borderRadius = "0.25rem";
	
	if(colors.length > 0)
	{
		picker.appendChild(document.createTextNode(this.colorsTitle));
		picker.appendChild(document.createElement("hr"));
		
		let colorsContainer = document.createElement("div");
		colorsContainer.style.display = "flex";
		colorsContainer.style.flexWrap = "wrap";
		colorsContainer.style.alignItems = "space-between";
		
		colors.forEach((color) => {
			let colorElement = document.createElement("span");
			colorElement.style.width = "25px";
			colorElement.style.height = "25px";
			colorElement.style.marginRight = "5px";
			colorElement.style.borderRadius = "0.25rem";
			colorElement.style.backgroundColor = color;
			colorElement.style.cursor = "pointer";
			colorElement.addEventListener("click", () => {
				parent.setAttribute(this.COLOR_ATTRIBUTE, color);
				parent.dispatchEvent(this.EVENT);
				picker.remove();
			});
			colorsContainer.appendChild(colorElement);
		});
		
		picker.appendChild(colorsContainer);
		picker.appendChild(document.createElement("br"));
	}
	
	picker.appendChild(document.createTextNode(this.customTitle));
	picker.appendChild(document.createElement("hr"));
	
	let htmlPicker = document.createElement("input");
	htmlPicker.style.border = "none";
	htmlPicker.style.backgroundColor = "transparent";
	htmlPicker.style.cursor = "pointer";
	htmlPicker.setAttribute("type", "color");
	htmlPicker.value = parent.getAttribute(this.COLOR_ATTRIBUTE);
	htmlPicker.addEventListener("change", (event) => {
		let newColor = event.target.value;
		parent.setAttribute(this.COLOR_ATTRIBUTE, newColor);
		parent.dispatchEvent(this.EVENT);
		picker.remove();
	});
	picker.appendChild(htmlPicker);
	
	let close = document.createElement("span");
	close.style.position = "absolute";
	close.style.top = "0";
	close.style.right = "5px";
	close.style.color = "black";
	close.style.cursor = "pointer";
	close.innerHTML = "✘";
	close.addEventListener("click", () => {
		picker.remove();
	});
	picker.appendChild(close);
	
	document.body.appendChild(picker);
};

_ColorPicker.addPicker = function(element)
{
	let colors = element.getAttribute(this.PICKER_ATTRIBUTE).split(" ");
	element.addEventListener("click", function(event){
		window.getDrawersInstance().getDrawer(_COLOR_PICKER_DRAWER_NAME).showPicker(element, colors);
	});
};

_ColorPicker.init = function()
{
	document.querySelectorAll("[" + this.PICKER_ATTRIBUTE + "]").forEach(function(element){
		this.addPicker(element);
	});
};

window.getDrawersInstance().loadDrawer(_ColorPicker);
