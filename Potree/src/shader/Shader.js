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
 * @class
 * This class is meant to be subclassed for every glsl shader.
 * uniforms and attributes have to be specified in initUniforms and initAttributes
 * 
 */
function Shader(name, vertexShader, fragmentShader){
	if (arguments[0] === inheriting) return;
	
	if(name == null){
		name = "Shader_" + Shader.count;
	}
	
	this.vertexShaderName = null;
	this.fragmentShaderName = null;
	this.program = null;
	this.name = name;
	this.setVertexShaderName(vertexShader);
	this.setFragmentShaderName(fragmentShader);
	
	this.relink();
	this.initUniforms();
	this.initAttributes();
	
	ShaderManager.addShader(this);
	
	Logger.info("Shader created: " + name);
	Shader.count++;
}

Shader.count = 0;

function ShaderAttribute(){}

ShaderAttribute.Position = 	"aVertexPosition";
ShaderAttribute.Color = 		"aVertexColor";
ShaderAttribute.Normal = 		"aVertexNormal";

Shader.prototype.initUniforms = function(){
	// overwrite!
	
	// call 
	// 'this.uVarname = gl.getUniformLocation(this.program, "varname");' 
	// for every uniform variable in your shader
};

Shader.prototype.initAttributes = function(){
	// overwrite!
	
	// call 
	// 'this.aAttribute = gl.getAttribLocation(this.program, "aAttribute");' 
	// for every attribute in your shader
};

Shader.prototype.relink = function(){
	if(this.vertexShaderName == null){
		logError("Shader.vertexShaderName is null -> Shader won't be linked");
	}
	if(this.fragmentShaderName == null){
		logError("Shader.fragmentShaderName is null -> Shader won't be linked");
	}
	
	if(this.program != null){
		gl.deleteProgram(program);
	}
	this.program = gl.createProgram();
	var vertexShader = ShaderManager.getVertexShader(this.vertexShaderName);
	var fragmentShader = ShaderManager.getFragmentShader(this.fragmentShaderName);
	gl.attachShader(this.program, vertexShader);
	gl.attachShader(this.program, fragmentShader);
	
	gl.linkProgram(this.program);
	if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
		Logger.error(gl.getProgramInfoLog(this.program));
		return;
	}
};

Shader.prototype.setVertexShaderName = function(name){
	this.vertexShaderName = name;
};

Shader.prototype.setFragmentShaderName = function(name){
	this.fragmentShaderName = name;
};

