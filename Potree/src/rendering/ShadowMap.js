
function ShadowMap(width, height){
	this.camera = null;
//	this.framebuffer = new FramebufferFloat32(width, height);
	this.framebuffer = new FramebufferFloat32Cube(width, height);
}

