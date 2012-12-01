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
 * @class used to render depth and colour into a rgba float texture.
 * @augments Shader
 */
function FillHoleFirstPassShader(name){
	if (arguments[0] === inheriting) return;
	Shader.call(this, name, "fillHoleFirstPass.vs", "fillHoleFirstPass.fs");
}

FillHoleFirstPassShader.prototype = new Shader(inheriting);

FillHoleFirstPassShader.prototype.initUniforms = function(){
	this.uWorld = gl.getUniformLocation(this.program, "world");
	this.uView = gl.getUniformLocation(this.program, "view");
	this.uProjection = gl.getUniformLocation(this.program, "proj");
	this.uPointSizeMultiplicator = gl.getUniformLocation(this.program, "uPointSizeMultiplicator");
};

FillHoleFirstPassShader.prototype.initAttributes = function(){
	this.aVertexPosition = gl.getAttribLocation(this.program, "aVertexPosition");
	this.aVertexColour = gl.getAttribLocation(this.program, "aVertexColour");
};

