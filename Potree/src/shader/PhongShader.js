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
function PhongShader(name) {
	if (arguments[0] === inheriting) return;
	Shader.call(this, name, "phong.vs", "phong.fs");
}

PhongShader.prototype = new Shader(inheriting);

PhongShader.prototype.initUniforms = function() {
	this.uWorld = gl.getUniformLocation(this.program, "world");
	this.uView = gl.getUniformLocation(this.program, "view");
	this.uProjection = gl.getUniformLocation(this.program, "proj");
	this.uLightPos = gl.getUniformLocation(this.program, "lightPos");
	this.uLightColor = gl.getUniformLocation(this.program, "lightColor");
	this.uViewPos = gl.getUniformLocation(this.program, "uViewPos");
	this.uShadowMap = gl.getUniformLocation(this.program, "uShadowMap");
};

PhongShader.prototype.initAttributes = function() {
	this.aVertexPosition = gl.getAttribLocation(this.program, "aVertexPosition");
	this.aNormal = gl.getAttribLocation(this.program, "aNormal");
	this.aTextureCoord = gl.getAttribLocation(this.program, "aTextureCoord");
};
