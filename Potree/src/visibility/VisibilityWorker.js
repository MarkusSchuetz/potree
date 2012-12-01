

importScripts("../../libs/mjs/mjs.js");
importScripts("../extensions/mjs.js");
importScripts("../utils/utils.js");
importScripts("../scenegraph/AABB.js");
importScripts("../scenegraph/SceneNode.js");
importScripts("../scenegraph/PointCloudOctreeSceneNode.js");
importScripts("../objects/PointCloudOctree.js");

function doStuff(){
	postMessage("doStuff()");
	
	setTimeout(doStuff, 1000);
}

self.onmessage = function(event){
	if(event.data instanceof SceneNode){
		postMessage("yeah");
	}else{
		postMessage("damn");
	}
	
};