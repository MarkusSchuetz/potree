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
function TexturedShader(name){
	if (arguments[0] === inheriting) return;
	Shader.call(this, name, "textured.vs", "textured.fs");
}

TexturedShader.prototype = new Shader(inheriting);

TexturedShader.prototype.initUniforms = function(){
	this.uWorld = gl.getUniformLocation(this.program, "world");
	this.uView = gl.getUniformLocation(this.program, "view");
	this.uProjection = gl.getUniformLocation(this.program, "proj");
	this.uTexture = gl.getUniformLocation(this.program, "uTexture");
};

TexturedShader.prototype.initAttributes = function(){
	this.aVertexPosition = gl.getAttribLocation( this.program, "aVertexPosition");
	this.aNormal = gl.getAttribLocation( this.program, "aNormal");
	this.aTextureCoord = gl.getAttribLocation( this.program, "aTextureCoord");
};

TexturedShader.prototype.renderMesh = function(meshNode, subMesh, camera){
	gl.useProgram(this.program);
	gl.uniformMatrix4fv(this.uWorld, false, meshNode.getGlobalTransformation());
	gl.uniformMatrix4fv(this.uView, false, camera.getViewMatrix());
	gl.uniformMatrix4fv(this.uProjection, false, camera.projectionMatrix);
	
    gl.enableVertexAttribArray(this.aVertexPosition);
    gl.enableVertexAttribArray(this.aTextureCoord);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, subMesh.vbos["POSITION"]);
    gl.vertexAttribPointer(this.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, subMesh.vbos["NORMAL"]);
    gl.vertexAttribPointer(this.aNormal, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, subMesh.vbos["TEXCOORD_0"]);
    gl.vertexAttribPointer(this.aTextureCoord, 2, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, subMesh.ibo);
    
    gl.drawElements(gl.TRIANGLES, subMesh.indices.length, gl.UNSIGNED_BYTE, 0);
};