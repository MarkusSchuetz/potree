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
 * @class
 * @augments SceneNode
 * 
 */
function Camera(name) {
	SceneNode.call(this, name);
	this.nearClipPlane = 1.1;
	this._farClipPlane = 100.0;
	this._fieldOfView = 60.0;
	this._aspectRatio = 1;
	this._viewMatrix = null;
	this._projectionMatrix = null;
	this.updateViewMatrix();
	this.updateProjectionMatrix();

}

Camera.prototype = new SceneNode(inheriting);
Camera.base = SceneNode.prototype;

Object.defineProperties(Camera.prototype, {
	"farClipPlane" : {
		set: function(farClipPlane){
			this._farClipPlane = farClipPlane;
			this.updateProjectionMatrix();
		},
		get: function(){
			return this._farClipPlane;
		}
	},
	"transform": {
		set: function(transform){
			Object.getOwnPropertyDescriptor(Camera.base, 'transform').set.call(this, transform);
			this.updateViewMatrix();
		},
		get: function(){
			return this._transform;
		}
	},
	"frustum": {
		get: function(){
			return Frustum.fromCamera(this);
		}
	},
	"projectionMatrix": {
		get: function(){
			return this._projectionMatrix;
		}
	},
	"viewMatrix": {
		get: function(){
			return this._viewMatrix;
		},
		set: function(viewMatrix){
			this._viewMatrix = viewMatrix;
		}
	},
	"fieldOfView": {
		set: function(fieldOfView){
			this._fieldOfView = fieldOfView;
			this.updateProjectionMatrix();
		},
		get: function(){
			return this._fieldOfView;
		}
	},
	"aspectRatio": {
		set: function(aspectRatio){
			this._aspectRatio = aspectRatio;
			this.updateProjectionMatrix();
		},
		get: function(){
			return this._aspectRatio;
		}
	}
});

Camera.prototype.updateProjectionMatrix = function(){
	this._projectionMatrix = M4x4.makePerspective(this.fieldOfView, this.aspectRatio,
			this.nearClipPlane, this.farClipPlane);
};

/**
 * calculates the current view matrix and stores it in _viewMatrix. use .viewMatrix if you want to get the matrix.
 */
Camera.prototype.updateViewMatrix = function(){
	this.viewMatrix = this.getInverseGlobalTransformation();
};

Camera.prototype.translate = function(x, y, z){
	Camera.base.translate.call(this, x, y, z);
	this.updateViewMatrix();
};




