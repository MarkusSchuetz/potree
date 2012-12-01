
precision highp float;

varying vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform sampler2D uDepth;
uniform float uWidth;
uniform float uHeight;

float stepX = 1.0 / uWidth;
float stepY = 1.0 / uHeight;

void main(void)
{
/*
	stepX += 0.001;
	stepY += 0.001;

	vec4 texcol = texture2D(uTexture, vTextureCoord);  
	vec4 t1 = texture2D(uTexture, vTextureCoord + vec2(-stepX, stepY));
	vec4 t2 = texture2D(uTexture, vTextureCoord + vec2(0.0, stepY));
	vec4 t3 = texture2D(uTexture, vTextureCoord + vec2(stepX, stepY));
	vec4 t4 = texture2D(uTexture, vTextureCoord + vec2(-stepX, 0.0));
	vec4 t5 = texture2D(uTexture, vTextureCoord + vec2(0.0, 0.0));
	vec4 t6 = texture2D(uTexture, vTextureCoord + vec2(stepX, 0.0));
	vec4 t7 = texture2D(uTexture, vTextureCoord + vec2(-stepX, -stepY));
	vec4 t8 = texture2D(uTexture, vTextureCoord + vec2(0.0, -stepY));
	vec4 t9 = texture2D(uTexture, vTextureCoord + vec2(stepX, -stepY));
	
	vec4 col = vec4(0.0, 0.0, 0.0, 0.0);
	if(t5.w <= 0.01){
		col = t4;
	}
	col = t5;
	col.r = t5.w;
	col.g = t5.w;
	col.b = t5.w;
	col.w = 1.0;
	*/
	
	vec4 col = texture2D(uDepth, vTextureCoord);
	gl_FragColor = col;
} 