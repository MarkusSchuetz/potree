/**
 * potree.js 
 * http://potree.org
 *
 * Copyright 2012, Markus Sch�tz
 * Licensed under the GPL Version 2 or later.
 * - http://potree.org/wp/?page_id=7
 * - http://www.gnu.org/licenses/gpl-3.0.html
 *
 */

/**
 * 
 * @class
 * Axis aligned bounding box
 * 
 * 
 * <pre>
 *    7----6        y
 *   /    /|        |
 *  4----5 |        |
 *  | 3--|-2        |______ x  
 *  |/   |/       .�
 *  0----1       �z
 * </pre>
 *
 * @see http://www.lighthouse3d.com/tutorials/view-frustum-culling/geometric-approach-testing-boxes-ii/
 */
function AABB(){
	this.material = MaterialManager.getMaterial("aabb");
	
	this.points = 24;
	this.color = [ 1.0, 0.0, 0.0, 1.0];
	
	// transformed minimum and maximum coordinates
	this.min = V3.$(0,0,0);
	this.max = V3.$(0,0,0);
	this.center = null;
	this.radius = null;
	
	this.vbo = null;
	
	this.transform = M4x4.I;
	
	// object space coordinates. of the bounding box. 
	this.p0 = null;
	this.p1 = null;
	this.p2 = null;
	this.p3 = null;
	this.p4 = null;
	this.p5 = null;
	this.p6 = null;
	this.p7 = null;
	this.objectSpaceMin = V3.$(0,0,0);
	this.objectSpaceMax = V3.$(0,0,0);
}

/**
 * set object space coordinates of this bounding box
 * 
 * @param p0
 * @param p1
 * @param p2
 * @param p3
 * @param p4
 * @param p5
 * @param p6
 * @param p7
 */
AABB.prototype.setDimension = function(p0, p1, p2, p3, p4, p5, p6, p7) {
	this.p0 = p0;
	this.p1 = p1;
	this.p2 = p2;
	this.p3 = p3;
	this.p4 = p4;
	this.p5 = p5;
	this.p6 = p6;
	this.p7 = p7;
	this.update();
};

/**
 * set object space coordinates by providing the minimum and the maximum vertex of the aabb.
 * 
 * @param min
 * @param max
 */
AABB.prototype.setDimensionByMinMax = function(min, max){
	this.p0 = [min[0], min[1], max[2]];
	this.p1 = [max[0], min[1], max[2]];
	this.p2 = [max[0], min[1], min[2]];
	this.p3 = [min[0], min[1], min[2]];
	this.p4 = [min[0], max[1], max[2]];
	this.p5 = [max[0], max[1], max[2]];
	this.p6 = [max[0], max[1], min[2]];
	this.p7 = [min[0], max[1], min[2]];
	this.update();
};

/**
 * transforms the aabb from object space. 
 * 
 * @param transform
 */
AABB.prototype.setTransform = function(transform){
	this.transform = transform;
	
	this.update();
};


AABB.tmpVec = V3.$(0,0,0);
/**
 * calculates min, max, center and radius of the transformed AABB. p0 to p7 will be kept in object space.
 */
AABB.prototype.update = function update(){
	
	// calculate the minimum of the box
	this.objectSpaceMin[0] = Math.min(this.p0[0], this.p1[0], this.p2[0], this.p3[0], this.p4[0], this.p5[0], this.p6[0], this.p7[0]);
	this.objectSpaceMin[1] = Math.min(this.p0[1], this.p1[1], this.p2[1], this.p3[1], this.p4[1], this.p5[1], this.p6[1], this.p7[1]);
	this.objectSpaceMin[2] = Math.min(this.p0[2], this.p1[2], this.p2[2], this.p3[2], this.p4[2], this.p5[2], this.p6[2], this.p7[2]);
	
	// calculate maximum of the box
	this.objectSpaceMax[0] = Math.max(this.p0[0], this.p1[0], this.p2[0], this.p3[0], this.p4[0], this.p5[0], this.p6[0], this.p7[0]);
	this.objectSpaceMax[1] = Math.max(this.p0[1], this.p1[1], this.p2[1], this.p3[1], this.p4[1], this.p5[1], this.p6[1], this.p7[1]);
	this.objectSpaceMax[2] = Math.max(this.p0[2], this.p1[2], this.p2[2], this.p3[2], this.p4[2], this.p5[2], this.p6[2], this.p7[2]);
	
	// calculate transformed box coordinates
	var p0 = V3.transform(this.p0, this.transform);
	var p1 = V3.transform(this.p1, this.transform);
	var p2 = V3.transform(this.p2, this.transform);
	var p3 = V3.transform(this.p3, this.transform);
	var p4 = V3.transform(this.p4, this.transform);
	var p5 = V3.transform(this.p5, this.transform);
	var p6 = V3.transform(this.p6, this.transform);
	var p7 = V3.transform(this.p7, this.transform);
	
	// calculate the minimum of the transformed box
	this.min[0] = Math.min(p0[0], p1[0], p2[0], p3[0], p4[0], p5[0], p6[0], p7[0]);
	this.min[1] = Math.min(p0[1], p1[1], p2[1], p3[1], p4[1], p5[1], p6[1], p7[1]);
	this.min[2] = Math.min(p0[2], p1[2], p2[2], p3[2], p4[2], p5[2], p6[2], p7[2]);
	
	// calculate maximum of the transformed box
	this.max[0] = Math.max(p0[0], p1[0], p2[0], p3[0], p4[0], p5[0], p6[0], p7[0]);
	this.max[1] = Math.max(p0[1], p1[1], p2[1], p3[1], p4[1], p5[1], p6[1], p7[1]);
	this.max[2] = Math.max(p0[2], p1[2], p2[2], p3[2], p4[2], p5[2], p6[2], p7[2]);
	
	// center
	this.center = V3.add(this.min, this.max);
	this.center = V3.scale(this.center, 0.5);
	
	// radius
	V3.sub(this.max, this.min, AABB.tmpVec);
	this.radius = V3.length(AABB.tmpVec) / 2.0;
}

