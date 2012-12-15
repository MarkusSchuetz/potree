

precision highp float;

varying vec3 vNormal;
varying vec2 vTextureCoord;
varying vec3 world_pos;
varying vec4 lightSpacePos;

uniform mat4 world;
//uniform sampler2D uShadowMap;
uniform samplerCube uShadowMap;
uniform vec3 lightPos;
uniform vec3 lightColor;
uniform vec3 uViewPos;
uniform bool castShadows;
uniform mat4 lightView;
uniform mat4 lightProj;

float getShadow(vec3 L, vec3 pos){
	vec4 pl = lightProj*lightView*vec4(pos, 1.0);
	pl.xyz = pl.xyz/pl.w;
	
	vec3 d = vec3(0.0, 0.0, 0.0);
	d.x = L.x;
	d.y = L.y;
	d.z = -L.z;

	vec4 refDepth = textureCube(uShadowMap, d);
	float depth = length(lightPos - pos);
	
	float shadow = 0.0;
	if(refDepth.x <= 0.0){
		shadow = 0.0;
	}else if( depth - 0.51 > refDepth.x){
		shadow = 1.0;
	}else{
		shadow = 0.0;
	}
	
	return shadow;
}

vec4 illuminate(vec3 L, vec3 N, vec3 E, vec3 R ){
	float diffuse = clamp(dot(N, L), 0.0, 1.0);
	float specular  = max(dot(E, -R),  0.0);
	specular  = pow(specular , 32.0);
	
	vec4 illumination = vec4(0.0, 0.0, 0.0, 1.0);
	illumination.xyz = lightColor*diffuse;
	illumination.xyz = illumination.xyz + vec3(1,1,1)*specular;
	
	return illumination;
}

void main(void){
	vec3 pos = world_pos;
	vec3 L = normalize(lightPos - pos);
	vec3 N = normalize(vNormal);
	vec3 R = reflect(L, N);
	vec3 E = normalize(uViewPos - pos);
	
	vec4 col = illuminate(L, N, E, R);
	
	if(castShadows){
		float shadow = getShadow(L, pos);
		col.xyz = col.xyz*(1.0-shadow);
	}
	
	gl_FragColor = col;
} 





