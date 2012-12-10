// see PointSizeDepth.fs.cg

precision highp float;

// vDepth.x:	The linear depth. 
// vDepth.y:	DepthMap depth. 
varying vec2 	vDepth; 
varying vec3 vVertexColour;
varying vec3 vNormal;
varying vec3 vWorldPos;


void main(void){
	gl_FragColor = vec4(vDepth.x / 5.0, 0.0, 0.0, 1.0);
} 