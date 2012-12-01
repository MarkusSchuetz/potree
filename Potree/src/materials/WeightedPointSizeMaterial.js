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
 * 
 * @class  point size depends on distance from eye.
 * this may change so that point size depends on more factors like child node visibility, density of a node, etc.  
 * 
 * @augments Material
 * @author Markus Schütz
 */
function WeightedPointSizeMaterial(name){
	Material.call(this, name);
	this.shader = new WeightedPointSizeShader();
	
	this.pointSize = 1.0;
}

WeightedPointSizeMaterial.prototype = new Material(inheriting);

WeightedPointSizeMaterial.prototype.render = function render(mno, mnoSceneNode, camera){
	var mnoNodes = mno.renderQueue.nodeList;
	for(var i = 0; i < mnoNodes.size(); i++){
		var node = mnoNodes[i];
		var pointCloud = node.pointCloud;
		if(pointCloud == null || pointCloud.vbo == null){
			continue;
		}
		var pointAttributes = mnoSceneNode.mno.pointAttributes;
//		var order = pointAttributes.order;

		gl.useProgram(this.shader.program);
		
//		var numInvisibleChildren = 0;
		var numChildren = 0;
		var visibilityMultiplicator = 0;
		for(var index in node.children){
			visibilityMultiplicator += (1-node.children[index].opacity);
			numChildren++;
		}
		if(numChildren == 0){
			visibilityMultiplicator = 1.0;
		}else{
			visibilityMultiplicator = (2*visibilityMultiplicator / numChildren) + 1;
		}
//		visibilityMultiplicator = 1.0;
		
		
		{ // uniforms
			gl.uniformMatrix4fv(this.shader.uWorld, false, mnoSceneNode.getGlobalTransformation());
			gl.uniformMatrix4fv(this.shader.uView, false, camera.viewMatrix);
			gl.uniformMatrix4fv(this.shader.uProjection, false, camera.projectionMatrix);
			gl.uniform1f(this.shader.uPointSizeMultiplicator, node.opacity * this.pointSize * visibilityMultiplicator);
			gl.uniform2f(this.shader.uViewportSize, Potree.canvas.clientWidth, Potree.canvas.clientHeight);
		}
		
		gl.bindBuffer(gl.ARRAY_BUFFER, pointCloud.vbo);
		var offset = 0;
		for(var j = 0; j < pointAttributes.numAttributes; j++){
			var attribute = pointAttributes.attributes[j];
			
			if(attribute.name == PointAttributeNames.POSITION_CARTESIAN){
				gl.enableVertexAttribArray(this.shader.aVertexPosition);
				gl.vertexAttribPointer(this.shader.aVertexPosition, 3, gl.FLOAT, false,pointAttributes.bytesPerPoint, offset);
			}else if(attribute.name == PointAttributeNames.COLOR_PACKED){
				if(this.shader.aVertexColour != null){
					gl.enableVertexAttribArray(this.shader.aVertexColour);
					gl.vertexAttribPointer(this.shader.aVertexColour, 3, gl.UNSIGNED_BYTE, false,pointAttributes.bytesPerPoint, offset);
				}
			}else if(attribute.name == PointAttributeNames.NORMAL_FLOATS){
				if(this.shader.aNormal != null){
					gl.enableVertexAttribArray(this.shader.aNormal);
					gl.vertexAttribPointer(this.shader.aNormal, 3, gl.FLOAT, false,pointAttributes.bytesPerPoint, offset);
				}
			}
			offset += attribute.type.size * attribute.numElements;
		}
		
		gl.drawArrays(gl.POINTS, 0, node.points);
		Potree.drawnPoints += node.points;
		Potree.drawCalls += 1;
		
		gl.disableVertexAttribArray(this.shader.aVertexPosition);
		gl.disableVertexAttribArray(this.shader.aVertexColour);
		gl.disableVertexAttribArray(this.shader.aNormal);
	}
};