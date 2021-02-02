function DrawerBase(name)
{
	this.name = name;
	this.init = function(){};
}

const _Drawers = {
	version: "Drawers 1.0",
	drawers: {},

	loadDrawer: function(o, force = false) {
		if(this.drawers[o.name] === undefined || force)
		{
			this.drawers[o.name] = o;
		}
		else
		{
			throw new Error("The drawer named \"" + name + "\" is already loaded");
		}
	},
	
	getDrawer: function(name) {
		let drawer = this.drawers[name];
		
		if(drawer !== undefined)
		{
			return drawer;
		}
		else
		{
			throw new Error("Cannot access to drawer named \"" + name + "\", the drawer doesn't exist");
		}
	},
	
	initAll: function() {
		for(let drawerName in this.drawers)
		{
			this.drawers[drawerName].init();
		}
	}
};

function getDrawersInstance()
{
	return _Drawers;
}

window.addEventListener("load", function(){
	window.getDrawersInstance().initAll();
});
