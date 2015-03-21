// -*- Mode: C++; coding: utf-8; tab-width: 3; indent-tabs-mode: tab; c-basic-offset: 3 -*-
precision mediump float;

uniform bool x3d_Lighting;        // true if a X3DMaterialNode is attached, otherwise false
uniform bool x3d_ColorMaterial;   // true if a X3DColorNode is attached, otherwise false

uniform bool      x3d_Texturing;  // true if a X3DTexture2DNode is attached, otherwise false
uniform sampler2D x3d_Texture;

varying vec4 frontColor; // color
varying vec4 backColor;  // color
varying vec4 t;          // texCoord

vec4
getTextureColor ()
{
	return texture2D (x3d_Texture, vec2 (t .s, t .t));
}

void
main ()
{
	vec4 finalColor = gl_FrontFacing ? frontColor : backColor;

	if (x3d_Lighting)
	{
		if (x3d_Texturing)
			finalColor *= getTextureColor ();

		gl_FragColor = finalColor;
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

		gl_FragColor = finalColor;
	}
}
