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
 * @param name
 * @param mno
 * @param parent
 * @class
 * @augments SceneNode
 */
function PointcloudOctreeSceneNode(name, mno, parent){
	SceneNode.call(this, name, parent);
	this.mno = mno;
	
}

PointcloudOctreeSceneNode.prototype = new SceneNode(inheriting);
PointcloudOctreeSceneNode.base = SceneNode.prototype;

PointcloudOctreeSceneNode.prototype.render = function(camera) {

	if(this.mno == null){
		return;
	}
	if(!this.visible){
		return;
	}

	this.mno.render(this, camera);
};

PointcloudOctreeSceneNode.prototype.addTime = function addTime(time){
	this.age += time;
	
	this.mno.addTime(time);
};

