

precision highp float;

varying vec3 vNormal;
varying vec2 vTextureCoord;
varying vec3 world_pos;

uniform mat4 world;
uniform sampler2D uTexture;
uniform vec3 lightPos;
uniform vec3 lightColor;
uniform vec3 uViewPos;

void main(void){
	vec3 pos = world_pos;
	vec3 L = normalize(lightPos - pos);
	vec3 N = normalize(vNormal);
	vec3 R = reflect(L, N);
	vec3 E = normalize(uViewPos - pos);
	
	float diffuse = clamp(dot(N, L), 0.0, 1.0);
	float specular  = max(dot(E, -R),  0.0);
	specular  = pow(specular , 32.0);
	
	vec3 col = lightColor*diffuse;
	col = col + vec3(1,1,1)*specular ;
	
	gl_FragColor = vec4(col, 1);
} 