/**
 * potree.js 
 * http://potree.org
 *
 * Copyright 2012, Markus Sch�tz
 * Licensed under the GPL Version 2 or later.
 * - http://potree.org/wp/?page_id=7
 * - http://www.gnu.org/licenses/gpl-3.0.html
 *
 */

/**
 * You can call the constructor with either, width and height, or "system". When
 * invoking the constructor with "system", the framebuffer will refer to the
 * system/default framebuffer.
 * 
 * @param {int}
 *            width
 * @param {int}
 *            height
 * @class create and handle FramebufferObjects
 * @see <a href="http://learningwebgl.com/blog/?p=1786">WebGL Lesson 16</a>
 */
function Framebuffer(width, height) {
	if (arguments[0] === inheriting)
		return;
	if (arguments[0] == "system") {
		this.framebuffer = null;
		this.initOtherStuff();
	} else {
		this.initBufferStuff(width, height);
		this.initOtherStuff();
	}
}

/**
 * 
 * @returns the system framebuffer
 */
Framebuffer.getSystemBuffer = function() {
	if (Framebuffer.systemBuffer == null) {
		Framebuffer.systemBuffer = new Framebuffer("system");
	}

	return Framebuffer.systemBuffer;
};

Framebuffer.getActiveBuffer = function() {
	if (Framebuffer.activeBuffer == null) {
		Framebuffer.activeBuffer = Framebuffer.getSystemBuffer();
	}

	return Framebuffer.activeBuffer;
};

Framebuffer.setActiveBuffer = function(buffer) {
	Framebuffer.activeBuffer = buffer;
};

/**
 * change size of the framebuffer.
 * 
 * @param {int}
 *            width
 * @param {int}
 *            height
 */
Framebuffer.prototype.setSize = function(width, height) {
	this.initBufferStuff(width, height);
};

/**
 * Initialize stuff like a vbo for screen quads.
 */
Framebuffer.prototype.initOtherStuff = function() {

	this.vbo = gl.createBuffer();
	this.texcoordvbo = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
	var vertices = new Float32Array([ 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1,
			0, 0, 1, 0 ]);
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordvbo);
	var vertices = new Float32Array([ 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1 ]);
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

};

/**
 * change size of screenQuad.
 * 
 * @param {[x,y]}
 *            start x and y must be values between 0 and 1
 * @param {[x,y]}
 *            end x and y must be values between 0 and 1
 */
Framebuffer.prototype.updateScreenQuad = function(start, end) {
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
	var vertices = new Float32Array([ start[0], start[1], 0, end[0], start[1],
			0, end[0], end[1], 0, start[0], start[1], 0, end[0], end[1], 0,
			start[0], end[1], 0 ]);
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
};

/**
 * removes existing webgl color/render/frame-buffers and creates new ones
 * 
 * @param {int}
 *            width
 * @param {int}
 *            height
 */
Framebuffer.prototype.initBufferStuff = function(width, height) {
	if (this.width == width && this.height == height) {
		return;
	}

	this.width = width;
	this.height = height;

	// remove exiting buffers
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	if (this.texture != null) {
		gl.deleteTexture(this.texture.glid);
		this.texture = null;
	}
	if (this.renderbuffer != null) {
		gl.deleteRenderbuffer(this.renderbuffer);
		this.renderbuffer = null;
	}
	if (this.framebuffer != null) {
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
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16,
			this.framebuffer.width, this.framebuffer.height);

	// assemble buffers
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
			gl.TEXTURE_2D, this.texture.glid, 0);
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT,
			gl.RENDERBUFFER, this.renderbuffer);

	this.checkBuffer();

	gl.bindTexture(gl.TEXTURE_2D, null);
	gl.bindRenderbuffer(gl.RENDERBUFFER, null);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
};

/**
 * initializes the colourbuffer that'll be used as COLOR_ATTACHMENT0
 */
Framebuffer.prototype.initColorbuffer = function() {
	gl.bindTexture(gl.TEXTURE_2D, this.texture.glid);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.framebuffer.width,
			this.framebuffer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
};

/**
 * check if framebuffer was successfully created. Throws an exception if the
 * buffer is invalid.
 */
