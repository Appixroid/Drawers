class _RSSElement
{	
	getData(name) {
		for(let child of this.element.children)
		{
			if(child.tagName === name)
			{
				return child;
			}
		}
		
		return null;
	}
	
	getContent(name){	
		return this.getData(name)?.innerHTML ?? undefined;
	}
	
	getDetail(name, detail) {
		return this.getData(name)?.getAttribute(detail) ?? undefined;
	}
	
	asElement() {
		return this.element;
	}
	
	getTitle() {
		return this.getContent("title");
	}
	
	getLink() {
		return this.getContent("link");
	}
	
	getDescription() {
		return this.getContent("description");
	}
	
	getDate() {
		return this.getContent("pubDate");
	}
}

class _RSSReader extends _RSSElement
{
	constructor(data) {
		super();
		
		this.listeners = {};
		
		this.document = null;
		this.element = null;
	
		const XML = window.getDrawersInstance().getDrawer("XML");
		
		if(data.startsWith("http://") || data.startsWith("https://"))
		{
			const ajax = window.getDrawersInstance().getDrawer("ajax");
			
			ajax.get(data, {}, {}).then((result) => {
				this.document = XML.parse(result);
				this.element = this.document.getElementsByTagName("channel")[0];
				this.emitEvent("load", this);
			});
		}
		else
		{
			this.document = XML.parse(data);
			this.element = this.document.getElementByTagName("channel")[0];
			this.emitEvent("load", this);
		}
	}
	
	isValid() {
		return this.document !== null && this.element !== null;
	}
	
	getLastBuildDate() {
		return this.getContent("lastBuildDate");
	}
	
	getLanguage() {
		return this.getContent("language");
	}
	
	getRoot(){
		return this.document.documentElement;
	}
	
	getItems(){	
		let items = [];
		
		for(let item of this.element.getElementsByTagName("item"))
		{
			items.push(new _RSSItem(item));
		}
		
		return items;
	}
	
	addEventListener(name, action){
		let eventListeners = [];
		
		if(this.listeners[name] !== undefined)
		{
			eventListeners = this.listeners[name];
		}
		
		eventListeners.push(action);
		this.listeners[name] = eventListeners;
	}
	
	emitEvent(name, ...args){
		if(this.listeners[name] !== undefined)
		{
			for(let action of this.listeners[name])
			{
				action(...args);
			}
		}
	}
};

class _RSSItem extends _RSSElement
{
	constructor(item) {
		super();
		this.element = item;
	}
	
	getGUID() {
		return this.getContent("guid");
	}
	
	getAuthor() {
		return this.getContent("author");
	}
	
	getCategory() {
		return this.getContent("category");
	}
	
	getImage() {
		return this.getDetail("media:content", "url");
	}
};

const _RSS_DRAWER_NAME = "RSS";
const _RSS = new DrawerBase(_RSS_DRAWER_NAME);

_RSS.read = function(data) {
	return new _RSSReader(data);
};

_RSS.init = function(){};

window.getDrawersInstance().loadDrawer(_RSS);
