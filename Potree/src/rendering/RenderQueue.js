

function RenderQueue(){
	this.nodes = new Array();
	this.lights = new Array();
}

RenderQueue.prototype.setup = function(scene){
	this.camera = scene.activeCamera;
	this.nodes = new Array();
	var stack = new Array();
	stack.push(scene.rootNode);
	while(stack.length != 0){
		var node = stack.pop();
		this.nodes.push(node);
		for(var key in node.children) {
			stack.push(node.children[key]);
		}
		
		if(node instanceof Light){
			this.lights.push(node);
		}
	}
	
	
};