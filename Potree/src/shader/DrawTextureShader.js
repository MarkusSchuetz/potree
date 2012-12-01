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
 * @class used to draw textures over a framebuffer.
 * @augments Shader
 */
function DrawTextureShader(name){
	if (arguments[0] === inheriting) return;
	Shader.call(this, name, "drawTexture.vs", "drawTexture.fs");
}

DrawTextureShader.prototype = new Shader(inheriting);

DrawTextureShader.prototype.initUniforms = function(){
	this.uTexture = gl.getUniformLocation(this.program, "uTexture");
	this.uDepth = gl.getUniformLocation(this.program, "uDepth");
	this.uWidth = gl.getUniformLocation(this.program, "uWidth");
	this.uHeight = gl.getUniformLocation(this.program, "uHeight");
};

DrawTextureShader.prototype.initAttributes = function(){
	this.aVertexPosition = gl.getAttribLocation( this.program, "aVertexPosition");
	this.aTexcoord = gl.getAttribLocation( this.program, "aTexcoord");
};
