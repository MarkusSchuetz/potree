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
function FlatShader(name, color) {
	if (arguments[0] === inheriting)
		return;
	Shader.call(this, name, "flatShader.vs", "flatShader.fs");

	if (color == null) {
		this.setColor([1,0,0,1]);
	} else {
		this.setColor(color);
	}
}

FlatShader.prototype = new Shader(inheriting);

FlatShader.prototype.setColor = function(color) {
	this.color = color;
	gl.useProgram(this.program);
	gl.uniform4f(this.uColor, this.color[0], this.color[1], this.color[2],
			this.color[3]);
};

FlatShader.prototype.initUniforms = function() {
	this.uWorld = gl.getUniformLocation(this.program, "world");
	this.uView = gl.getUniformLocation(this.program, "view");
	this.uProjection = gl.getUniformLocation(this.program, "proj");
	this.uColor = gl.getUniformLocation(this.program, "color");
};

FlatShader.prototype.initAttributes = function() {
	this.aVertexPosition = gl
			.getAttribLocation(this.program, "aVertexPosition");
};
