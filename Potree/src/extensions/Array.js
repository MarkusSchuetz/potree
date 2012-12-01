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
 * @class extensions for Arrays
 * 
 * @author Markus Schütz
 */
Array = Array;

/**
 * remove all occurences of element in the array
 */
Array.prototype.remove=function(element){
	var index = null;
	while((index = this.indexOf(element)) != -1){
		this.splice(index, 1);
	}
};

Array.prototype.contains = function(element){
	var index = this.indexOf(element);
	return index != -1;
};