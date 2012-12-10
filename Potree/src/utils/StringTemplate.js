
function StringTemplate(string){
	this.string = string;
	this.data = {};
}

StringTemplate.prototype.set = function(key, value){
	this.data[key] = value;

};

StringTemplate.prototype.evaluate = function(){
	var data = this.data;
	return this.string.replace(/%(\w*)%/g,
		function(m,key){
			return data.hasOwnProperty(key)?data[key]:"";
		}
	);
};


////Updated 28 October 2011: Now allows 0, NaN, false, null and undefined in output. 
//function template(templateid,data){
//    return document.getElementById(templateid).innerHTML.replace(/%(\w*)%/g,function(m,key){return data.hasOwnProperty(key)?data[key]:"";});
//}