AABB.prototype.updateVBO = function(){
	if(this.vbo == null){
		this.vbo =  gl.createBuffer();
	}
	
	var sx = this.min[0];
	var sy = this.min[1];
	var sz = this.min[2];
	var gx = this.max[0];
	var gy = this.max[1];
	var gz = this.max[2];

	
	var vertices = [
        sx, sy, sz, gx, sy, sz,
        sx, sy, sz, sx, gy, sz,
        sx, sy, sz, sx, sy, gz,
        gx, gy, gz, sx, gy, gz,
        gx, sy, gz, gx, gy, gz,
        gx, gy, gz, gx, gy, sz,
        
        sx, gy, sz, sx, gy, gz,
        sx, gy, gz, sx, sy, gz,
        sx, sy, gz, gx, sy, gz,
        sx, gy, sz, gx, gy, sz,
        gx, sy, sz, gx, gy, sz,
        gx, sy, sz, gx, sy, gz
	];
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
	gl.bufferData(gl.ARRAY_BUFFER, new WebGLFloatArray(vertices), gl.STATIC_DRAW);
};

/**
 * returns the distance from minPos to maxPos in projected space
 */
AABB.prototype.getOnScreenSize = function(sceneNode, camera){
	var world = sceneNode.getGlobalTransformation();
	var view = camera.viewMatrix;
	var proj = camera.projectionMatrix;
	
	var worldViewProj = M4x4.mul(proj, M4x4.mul(view, world));
	var min = V3.transform(this.min, worldViewProj);
	var max = V3.transform(this.max, worldViewProj);
	var diff = V3.sub(min, max);
	var length = V3.length(diff);
	
	return length;
	
};

/**
 * 
 * @param {[r,g,b,a]} color each value must be between 0 and 1
 */
AABB.prototype.setColor = function(color){
	this.color = color;
}

AABB.prototype.render = function(sceneNode, camera){
	this.material.setColor(this.color);
	this.material.render(this, sceneNode, camera);
};



/**
 * returns the positive coordinate of the transformed bounding box. 
 * 
 * @see http://www.lighthouse3d.com/tutorials/view-frustum-culling/geometric-approach-testing-boxes-ii/
 * @param normal
 */
AABB.prototype.getPositive = function getPositive(normal){
	var min = this.min;
	var max = this.max;
	var p = [min[0], min[1], min[2]];
	if (normal[0] >= 0){
		p[0] = max[0];
	}
	if (normal[1] >=0){
		p[1] = max[1];
	}
	if (normal[2] >= 0){
		p[2] = max[2];
	}
	
	return p;
}

/**
 * returns the negative coordinate of the transformed bounding box. 
 * 
 * @see http://www.lighthouse3d.com/tutorials/view-frustum-culling/geometric-approach-testing-boxes-ii/
 * @param normal
 */
AABB.prototype.getNegative = function(normal){
	var min = this.min;
	var max = this.max;;
	var p = [max[0], max[1], max[2]];
	if (normal[0] >= 0){
		p[0] = min[0];
	}
	if (normal[1] >=0){
		p[1] = min[1];
	}
	if (normal[2] >= 0){
		p[2] = min[2];
	}
	
	return p;
}
