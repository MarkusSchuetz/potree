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
 * @ignore
 */
function MeshManager(){
	
}

MeshManager.getMesh = function(name){
	
}

MeshManager.getMeshFileContent = function(name){
	var url = Config.meshDir + "/" + name;
	
	return load_binary_resource(url);
}