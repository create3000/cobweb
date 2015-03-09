// -*- Mode: C++; coding: utf-8; tab-width: 3; indent-tabs-mode: tab; c-basic-offset: 3 -*-
precision mediump float;

uniform bool x3d_lighting;        // true if a X3DMaterialNode is attached, otherwise false
uniform bool x3d_colorMaterial;   // true if a X3DColorNode is attached, otherwise false

uniform bool      x3d_texturing;  // true if a X3DTexture2DNode is attached, otherwise false
uniform sampler2D x3d_texture;
uniform int       x3d_textureComponents;

varying vec4 vColor; // color
varying vec4 t;      // texCoord

vec4
getTextureColor ()
{
	return texture2D (x3d_texture, vec2 (t .s, t .t));
}

void
main ()
{
	vec4 C = vColor;

	if (x3d_lighting)
	{
		if (x3d_colorMaterial)
		{
			if (x3d_texturing)
			{
				vec4 T = getTextureColor ();

				C .rgb  = x3d_textureComponents < 3 ? T .rgb * C .rgb : T .rgb;
				C .a   *= T .a;
			}
		}
		else
		{
			if (x3d_texturing)
			{
				vec4 T = getTextureColor ();

				C .rgb  = x3d_textureComponents < 3 ? T .rgb * C .rgb : T .rgb;
				C .a   *= T .a;
			}
		}

		gl_FragColor = C;
	}
	else
	{
		vec4 finalColor = vColor;

		if (x3d_colorMaterial)
		{
			if (x3d_texturing)
			{
				vec4 T = getTextureColor ();

				if (x3d_textureComponents < 3)
				{
					finalColor .rgb = T .rgb * C .rgb;
					finalColor .a   = T .a;
				}
				else
					finalColor = T;

				finalColor .a *= C .a;
			}
			else
				finalColor = C;
		}
		else
		{
			if (x3d_texturing)
				finalColor = getTextureColor ();
		}

		gl_FragColor = finalColor;
	}
}
