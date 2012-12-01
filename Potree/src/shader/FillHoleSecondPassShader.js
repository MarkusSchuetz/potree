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
 * @class for every fragment, the surrounding area is searched for the best pixel to use. 
 * @augments Shader
 */
function FillHoleSecondPassShader(name){
	if (arguments[0] === inheriting) return;
	Shader.call(this, name, "drawTexture.vs", "fillHoleSecondPass.fs");
}

FillHoleSecondPassShader.prototype = new Shader(inheriting);

FillHoleSecondPassShader.prototype.initUniforms = function(){
	this.uTex = gl.getUniformLocation(this.program, "uTex");
	this.uViewportSize = gl.getUniformLocation(this.program, "uViewportSize");
};

FillHoleSecondPassShader.prototype.initAttributes = function(){
	this.aVertexPosition = gl.getAttribLocation( this.program, "aVertexPosition");
	this.aTexcoord = gl.getAttribLocation( this.program, "aTexcoord");
};
