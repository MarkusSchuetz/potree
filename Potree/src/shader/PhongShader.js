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
	this.uLightView = gl.getUniformLocation(this.program, "lightView");
	this.uLightProjection = gl.getUniformLocation(this.program, "lightProj");
	this.uLightPos = gl.getUniformLocation(this.program, "uLightPos");
	this.uLightDir = gl.getUniformLocation(this.program, "uLightDir");
	this.uLightType = gl.getUniformLocation(this.program, "uLightType");
	this.uLightColor = gl.getUniformLocation(this.program, "uLightColor");
	this.uNumLights = gl.getUniformLocation(this.program, "uNumLights");
	this.uViewPos = gl.getUniformLocation(this.program, "uViewPos");
	this.uShadowMap = gl.getUniformLocation(this.program, "uShadowMap");
	this.uCastShadows = gl.getUniformLocation(this.program, "castShadows");
};

PhongShader.prototype.initAttributes = function() {
	this.aVertexPosition = gl.getAttribLocation(this.program, "aVertexPosition");
	this.aNormal = gl.getAttribLocation(this.program, "aNormal");
	this.aTextureCoord = gl.getAttribLocation(this.program, "aTextureCoord");
};
