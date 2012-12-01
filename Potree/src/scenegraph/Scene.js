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
function Scene(name){
	this.name = name;
	this.rootNode = new SceneNode("root");
	this.rootNode.setScene(this);
	this.cameras = new Object();
	this.cameras["default"] = new Camera("default");
	this.cameras["default"].setScene(this);
	this.lights = new Object();
	this.activeCamera = this.cameras["default"];
}



