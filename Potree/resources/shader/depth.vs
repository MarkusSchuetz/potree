
precision highp float;

attribute vec3 aVertexPosition;

uniform mat4 world;
uniform mat4 view;
uniform mat4 proj;

void main(void){
	vec4 pos = proj * view * world * vec4(aVertexPosition, 1.0);
	
	gl_Position = pos;
	
} 