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
 * @param {String} name a unique name for the material or null. If name is null, a unique name will be generated.  
 * @class The base class for all materials.
 * @author Markus Sch�tz
 */
function Material(name){
	if (arguments[0] === inheriting) return;
	
	if(name == null){
		name = "Material_" + Material.count;
	}
	this.name = name;
	
	MaterialManager.addMaterial(this);
	
	Material.count++;
}

Material.count = 0;