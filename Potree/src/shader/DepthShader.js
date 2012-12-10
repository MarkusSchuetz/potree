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
function DepthShader(name) {
	if (arguments[0] === inheriting) return;
	Shader.call(this, name, "depth.vs", "depth.fs");
}

DepthShader.prototype = new Shader(inheriting);

DepthShader.prototype.initUniforms = function() {
	this.uWorld = gl.getUniformLocation(this.program, "world");
	this.uView = gl.getUniformLocation(this.program, "view");
	this.uProjection = gl.getUniformLocation(this.program, "proj");
};

DepthShader.prototype.initAttributes = function() {
	this.aVertexPosition = gl.getAttribLocation(this.program, "aVertexPosition");
};
