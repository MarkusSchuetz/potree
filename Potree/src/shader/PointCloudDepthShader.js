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
function PointCloudDepthShader(name){
	if (arguments[0] === inheriting) return;
	
	if(name == null){
		name = "pointCloudDepth_" + Shader.count;
	}
//	Shader.call(this, name, "pointSize.vs", "pointsDepth.fs");
	Shader.call(this, name, "pointsDepth.vs", "pointsDepth.fs");
	
}

PointCloudDepthShader.prototype = new Shader(inheriting);

PointCloudDepthShader.prototype.initUniforms = function(){
	this.uWorld = gl.getUniformLocation(this.program, "world");
	this.uView = gl.getUniformLocation(this.program, "view");
	this.uProjection = gl.getUniformLocation(this.program, "proj");
	this.uPointSizeMultiplicator = gl.getUniformLocation(this.program, "uPointSizeMultiplicator");
};

PointCloudDepthShader.prototype.initAttributes = function(){
	this.aVertexPosition = gl.getAttribLocation(this.program, "aVertexPosition");
//	this.aVertexColour = gl.getAttribLocation(this.program, "aVertexColour");
};

