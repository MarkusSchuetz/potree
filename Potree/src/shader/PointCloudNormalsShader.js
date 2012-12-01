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
function PointCloudNormalsShader(name){
	if (arguments[0] === inheriting) return;
	Shader.call(this, name, "pointsPhong.vs", "normals.fs");
	
}

PointCloudNormalsShader.prototype = new Shader(inheriting);

PointCloudNormalsShader.prototype.initUniforms = function(){
	this.uWorld = gl.getUniformLocation(this.program, "world");
	this.uView = gl.getUniformLocation(this.program, "view");
	this.uProjection = gl.getUniformLocation(this.program, "proj");
	this.uOpacity = gl.getUniformLocation(this.program, "uOpacity");
	this.uPointSizeMultiplicator = gl.getUniformLocation(this.program, "uPointSizeMultiplicator");
	this.uViewPos = gl.getUniformLocation(this.program, "uViewPos");
};

PointCloudNormalsShader.prototype.initAttributes = function(){
	this.aVertexPosition = gl.getAttribLocation(this.program, "aVertexPosition");
	this.aVertexColour = gl.getAttribLocation(this.program, "aVertexColour");
	this.aNormal = gl.getAttribLocation(this.program, "aNormal");
};

