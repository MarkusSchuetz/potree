
precision highp float;

attribute vec3 aVertexPosition;
attribute vec4 aVertexColour;
attribute vec3 aNormal;

uniform mat4 world;
uniform mat4 view;
uniform mat4 proj;
uniform float uPointSizeMultiplicator;

varying vec3 vVertexColour;
varying vec3 vNormal;
varying vec3 vWorldPos;
// vDepth.x:	The linear depth. 
// vDepth.y:	DepthMap depth. 
varying vec2 vDepth; 
// image space normal
varying vec3 isNormal;

void main(void){
	vec4 worldPos = world * vec4(aVertexPosition, 1.0);
	vec4 pos = view * worldPos;
	vNormal = (worldPos * vec4(aNormal, 0.0)).xyz;
	vWorldPos = worldPos.xyz;
	
	// calculate point size depending on the distance from viewport
	// or rather: take a point in view space, translate it by {trans} along the x and y axis
	// and then calculate the translated distance in projected space.  
	// this distance, multiplied by a user defined factor, gives the desired point size.
	float trans = 0.5 + max(length(pos)-10.0, 0.0) / 30.0;
	vec4 p1 = proj * pos;
	vec4 p2 = proj * (pos + vec4(trans,trans,0.0,0.0));
	p1.xyz = p1.xyz / p1.w;
	p2.xyz = p2.xyz / p1.w;
	vec2 dist = p1.xy - p2.xy;
	float ps = length(dist) * 30.0;
	ps = max(3.0, ps);
	ps = ps * uPointSizeMultiplicator;
	
	gl_PointSize = ps;
	gl_Position = proj * pos;
	vVertexColour = aVertexColour.xyz / 256.0;
	vDepth = vec2( gl_Position.w, gl_Position.z / gl_Position.w * 0.5 + 0.5 );
	
	vec4 tn = proj * view * world * (/*vec4(aVertexPosition, 1.0) +*/ vec4(aNormal, 1.0));
	isNormal = tn.xyz / tn.w;
	//isNormal = isNormal - (gl_Position.xyz / gl_Position.w);
	//float nMul = min(0.0, isNormal.z*3.0);
	//gl_PointSize = gl_PointSize * nMul;
	/*if(isNormal.z > 0.0){
		gl_PointSize = 1.0;
		gl_Position = vec4(-10.0, -10.0, -10.0, 1.0);
		
	}*/
} 