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
function NormalsMaterial(name){
	Material.call(this, name);
	this.pointCloudNormalsShader = new PointCloudNormalsShader();
	
	this.pointSize = 1.0;
}

NormalsMaterial.prototype = new Material(inheriting);

/**
 * 
 * 
 * @param object may be either a SubMesh or a PointcloudOctree
 * @param sceneNode
 * @param camera
 */
NormalsMaterial.prototype.render = function(object, sceneNode, camera){
	this.renderPointcloudOctree(object, sceneNode, camera);
};

NormalsMaterial.prototype.renderPointcloudOctree = function(mno, mnoSceneNode, camera){
	var shader = this.pointCloudNormalsShader;
	var mnoNodes = mno.renderQueue.nodeList;
	
	for(var i = 0; i < mnoNodes.size(); i++){
		var node = mnoNodes[i];
		var pointCloud = node.pointCloud;
		var pointAttributes = mnoSceneNode.mno.pointAttributes;
		var viewPos = camera.getGlobalPosition();

		gl.useProgram(shader.program);
		
		{ // uniforms
			gl.uniformMatrix4fv(shader.uWorld, false, mnoSceneNode.globalTransformation);
			gl.uniformMatrix4fv(shader.uView, false, camera.viewMatrix);
			gl.uniformMatrix4fv(shader.uProjection, false, camera.projectionMatrix);
			gl.uniform1f(shader.uPointSizeMultiplicator, node.opacity * this.pointSize);
			gl.uniform3f(shader.uViewPos, viewPos[0], viewPos[1], viewPos[2]);
		}
		
		gl.bindBuffer(gl.ARRAY_BUFFER, pointCloud.vbo);
		var offset = 0;
		for(var j = 0; j < pointAttributes.numAttributes; j++){
			var attribute = pointAttributes.attributes[J];
			
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
		
		gl.drawArrays(gl.POINTS, 0, node.points);
		Potree.drawnPoints += node.points;
		Potree.drawCalls += 1;
	}
};