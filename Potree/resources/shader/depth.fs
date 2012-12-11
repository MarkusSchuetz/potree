// see PointSizeDepth.fs.cg

precision highp float;

// vDepth.x:	The linear depth. 
// vDepth.y:	DepthMap depth. 
varying float depth; 


void main(void){
	gl_FragColor = vec4(depth, 0.0, 0.0, 1.0);
} 