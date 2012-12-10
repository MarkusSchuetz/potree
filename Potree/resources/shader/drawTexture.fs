
precision highp float;

varying vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform sampler2D uDepth;
uniform float uWidth;
uniform float uHeight;

void main(void)
{
	vec4 col = texture2D(uDepth, vTextureCoord);
	gl_FragColor = col;
	//gl_FragColor = vec4(1,0,0,1);
	//gl_FragColor = vec4(vTextureCoord, 0,1);
} 