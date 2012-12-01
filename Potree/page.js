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

//var debugView = null;
var camHandler = null;

function init() {
	Logger.setWindowState(LoggerWindowState.MINIMIZED);
	
	// initialization
//	debugView = new DebugView("debugContainer");
	settingsView = new SettingsView("settingsContainer");
	var success = Potree.init($('canvas'));
	if(!success){
		return;
	}
	
	// shaders
	var drawTextureShader = new DrawTextureShader("drawTexture");
	var defaultShader = new PhongShader("default");
	var defaultFlat = new FlatShader("defaultFlat");
	var aabbShader = new FlatShader("AABB");
	
	// materials
	var aabbMaterial = new FlatMaterial("aabb");
	var defaultMaterial = new PhongMaterial("default");
	var pointCloudMaterial = new PointCloudMaterial("pointCloud");

	TextureManager.loadTexture("resources/textures/texture.jpg", "texture");

	// scenegraph
	var scene = Potree.currentScene;
	var cam = scene.activeCamera;
	
	// lights
	var light = new Light("light", scene.rootNode);
	light.translate(100,100,100);

	// camera
	cam.translate(0,1.0,0);
	Potree.draw();

	// add all pointcloud icons to the dom
	for( var index in pointclouds){
		var pointcloud = pointclouds[index]; 
		
		var elPointCloudIcon = document.createElement("div");
		elPointCloudIcon.style.background = "url("+pointcloud.iconUrl+")";
		elPointCloudIcon.style.backgroundSize = "cover";
		elPointCloudIcon.style.cssFloat = "left";
		elPointCloudIcon.onclick = Function("loadCloud('"+pointcloud.name+"')");
		
		elPointCloudIcon.className  = "thumbPointCloudContainer";
		
		var elPointCloudLabel = document.createElement("div");
		elPointCloudLabel.innerHTML = pointcloud.label;
		elPointCloudLabel.className  = "thumbPointCloudLabel";
		
		elPointCloudIcon.appendChild(elPointCloudLabel);
		$('pointClouds').appendChild(elPointCloudIcon);
	}
	// necessary so that the parent container will wrap around the 
	// point cloud icons
	var elClear = document.createElement("div");
	elClear.style.clear = "left";
	$('pointClouds').appendChild(elClear);
	

	$('canvas').focus();

	mainLoop();
}

var fpsHistory = new Array();
function update(time){
	
	
	var fps = 1 / time;

	fpsHistory.push(fps);
	if(fpsHistory.length > 10){
		fpsHistory.splice(0, 1);
	}
	var mean = 0;
	for(var i = 0; i < fpsHistory.length; i++){
		mean += fpsHistory[i];
	}
	mean = mean / fpsHistory.length;
	
	Potree.update(time);
	Potree.camHandler.update(time);
//	debugView.set("FPS:", mean.toFixed(2));
}

var lastLoopTime = null;
var timeSinceLastFrame = null;
function calculateTimeSinceLastFrame(){
	var newDrawTime = new Date().getTime();
	var fps = null;
	if (lastLoopTime != null) {
		timeSinceLastFrame = (newDrawTime - lastLoopTime) / 1000.0;
	}else{
		timeSinceLastFrame = 0;
	}
	lastLoopTime = new Date().getTime();

}

function mainLoop(){
	calculateTimeSinceLastFrame();

	update(timeSinceLastFrame);
	Potree.draw();
	
	// with 0ms, interaction becomes a lot slower in firefox.
	setTimeout(mainLoop, 10);
// 	window.webkitRequestAnimationFrame (mainLoop);
}

var mnoNodes = new Object();
var activeMnoNode;

function loadCloud(name){
	var cloud = pointclouds[name];
	if(cloud == null){
		return;
	}
	
	var scene = Potree.currentScene;
	var cam = scene.activeCamera;
	
	var pointCloudMaterial = MaterialManager.getMaterial("pointCloud");
	
	if(activeMnoNode != null){
		activeMnoNode.setVisible(false);
	}
	
	if(mnoNodes[cloud.name] == null){
		
		var loader = new POCLoader();
		var mno = loader.load(cloud.url);
		
		var mnoNode = new PointcloudOctreeSceneNode(cloud.name, mno, scene.rootNode);
		mnoNode.rotate(-Math.PI / 2.0, V3.$(1,0,0));
		if(cloud.scale != null){
			mnoNode.scale(cloud.scale[0], cloud.scale[1], cloud.scale[2]);
		}
		if(cloud.transform != null){
			mnoNode.transform = cloud.transform;
		}
		activeMnoNode = mnoNode;
		mnoNodes[cloud.name] = mnoNode;
		
		cam.setTransform(M4x4.I);
		cam.translate(cloud.camPosition[0], cloud.camPosition[1], cloud.camPosition[2]);
		
		setIlluminationMode(cloud.illumination);
		setPointSize(cloud.pointSize);

		if(activeMnoNode != null){
			activeMnoNode.setVisible(true);
		}
		
	}else{
		activeMnoNode = mnoNodes[cloud.name];
		
		cam.setTransform(M4x4.I);
		cam.translate(cloud.camPosition[0], cloud.camPosition[1], cloud.camPosition[2]);
		
		setIlluminationMode(cloud.illumination);
		setPointSize(cloud.pointSize);

		if(activeMnoNode != null){
			activeMnoNode.setVisible(true);
		}
	}
}

function setIlluminationMode(mode){
	var material = MaterialManager.getMaterial("pointCloud");
	if(mode == "flat"){
		material.setIlluminationMode(PointCloudIlluminationMode.FLAT);
	}else if(mode == "phong"){
		material.setIlluminationMode(PointCloudIlluminationMode.PHONG);
	}else if(mode == "normals"){
		material.setIlluminationMode(PointCloudIlluminationMode.NORMALS);
	}
	
}

function setRendermode(mode){
	var material = MaterialManager.getMaterial("pointCloud");
	if(mode == "fixedCircles"){
		material.setRenderMode(PointCloudRenderMode.FIXED_CIRCLE);
	}else if(mode == "weightedCircles"){
		material.setRenderMode(PointCloudRenderMode.WEIGHTED_CIRCLE);
	}else if(mode == "gaussianSplats"){
		material.setRenderMode(PointCloudRenderMode.GAUSSIAN_SPLAT);
	}
}

function setPointSize(size){
	var material = MaterialManager.getMaterial("pointCloud");
	material.setPointSize(size);
}

function setSigmaFactor(sigmaFactor){
	var material = MaterialManager.getMaterial("pointCloud");
	material.setSigmaFactor(sigmaFactor);
}

function setBlendDepth(blendDepth){
	var material = MaterialManager.getMaterial("pointCloud");
	material.setBlendDepth(blendDepth);
}

function setGlossiness(glossiness){
	var material = MaterialManager.getMaterial("pointCloud");
	material.setGlossiness(glossiness);
}

