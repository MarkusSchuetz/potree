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
 * @class
 * @augments Shader
 */
function NormalizationShader(name){
	if (arguments[0] === inheriting) return;
	Shader.call(this, name, "drawTexture.vs", "normalization.fs");
}

NormalizationShader.prototype = new Shader(inheriting);

NormalizationShader.prototype.initUniforms = function(){
	this.uGaussSplatTex = gl.getUniformLocation(this.program, "uGaussSplatTex");
	this.uDepthTex = gl.getUniformLocation(this.program, "uDepthTex");
};

NormalizationShader.prototype.initAttributes = function(){
	this.aVertexPosition = gl.getAttribLocation( this.program, "aVertexPosition");
	this.aTexcoord = gl.getAttribLocation( this.program, "aTexcoord");
};
