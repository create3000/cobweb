// -*- Mode: C++; coding: utf-8; tab-width: 3; indent-tabs-mode: tab; c-basic-offset: 3 -*-
precision mediump float;

uniform bool x3d_lighting;        // true if a X3DMaterialNode is attached, otherwise false
uniform bool x3d_colorMaterial;   // true if a X3DColorNode is attached, otherwise false

uniform bool      x3d_texturing;  // true if a X3DTexture2DNode is attached, otherwise false
uniform sampler2D x3d_texture;

varying vec4 frontColor; // color
varying vec4 backColor;  // color
varying vec4 t;          // texCoord

vec4
getTextureColor ()
{
	return texture2D (x3d_texture, vec2 (t .s, t .t));
}

void
main ()
{
	vec4 finalColor = gl_FrontFacing ? frontColor : backColor;

	if (x3d_lighting)
	{
		if (x3d_texturing)
			finalColor *= getTextureColor ();

		gl_FragColor = finalColor;
	}
	else
	{
		if (x3d_colorMaterial)
		{
			if (x3d_texturing)
				finalColor *= getTextureColor ();
		}
		else
		{
			if (x3d_texturing)
				finalColor = getTextureColor ();
		}

		gl_FragColor = finalColor;
	}
}
