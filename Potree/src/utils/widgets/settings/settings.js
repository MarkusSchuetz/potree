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


function SettingsView(parentID){
	parentComponent = $(parentID);
	
	parentComponent.innerHTML = load_binary_resource("src/utils/widgets/settings/settings.html");
	
	$('chkShowGrid').onclick = this.handleChkShowGrid;
	//$('chkShowBoundingBoxes').onclick = this.handleChkShowBoundingBox;
	$('chkActivateLOD').onclick = this.handleChkActivateLOD;
	$('chkFrustumCulling').onclick = this.handleChkFrustumCulling;
	$('nrLODMultiplicator').onchange = this.handleNrLODMultiplicator;
	$('nrCacheSize').onchange = this.handleNrCacheSize;
};

SettingsView.prototype.handleChkShowGrid = function(event){
	Potree.Settings.showGrid = $('chkShowGrid').checked == true;
};

SettingsView.prototype.handleChkShowBoundingBox = function(event){
	//Potree.Settings.showBoundingBoxes = $('chkShowBoundingBoxes').checked == true;
};

SettingsView.prototype.handleChkFrustumCulling = function(event){
	Potree.Settings.frustumCulling = $('chkFrustumCulling').checked == true;
};

SettingsView.prototype.handleChkActivateLOD = function(event){
	Potree.Settings.LOD = $('chkActivateLOD').checked == true;
};

SettingsView.prototype.handleNrLODMultiplicator = function(event){
	Potree.Settings.LODMultiplicator = parseFloat($('nrLODMultiplicator').value);
};

SettingsView.prototype.handleNrCacheSize = function(event){
	var value = parseFloat($('nrCacheSize').value);
	PointcloudOctreeNode.memoryThreshold = value * 1000 * 1000;
};
