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
 * @augments Material
 * @author Markus Schütz
 */
function DepthMaterial(name){
	Material.call(this, name);
	this.depthShader = new DepthShader();
}

DepthMaterial.prototype = new Material(inheriting);

/**
 * 
 * 
 * @param object may be either a SubMesh or a PointcloudOctree
 * @param sceneNode
 * @param camera
 */
DepthMaterial.prototype.render = function(object, sceneNode, camera){
	if(object instanceof SubMesh){
		this.renderSubMesh(object, sceneNode, camera);
	}
};


DepthMaterial.prototype.renderSubMesh = function(subMesh, meshNode, renderQueue, camera){
	var shader = this.depthShader;
	
	var mesh = meshNode.mesh;
	gl.useProgram(shader.program);
	
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);

	// uniforms
	gl.uniformMatrix4fv(shader.uWorld, false, meshNode.globalTransformation);
	gl.uniformMatrix4fv(shader.uView, false, camera.viewMatrix);
	gl.uniformMatrix4fv(shader.uProjection, false, camera.projectionMatrix);
	
	// vertex attributes
	gl.enableVertexAttribArray(shader.aVertexPosition);
	gl.bindBuffer(gl.ARRAY_BUFFER, subMesh.vbos["POSITION"]);
	gl.vertexAttribPointer(shader.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
	
	gl.disable(gl.BLEND);
		
	if(subMesh.ibo != null){
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, subMesh.ibo);
		gl.drawElements(mesh.glType, subMesh.indices.length, gl.UNSIGNED_SHORT, 0);
		Potree.drawCalls += 1;
	}else if(subMesh.vertexCount != null){
		gl.lineWidth(10.0);
		gl.drawArrays(mesh.glType, 0, subMesh.vertexCount);
		Potree.drawCalls += 1;
	}
	
	
};