// -*- Mode: C++; coding: utf-8; tab-width: 3; indent-tabs-mode: tab; c-basic-offset: 3 -*-
precision mediump float;

#define NO_FOG           0
#define LINEAR_FOG       1
#define EXPONENTIAL_FOG  2
#define EXPONENTIAL2_FOG 3

uniform int   x3d_fogType;
uniform vec3  x3d_fogColor;
uniform float x3d_fogVisibilityRange;

uniform bool x3d_Lighting;        // true if a X3DMaterialNode is attached, otherwise false
uniform bool x3d_ColorMaterial;   // true if a X3DColorNode is attached, otherwise false

uniform bool      x3d_Texturing;  // true if a X3DTexture2DNode is attached, otherwise false
uniform sampler2D x3d_Texture;

varying vec4  frontColor; // color
varying vec4  backColor;  // color
varying vec4  t;          // texCoord
varying float dv;         // distance to vertex

float
getFogInterpolant ()
{
	if (x3d_fogType == NO_FOG)
		return 1.0;

	if (dv >= x3d_fogVisibilityRange)
		return 0.0;

	if (x3d_fogType == LINEAR_FOG)
		return (x3d_fogVisibilityRange - dv) / x3d_fogVisibilityRange;

	if (x3d_fogType == EXPONENTIAL_FOG)
		return exp (-dv / (x3d_fogVisibilityRange - dv));

	return 1.0;
}

vec4
getTextureColor ()
{
	return texture2D (x3d_Texture, vec2 (t .s, t .t));
}

void
main ()
{
	float f0 = getFogInterpolant ();

	vec4 finalColor = gl_FrontFacing ? frontColor : backColor;

	if (x3d_Lighting)
	{
		if (x3d_Texturing)
			finalColor *= getTextureColor ();
	}
	else
	{
		if (x3d_ColorMaterial)
		{
			if (x3d_Texturing)
				finalColor *= getTextureColor ();
		}
		else
		{
			if (x3d_Texturing)
				finalColor = getTextureColor ();
		}
	}

	gl_FragColor .rgb = mix (x3d_fogColor, finalColor .rgb, f0);
	gl_FragColor .a   = finalColor .a;
}
