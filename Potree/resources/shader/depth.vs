
precision highp float;

attribute vec3 aVertexPosition;

uniform mat4 world;
uniform mat4 view;
uniform mat4 proj;

// vDepth.x:	The linear depth. 
// vDepth.y:	DepthMap depth. 
varying float depth; 

void main(void){
	vec4 pos = proj * view * world * vec4(aVertexPosition, 1.0);
	depth = ((pos.z / pos.w) + 1.0) / 2.0;
	
	gl_Position = pos;
	
} 