Framebuffer.prototype.checkBuffer = function checkBuffer() {
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);

	var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
	switch (status) {
	case gl.FRAMEBUFFER_COMPLETE:
		break;
	case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
		Logger
				.error("Incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_ATTACHMENT");
		throw "";
		break;
	case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
		Logger
				.error("Incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT");
		throw "";
		break;
	case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
		Logger
				.error("Incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_DIMENSIONS");
		throw "";
		break;
	case gl.FRAMEBUFFER_UNSUPPORTED:
		Logger.error("Incomplete framebuffer: FRAMEBUFFER_UNSUPPORTED");
		throw "";
		break;
	default:
		Logger.error("Incomplete framebuffer: " + status);
		throw "";
	}
};

Framebuffer.bindDefault = function() {
	Framebuffer.activeBuffer = Framebuffer.getSystemBuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
};

/**
 * binds this framebuffer which makes it the target for all drawCalls and
 * framebuffer related calls.
 */
Framebuffer.prototype.bind = function() {
	Framebuffer.activeBuffer = this;
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
};

/**
 * 
 * @param {Texture}
 *            texture
 * @param {[x,y]}
 *            start
 * @param {[x,y]}
 *            end
 * 
 * @example drawTexture(abc, [0,0], [1,1])
 */
Framebuffer.prototype.drawTexture = function(texture, start, end) {
	this.bind();

	var mat = ShaderManager.getShader("drawTexture");
	gl.useProgram(mat.program);

	this.updateScreenQuad(start, end);

	// uniforms
	if (this.framebuffer == null) {
		var canvas = document.getElementById("canvas");
		gl.uniform1f(mat.uWidth, canvas.width);
		gl.uniform1f(mat.uHeight, canvas.height);
	} else {
		gl.uniform1f(mat.uWidth, this.width);
		gl.uniform1f(mat.uHeight, this.height);
	}
	// texture
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture.glid);
	gl.uniform1i(mat.uTexture, 0);
	// depth
	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, this.renderbuffer);
	gl.uniform1i(mat.uDepth, 0);

	// vertex attributes
	gl.enableVertexAttribArray(mat.aVertexPosition);
	gl.enableVertexAttribArray(mat.aTexcoords);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
	gl.vertexAttribPointer(mat.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordvbo);
	gl.vertexAttribPointer(mat.aTexcoords, 2, gl.FLOAT, false, 0, 0);

	gl.drawArrays(gl.TRIANGLES, 0, 6);

	gl.disableVertexAttribArray(mat.aVertexPosition);
	gl.disableVertexAttribArray(mat.aTexcoords);
};

Framebuffer.prototype.drawCubemap = function(texture, start, end) {
	this.bind();

	var mat = ShaderManager.getShader("drawCubemap");
	gl.useProgram(mat.program);

	this.updateScreenQuad(start, end);

	// uniforms
	if (this.framebuffer == null) {
		var canvas = document.getElementById("canvas");
		gl.uniform1f(mat.uWidth, canvas.width);
		gl.uniform1f(mat.uHeight, canvas.height);
	} else {
		gl.uniform1f(mat.uWidth, this.width);
		gl.uniform1f(mat.uHeight, this.height);
	}
	// texture
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture.glid);
	gl.uniform1i(mat.uCubeMap, 0);

	// vertex attributes
	gl.enableVertexAttribArray(mat.aVertexPosition);
	gl.enableVertexAttribArray(mat.aTexcoords);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
	gl.vertexAttribPointer(mat.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordvbo);
	gl.vertexAttribPointer(mat.aTexcoords, 2, gl.FLOAT, false, 0, 0);

	gl.drawArrays(gl.TRIANGLES, 0, 6);

	gl.disableVertexAttribArray(mat.aVertexPosition);
	gl.disableVertexAttribArray(mat.aTexcoords);
};


/**
 * draws a quad over the whole framebuffer using the provided material.
 * 
 * @param {Material}
 *            mat
 */
Framebuffer.prototype.drawFullscreenQuad = function(mat) {

	gl.useProgram(mat.program);

	this.updateScreenQuad([ -1, -1 ], [ 1, 1 ]);

	// vertex attributes
	gl.enableVertexAttribArray(mat.aVertexPosition);
	gl.enableVertexAttribArray(mat.aTexcoords);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
	gl.vertexAttribPointer(mat.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordvbo);
	gl.vertexAttribPointer(mat.aTexcoords, 2, gl.FLOAT, false, 0, 0);

	gl.drawArrays(gl.TRIANGLES, 0, 6);

	gl.disableVertexAttribArray(mat.aVertexPosition);
	gl.disableVertexAttribArray(mat.aTexcoords);
};
