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
 * 
 * @param parentID
 * @class
 */
function DebugView(parentID){
	parentComponent = $(parentID);
	
	parentComponent.innerHTML = load_binary_resource("src/utils/debug/debug.html");
	
	this.values = new Object();
	this.tableRows = new Object();
	this.tableColumnsValue = new Object(); 
}

DebugView.prototype.set = function(key, value){
	if(this.values[key] == null){
		var elTr = document.createElement("tr");
		var elKey = document.createElement("td");
		var elValue = document.createElement("td");
		elKey.innerHTML = key;
		elValue.innerHTML = value;
		
		this.tableRows[key] = elTr;
		this.tableColumnsValue[key] = elValue;
		
		elTr.appendChild(elKey);
		elTr.appendChild(elValue);
		$('debug_table').appendChild(elTr);
	}
	
	this.values[key] = value;
	this.tableColumnsValue[key].innerHTML = value;
};

DebugView.prototype.get = function(key){
	return this.values[key];
}

