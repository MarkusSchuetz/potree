
precision highp float;

attribute vec3 aVertexPosition;
attribute vec4 aVertexColour;
//attribute vec3 aNormal;

uniform mat4 world;
uniform mat4 view;
uniform mat4 proj;
uniform float uPointSize;

varying vec3 vVertexColour;
//varying vec3 vNormal;
varying vec3 vWorldPos;
// vDepth.x:	The linear depth. 
// vDepth.y:	DepthMap depth. 
varying vec2 vDepth; 

void main(void){
	vec4 worldPos = world * vec4(aVertexPosition, 1.0);
	vec4 pos = view * worldPos;
	//vNormal = (worldPos * vec4(aNormal, 0.0)).xyz;
	vWorldPos = worldPos.xyz;
	
	gl_PointSize = uPointSize;
	gl_Position = proj * pos;
	vVertexColour = aVertexColour.xyz / 256.0;
	vDepth = vec2( gl_Position.w, gl_Position.z / gl_Position.w * 0.5 + 0.5 );
} 