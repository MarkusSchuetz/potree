
precision highp float;

uniform sampler2D uLinearDepthMap;
uniform vec2 uViewportSize;
uniform float uFarClipPlane;

varying vec3 vVertexColour;
varying vec3 vNormal;
varying vec3 vWorldPos;
varying vec2 vDepth; 


void main(void){

	
	float a = pow(2.0*(gl_PointCoord.x - 0.5), 2.0);
	float b = pow(2.0*(gl_PointCoord.y - 0.5), 2.0);
	float c = 1.0 - (a + b);
	
	if(c < 0.0){
		discard;
	}

	gl_FragColor = vec4( vVertexColour.xyz, 1.0 );	
/*
	vec2 depthCoord = gl_FragCoord.xy / uViewportSize.xy;
	vec4 storedDepth = texture2D(uLinearDepthMap, depthCoord);
	if(vDepth.x - 0.1 > storedDepth.x){
		discard;
	}else{
	  	float d = c + 0.5;
	  	float sigmaFactor = 2.0;
	  	float x = d * sigmaFactor;
		float weight = exp( x * x * 0.5 );

		// rgb: gauss-weighted color, a: weight-counter for later normalization
		gl_FragColor = vec4( weight * vVertexColour.xyz, weight );		
		//gl_FragColor = vec4( weight * c, 0.0, 0.0, weight );		
	}*/
	
  	
} 