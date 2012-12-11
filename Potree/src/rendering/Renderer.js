
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
	if(light.shadowmap == undefined){
		light.shadowmap = new FramebufferFloat32(512, 512);
	}
	
	var oldBuffer = Framebuffer.getActiveBuffer();
	light.shadowmap.bind();
	
	var camera = new Camera();
	camera.translate(0,1,3);
	
	renderQueue.preferredMaterial = MaterialManager.getMaterial("depth");
	for(var i = 0; i < renderQueue.nodes.length; i++){
		var node = renderQueue.nodes[i];
		node.render(renderQueue, camera);
	}
	renderQueue.preferredMaterial = null;
	
	oldBuffer.drawTexture(light.shadowmap.texture, [ 0.3, 0], [1, 1]);
	
};