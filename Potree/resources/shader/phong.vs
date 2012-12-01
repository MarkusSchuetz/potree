
precision highp float;

attribute vec3 aVertexPosition;
attribute vec3 aNormal;
attribute vec2 aTextureCoord;

uniform mat4 world;
uniform mat4 view;
uniform mat4 proj;

varying vec3 vNormal;
varying vec2 vTextureCoord;
varying vec3 world_pos;

void main(void){
	vNormal = (world * vec4(aNormal, 0.0)).xyz;
	vTextureCoord = aTextureCoord;
	world_pos = (world * vec4(aVertexPosition, 1.0)).xyz;
	gl_Position = proj * view * world * vec4(aVertexPosition, 1.0);
} 