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
 * used for some evil javascript inheritance magic.
 * @see http://livingmachines.net/2009/03/creating-javascript-classes-part-4-method-overrides/
 */
var inheriting = { };



/**
 * load a binary resource from the given url.
 * 
 * @see https://developer.mozilla.org/En/Using_XMLHttpRequest 
 * 
 */
function load_binary_resource(url) {
	Logger.trace("loading "+url);
	var req = new XMLHttpRequest();
	req.open('GET', url, false);
	// The following line says we want to receive data as Binary and not as Unicode
	req.overrideMimeType('text/plain; charset=x-user-defined');
	req.send(null);
	// when accessing local files, req.status will be 0
	if (req.status != 200 && req.status != 0) {
		Logger.error("req.status: '" + req.status + "'");
		Logger.error("req.readyState: '" + req.readyState + "'");
		return '';
	}
	return req.responseText;
}

/**
 * load a binary resource directly into an an ArrayBuffer
 * 
 * @param url
 * @returns an arraybuffer with data from url
 */
function loadBinaryResourceIntoArrayBuffer(url) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, false);
	xhr.responseType = 'arraybuffer';
	xhr.overrideMimeType('text/plain; charset=x-user-defined');
	xhr.send(null);
	if (xhr.readyState == 4) {
		// when accessing local files, req.status will be 0
		if (xhr.status == 200 || xhr.status == 0) {
			var buffer = xhr.response;
			return buffer;
		} else {
			alert('Failed to load file! HTTP status: ' + xhr.status);
		}
	}

	return null;
}

/**
 * returns a list of get-parameters in the open url
 * 
 * @returns {___anonymous1456_1457}
 */
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
};

/**
 * add separators to large numbers
 * 
 * @param nStr
 * @returns
 */
function addCommas(nStr)
{
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

function logLRU(){
	Logger.info("");
	Logger.info("");
	Logger.info("");
	
	var lru = PointcloudOctreeNode.lruNodes;
	
	var string = "{ ";
	var curr = lru.first;
	var i = 0; 
	while(curr != null){
		string += curr.node.id;
		if(curr.next != null){
			string += ", ";
		}
		if( i > 20){
			Logger.info(string);
			string = "";
			i = 0;
		}
		
		curr = curr.next;
		i++;
	}
	string += "}";
	string += "(" + lru.size() + ")";
	Logger.info(string);
}
