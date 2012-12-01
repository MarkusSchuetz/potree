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
 * @class used to render every point with a fixed pixel size
 * @augments Shader
 */
function FixedPointSizeShader(name){
	if (arguments[0] === inheriting) return;
	Shader.call(this, name, "fixedPointSize.vs", "colouredPoint.fs");
}

FixedPointSizeShader.prototype = new Shader(inheriting);

FixedPointSizeShader.prototype.initUniforms = function(){
	this.uWorld = gl.getUniformLocation(this.program, "world");
	this.uView = gl.getUniformLocation(this.program, "view");
	this.uProjection = gl.getUniformLocation(this.program, "proj");
	this.uPointSize = gl.getUniformLocation(this.program, "uPointSize");
	this.uLinearDepthMap = gl.getUniformLocation(this.program, "uLinearDepthMap");
	this.uViewportSize = gl.getUniformLocation(this.program, "uViewportSize");
	this.uFarClipPlane = gl.getUniformLocation(this.program, "uFarClipPlane");
};

FixedPointSizeShader.prototype.initAttributes = function(){
	this.aVertexPosition = gl.getAttribLocation(this.program, "aVertexPosition");
	this.aVertexColour = gl.getAttribLocation(this.program, "aVertexColour");
};

