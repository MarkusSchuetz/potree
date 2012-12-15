

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
	gl_FragColor = vec4(vTextureCoord, 0,1);
	
	if(castShadows){
		vec4 pl = lightProj*lightView*vec4(world_pos, 1.0);
		pl.xyz = pl.xyz/pl.w;
		
		vec3 d = vec3(0.0, 0.0, 0.0);
		d.x = L.x;
		d.y = L.y;
		d.z = -L.z;

		vec4 refDepth = textureCube(uShadowMap, d);
		float depth = length(lightPos - pos);
		
		if(refDepth.x <= 0.0){
			gl_FragColor = vec4(col, 1.0);
		}else if( depth - 0.51 > refDepth.x){
			gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
		}else{
			gl_FragColor = vec4(col, 1.0);
		}
		
		//gl_FragColor = vec4(refDepth.x / 15.0, 0.0, 0.0, 1.0);
		//gl_FragColor = vec4(d.x, 0.0, 0.0, 1.0);
	}else{
		gl_FragColor = vec4(col, 1.0);
	}
} 





