
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
	
//	Framebuffer.getActiveBuffer().bind();
//	Framebuffer.getSystemBuffer().bind();

//	renderQueue.preferredMaterial = MaterialManager.getMaterial("depth");
	for(var i = 0; i < renderQueue.nodes.length; i++){
		var node = renderQueue.nodes[i];
		node.render(renderQueue, scene.activeCamera);
	}
};

Renderer.prototype.shadowmapping = function(light, renderQueue){
	if(light.shadowmap == undefined){
		light.shadowmap = new Array();
		
		var shadowmap = new ShadowMap(512, 512);
		shadowmap.camera = new Camera("sm1");
		shadowmap.camera.fieldOfView = 90;
		
		light.shadowmap = shadowmap;
	}
	
	var oldBuffer = Framebuffer.getActiveBuffer();
	
	var shadowmap = light.shadowmap;
	shadowmap.framebuffer.bind();
	gl.clearColor(1.0, 1.0, 1.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	shadowmap.camera = new Camera("sm1");
	shadowmap.camera.fieldOfView = 90;
	shadowmap.camera.translate(light.globalPosition[0], light.globalPosition[1], light.globalPosition[2]);
	
	renderQueue.preferredMaterial = MaterialManager.getMaterial("depth");
	for(var i = 0; i < renderQueue.nodes.length; i++){
		var node = renderQueue.nodes[i];
		node.render(renderQueue, shadowmap.camera);
	}
	renderQueue.preferredMaterial = null;
	
	oldBuffer.bind();
	oldBuffer.drawTexture(shadowmap.framebuffer.texture, [ 0.3, 0], [1, 1]);
	
};