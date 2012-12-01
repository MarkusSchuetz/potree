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
function WeightedPointSizeShader(name){
	if (arguments[0] === inheriting) return;
	Shader.call(this, name, "pointSize.vs", "colouredPoint.fs");
//	Shader.call(this, name, "colouredPoint.vs", "colouredPoint.fs");
	
}

WeightedPointSizeShader.prototype = new Shader(inheriting);

WeightedPointSizeShader.prototype.initUniforms = function(){
	this.uWorld = gl.getUniformLocation(this.program, "world");
	this.uView = gl.getUniformLocation(this.program, "view");
	this.uProjection = gl.getUniformLocation(this.program, "proj");
	this.uOpacity = gl.getUniformLocation(this.program, "uOpacity");
	this.uPointSize = gl.getUniformLocation(this.program, "uPointSize");
	this.uPointSizeMultiplicator = gl.getUniformLocation(this.program, "uPointSizeMultiplicator");
	this.uLinearDepthMap = gl.getUniformLocation(this.program, "uLinearDepthMap");
	this.uViewportSize = gl.getUniformLocation(this.program, "uViewportSize");
	this.uFarClipPlane = gl.getUniformLocation(this.program, "uFarClipPlane");
};

WeightedPointSizeShader.prototype.initAttributes = function(){
	this.aVertexPosition = gl.getAttribLocation(this.program, "aVertexPosition");
	this.aVertexColour = gl.getAttribLocation(this.program, "aVertexColour");
};

