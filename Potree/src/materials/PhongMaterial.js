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
function PhongMaterial(name){
	Material.call(this, name);
	this.subMeshPhongShader = new PhongShader();
	this.pointCloudPhongShader = new PointCloudPhongShader();
	
	this.pointSize = 1.0;
	this.glossiness = 50;
}

PhongMaterial.prototype = new Material(inheriting);

/**
 * 
 * 
 * @param object may be either a SubMesh or a PointcloudOctree
 * @param sceneNode
 * @param camera
 */
PhongMaterial.prototype.render = function(object, sceneNode, camera){
	if(object instanceof SubMesh){
		this.renderSubMesh(object, sceneNode, camera);
	}else if(object instanceof PointcloudOctree){
		this.renderPointcloudOctree(object, sceneNode, camera);
	}
};

PhongMaterial.prototype.renderPointcloudOctree = function(mno, mnoSceneNode, camera){
	var shader = this.pointCloudPhongShader;
	var mnoNodes = mno.renderQueue.nodeList;
	
	for(var i = 0; i < mnoNodes.size(); i++){
		var node = mnoNodes[i];
		var pointCloud = node.pointCloud;
		var pointAttributes = mnoSceneNode.mno.pointAttributes;
		var viewPos = camera.getGlobalPosition();
		
//		var numChildren = 0;
//		var visibilityMultiplicator = 0;
//		for(var index in node.children){
//			visibilityMultiplicator += (1-node.children[index].opacity);
//			numChildren++;
//		}
//		visibilityMultiplicator = (2*visibilityMultiplicator / numChildren) + 1;

		gl.useProgram(shader.program);
		
		{ // uniforms
			gl.uniformMatrix4fv(shader.uWorld, false, mnoSceneNode.getGlobalTransformation());
			gl.uniformMatrix4fv(shader.uView, false, camera.viewMatrix);
			gl.uniformMatrix4fv(shader.uProjection, false, camera.projectionMatrix);
			gl.uniform1f(shader.uPointSizeMultiplicator, node.opacity * this.pointSize );
			gl.uniform3f(shader.uViewPos, viewPos[0], viewPos[1], viewPos[2]);
			gl.uniform1f(shader.glossiness, this.glossiness);
		}
		
		gl.bindBuffer(gl.ARRAY_BUFFER, pointCloud.vbo);
		var offset = 0;
		for(var j = 0; j < pointAttributes.numAttributes; j++){
			var attribute = pointAttributes.attributes[j];
			
			if(attribute.name == PointAttributeNames.POSITION_CARTESIAN){
				gl.enableVertexAttribArray(shader.aVertexPosition);
				gl.vertexAttribPointer(shader.aVertexPosition, 3, gl.FLOAT, false,pointAttributes.bytesPerPoint, offset);
			}else if(attribute.name == PointAttributeNames.COLOR_PACKED){
				if(shader.aVertexColour != null){
					gl.enableVertexAttribArray(shader.aVertexColour);
					gl.vertexAttribPointer(shader.aVertexColour, 3, gl.UNSIGNED_BYTE, false,pointAttributes.bytesPerPoint, offset);
				}
			}else if(attribute.name == PointAttributeNames.NORMAL_FLOATS){
				if(shader.aNormal != null){
					gl.enableVertexAttribArray(shader.aNormal);
					gl.vertexAttribPointer(shader.aNormal, 3, gl.FLOAT, false,pointAttributes.bytesPerPoint, offset);
				}
			}
			offset += attribute.type.size * attribute.numElements;
		}
		
		gl.drawArrays(gl.POINTS, 0, node.points / 5);
		Potree.drawnPoints += node.points;
		Potree.drawCalls += 1;
	}
};

PhongMaterial.prototype.renderSubMesh = function(subMesh, meshNode, camera){
	var shader = this.subMeshPhongShader;
	
	var scene = camera.scene;
	var mesh = meshNode.mesh;
	gl.useProgram(shader.program);

	// uniforms
	gl.uniformMatrix4fv(shader.uWorld, false, meshNode.getGlobalTransformation());
	gl.uniformMatrix4fv(shader.uView, false, camera.viewMatrix);
	gl.uniformMatrix4fv(shader.uProjection, false, camera.projectionMatrix);
	var viewPos = camera.getGlobalPosition();
	gl.uniform3f(shader.uViewPos, viewPos[0], viewPos[1], viewPos[2]);
	
	// TODO find better solution for lights
	if(shader.uLightPos != null){
		var light = scene.lights[Object.keys(scene.lights)[0]];
		var lightPos = light.getGlobalPosition();
		gl.uniform3f(shader.uLightPos, lightPos[0], lightPos[1], lightPos[2]);
	}
	
	// vertex attributes
	gl.enableVertexAttribArray(shader.aVertexPosition);
	gl.bindBuffer(gl.ARRAY_BUFFER, subMesh.vbos["POSITION"]);
	gl.vertexAttribPointer(shader.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
	
	
	if(subMesh.vbos["TEXCOORD_0"] != null && shader.aTextureCoord != null ){
		gl.enableVertexAttribArray(shader.aTextureCoord);
		gl.bindBuffer(gl.ARRAY_BUFFER, subMesh.vbos["TEXCOORD_0"]);
		gl.vertexAttribPointer(shader.aTextureCoord, 2, gl.FLOAT, false, 0, 0);
	}
	
	if(subMesh.vbos["NORMAL"] != null && shader.aNormal != null){
		gl.enableVertexAttribArray(shader.aNormal);
		gl.bindBuffer(gl.ARRAY_BUFFER, subMesh.vbos["NORMAL"]);
		gl.vertexAttribPointer(shader.aNormal, 3, gl.FLOAT, false, 0, 0);
	}
	
	if(subMesh.ibo != null){
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, subMesh.ibo);
		gl.drawElements(mesh.glType, subMesh.indices.length, gl.UNSIGNED_BYTE, 0);
		Potree.drawCalls += 1;
	}else if(subMesh.vertexCount != null){
		gl.lineWidth(10.0);
		gl.drawArrays(mesh.glType, 0, subMesh.vertexCount);
		Potree.drawCalls += 1;
	}
};