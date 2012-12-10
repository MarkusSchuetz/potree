
function Renderer(){
	
};

Renderer.prototype.render = function(scene){
	var renderQueue = new RenderQueue();
	renderQueue.setup(scene);
	
	for(var i = 0; i < renderQueue.lights.length; i++){
		var light = renderQueue.lights[i];
		
		if(light.castShadows){
			this.shadowmapping(light, renderQueue);
		}
	}
	
	Framebuffer.getActiveBuffer().bind();
	Framebuffer.getSystemBuffer().bind();
	
	for(var i = 0; i < renderQueue.nodes.length; i++){
		var node = renderQueue.nodes[i];
		node.render(renderQueue, scene.activeCamera);
	}
};

Renderer.prototype.shadowmapping = function(light, renderQueue){
	if(this.shadowmaps == undefined){
		this.shadowmaps = {};
	}
	if(this.shadowmaps[light.name] == undefined){
		this.shadowmaps[light.name] = new Framebuffer(512, 512);
	}
	
	var oldBuffer = Framebuffer.getActiveBuffer();
	this.shadowmaps[light.name].bind();
	
	var camera = new Camera();
	camera.translate(2,1,10);
	
	renderQueue.preferredMaterial = MaterialManager.getMaterial("depth");
	for(var i = 0; i < renderQueue.nodes.length; i++){
		var node = renderQueue.nodes[i];
		node.render(renderQueue, camera);
	}
	renderQueue.preferredMaterial = null;
	
	oldBuffer.drawTexture(this.shadowmaps[light.name].texture, [ 0.3, 0], [1, 1]);
	
};