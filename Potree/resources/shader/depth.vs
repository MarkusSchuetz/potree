
precision highp float;

attribute vec3 aVertexPosition;

uniform mat4 world;
uniform mat4 view;
uniform mat4 proj;

//varying vec3 vVertexColour;
varying vec3 vNormal;
varying vec3 vWorldPos;
// vDepth.x:	The linear depth. 
// vDepth.y:	DepthMap depth. 
varying vec2 vDepth; 

void main(void){
	vec4 worldPos = world * vec4(aVertexPosition, 1.0);

	gl_Position = proj * view * world * vec4(aVertexPosition, 1.0);
	vDepth = vec2( gl_Position.w, gl_Position.z / gl_Position.w );
} 