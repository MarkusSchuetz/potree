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
function LightType() {
}

/**
 * @constant
 */
LightType.OMNI = "";

/**
 * @constant
 */
LightType.SPOT = "";

/**
 * @constant
 */
LightType.DIRECTIONAL = "";

/**
 * 
 * @param name
 * @param parent
 * @class
 * @augments SceneNode
 */
function Light(name, parent) {
	SceneNode.call(this, name, parent);
	this.type = LightType.OMNI;
	this.colour = [1, 1, 1, 1];
}

Light.prototype = new SceneNode(inheriting);

Light.prototype.notifyChildAttachedToParent = function() {
	this.scene.lights[this.name] = this;
};
