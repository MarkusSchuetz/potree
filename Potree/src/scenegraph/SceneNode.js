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
 */
function SceneNode(name, parent) {
	if (arguments[0] === inheriting) return;
	this.scene = null;
	this.name = name;
	this.parent = parent;
	this.children = new Object();
	this.descendants = new Array();
	this.aabb = null;
	this.visible = true;

	// age in s
	this.age = 0;

	// Node befindet sich in einem unvollständigen zustand.
	// Mittels resolve() wird das Node sowie alle Child-Nodes aktualisiert.
	this.needsUpdate = true;

	this._transform = M4x4.I;
//	this.globalTransform = M4x4.I;
	if (parent != null) {
		parent.addChild(this);
		this.scene = parent.scene;
	}
}

SceneNode.prototype.setVisible = function setVisible(visible){
	this.visible = visible;
};

SceneNode.prototype.setNeedsUpdate = function() {
	this.needsUpdate = true;
	for ( var index in this.children) {
		this.children[index].setNeedsUpdate();
	}
};

SceneNode.prototype.addTime = function(time) {
	this.age += time;

	for ( var childname in this.children) {
		this.children[childname].addTime(time);
	}
};

SceneNode.prototype.setScene = function(scene) {
	this.scene = scene;
};

SceneNode.prototype.setParent = function(parent) {
	delete parent[this.name];
	this.parent = parent;
	parent.children[this.name] = this;
	this.scene = parent.scene;
};

SceneNode.prototype.addChild = function(child) {
	if (child.parent != null) {
		delete child.parent.children[child.name];
	}

	child.parent = this;
	child.scene = this.scene;
	this.children[child.name] = child;
	child.notifyChildAttachedToParent();
};

SceneNode.prototype.notifyChildAttachedToParent = function() {

};

SceneNode.prototype.getLocalTransformation = function() {
	return this._transform;
};

SceneNode.prototype.getGlobalTransformation = function getGlobalTransformation() {
	var cur = this;
	var globalTransform = cur._transform;
	while (cur.parent != null) {
		cur = cur.parent;
		globalTransform = M4x4.mul(cur._transform, globalTransform);
	}
	return globalTransform;
};

SceneNode.prototype.getLocalPosition = function() {
	return V3.transform(V3.$(0, 0, 0), this._transform);
};

SceneNode.prototype.getGlobalPosition = function() {
	return V3.transform(V3.$(0, 0, 0), this.getGlobalTransformation());
};

SceneNode.prototype.getLocalDirection = function(){
	var pos1 = V3.transform(V3.$(0, 0, 0), this._transform);
	var pos2 = V3.transform(V3.$(0, 0, -1), this._transform);
	
	var dir = V3.normalize(V3.sub(pos2, pos1));
	return dir;
};

SceneNode.prototype.getGlobalDirection = function(){
	var transform = this.getGlobalTransformation();
	var pos1 = V3.transform(V3.$(0, 0, 0), transform);
	var pos2 = V3.transform(V3.$(0, 0, -1), transform);
	
	var dir = V3.normalize(V3.sub(pos2, pos1));
	return dir;
};

SceneNode.prototype.getUpVector = function() {
	var pos = V3.transform(V3.$(0, 0, 0), this._transform);
	var absUp = V3.transform(V3.$(0, 1, 0), this._transform);
	var up = V3.sub(absUp, pos);

	return up;
};

SceneNode.prototype.getSideVector = function() {
	var pos = V3.transform(V3.$(0, 0, 0), this._transform);
	var absSide = V3.transform(V3.$(1, 0, 0), this._transform);
	var side = V3.sub(absSide, pos);

	return side;
};

SceneNode.prototype.getViewVector = function() {
	var pos = V3.transform(V3.$(0, 0, 0), this._transform);
	var absView = V3.transform(V3.$(1, 0, 0), this._transform);
	var view = V3.sub(absView, pos);

	return view;
};

Object.defineProperty(SceneNode.prototype, "transform", {
	get: function(){
		return this._transform;
	},
	set: function(transform){
		this._transform = transform;
	}
});


/**
 * Liefert das Inverse der lokalen Transformationsmatrix unter der Annahme, dass
 * es sich um eine Matrix handelt, die nach Rückverschiebung zum Ursprung
 * orthogonal ist.
 * 
 * @returns
 */
SceneNode.prototype.getInverseLocalTransformation = function() {
	var pos = this.getLocalPosition();
	var toOrigin = M4x4.translate3(-pos[0], -pos[1], -pos[2], M4x4.I);
	var atOrigin = M4x4.mul(toOrigin, this._transform);
	var inverseOrthonormal = M4x4.inverseOrthonormal(atOrigin);

	return M4x4.mul(inverseOrthonormal, toOrigin);
};

/**
 * Liefert das Inverse der globalen Transformationsmatrix unter der Annahme,
 * dass es sich um eine Matrix handelt, die nach Rückverschiebung zum Ursprung
 * orthogonal ist.
 * 
 * @returns
 */
SceneNode.prototype.getInverseGlobalTransformation = function() {
	var pos = this.getGlobalPosition();
	var toOrigin = M4x4.translate3(-pos[0], -pos[1], -pos[2], M4x4.I);
	var atOrigin = M4x4.mul(toOrigin, this.getGlobalTransformation());
	var inverseOrthonormal = M4x4.inverseOrthonormal(atOrigin);

	return M4x4.mul(inverseOrthonormal, toOrigin);
};

SceneNode.prototype.translate = function(x, y, z) {
	this._transform = M4x4.translate3(x, y, z, this._transform);
};

SceneNode.prototype.rotate = function(angle, axis) {
	this._transform = M4x4.mul(M4x4.rotate(angle, axis, M4x4.I), this._transform);
};

SceneNode.prototype.rotateX = function(angle) {
	this._transform = M4x4.mul(M4x4.rotate(angle, V3.$(1, 0, 0), M4x4.I), this._transform);
};

SceneNode.prototype.rotateY = function(angle) {
	this._transform = M4x4.mul(M4x4.rotate(angle, V3.$(0, 1, 0), M4x4.I), this._transform);
};

SceneNode.prototype.rotateZ = function(angle) {
	this._transform = M4x4.mul(M4x4.rotate(angle, V3.$(0, 0, 1), M4x4.I), this._transform);
};

SceneNode.prototype.scale = function(x, y, z) {
	this._transform = M4x4.scale3(x, y, z, this._transform);
};

SceneNode.prototype.render = function(camera) {
	// in unterklassen überschreiben

	if(this.visible){
		for ( var childname in this.children) {
			this.children[childname].render(camera);
		}
	}

};

SceneNode.prototype.toString = function() {
	return this.asTreeString(0);
};

SceneNode.prototype.asTreeString = function(level) {
	var msg = " ".repeat(level * 3) + this.name + "\t"
			+ this.getGlobalPosition() + "\n";
	// msg += this.getGlobalTransformation().toMatrixFormString() + "\n";
	for ( var child in this.children) {
		msg += this.children[child].asTreeString(level + 1);
	}

	return msg;
};
