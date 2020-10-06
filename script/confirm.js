const _CONFIRM_DRAWER_NAME = "confirm";
const _Confirm = new DrawerBase(_CONFIRM_DRAWER_NAME);

_Confirm.CONFIRM_ATTRIBUTE = "confirm";

_Confirm.listenForConfirm = function(element)
{
	element.addEventListener("click", (event) => {
		if(confirm(element.getAttribute(this.CONFIRM_ATTRIBUTE)))
		{
			return true;
		}
		else
		{		
			event.preventDefault();
			return false;
		}
	});
}

_Confirm.init = function()
{
	document.querySelectorAll("[" + this.CONFIRM_ATTRIBUTE + "]").forEach(function(element){
		this.listenForConfirm(element);
	});
};

window.getDrawersInstance().loadDrawer(_Confirm);
