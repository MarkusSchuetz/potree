/**
 * potree.js 
 * http://potree.org
 *
 * Copyright 2012, Markus Schütz
 * Licensed under the GPL Version 2 or later.
 * - http://potree.org/wp/?page_id=7
 * - http://www.gnu.org/licenses/gpl-3.0.html
 *
 */


/**
 * 
 * @param {int} width
 * @param {int} height
 * 
 * @class Framebuffer with rgba format and floating point precision for each component.
 * requires OES_texture_float extension.
 * 
 * @augments Framebuffer
 */
function FramebufferFloat32Cube(width, height){
	Framebuffer.call(this, width, height);
}

FramebufferFloat32Cube.prototype = new Framebuffer(inheriting);
FramebufferFloat32Cube.base = Framebuffer.prototype;

/**
 * creates a colourbuffer with gl.FLOAT precision
 */
FramebufferFloat32Cube.prototype.initColorbuffer = function(){
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture.glid);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	
	var width = this.framebuffer.width;
	var height = this.framebuffer.height;
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.FLOAT, null);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.FLOAT, null);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.FLOAT, null);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.FLOAT, null);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.FLOAT, null);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.FLOAT, null);
};

FramebufferFloat32Cube.prototype.initBufferStuff = function(width, height){
	if(this.width == width && this.height == height){
		return;
	}
	
	this.width = width;
	this.height = height;
	
	// remove exiting buffers
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	if(this.texture != null){
		gl.deleteTexture(this.texture.glid);
		this.texture = null;
	}
	if(this.renderbuffer != null){
		gl.deleteRenderbuffer(this.renderbuffer);
		this.renderbuffer = null;
	}
	if(this.framebuffer != null){
		gl.deleteFramebuffer(this.framebuffer);
		this.framebuffer = null;
	}
	
	// create new buffers
	this.framebuffer = gl.createFramebuffer();
	this.texture = new Texture();
	this.texture.glid = gl.createTexture();
	this.renderbuffer = gl.createRenderbuffer();
	
	// framebuffer
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
	this.framebuffer.width = width;
	this.framebuffer.height = height;
	
	// colorbuffer
	this.initColorbuffer();
    
    // depthbuffer
	gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderbuffer);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.framebuffer.width, this.framebuffer.height);
    
	// assemble buffers
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, this.texture.glid, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderbuffer);

    this.checkBuffer();
    
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
};









