// -*- Mode: C++; coding: utf-8; tab-width: 3; indent-tabs-mode: tab; c-basic-offset: 3 -*-
precision mediump float;

uniform bool lighting;      // true if a X3DMaterialNode is attached, otherwise false
uniform bool colorMaterial; // true if a X3DColorNode is attached, otherwise false

uniform float ambientIntensity;
uniform vec3  diffuseColor;
uniform vec3  specularColor;
uniform vec3  emissiveColor;
uniform float shininess;
uniform float transparency;

uniform bool      texturing;      // true if a X3DTexture2DNode is attached, otherwise false
uniform sampler2D texture;
uniform bool      textureModulate;

varying vec4 C; // color
varying vec4 t; // texCoord
varying vec3 N; // normalized normal vector at this point on geometry
varying vec3 v; // point on geometry


void
main ()
{
	vec4 finalColor = vec4 (0.0, 0.0, 0.0, 0.0);

	if (lighting)
	{
		float alpha = 1.0 - transparency;
		vec3 L = normalize (-v);    // normalized vector from point on geometry to light source i position
		vec3 V = normalize (-v);    // normalized vector from point on geometry to viewer's position
		vec3 H = normalize (L + V); // specular term

		vec3 diffuseComponent = colorMaterial ? vec3 (C) : diffuseColor;
		vec3 ambientTerm      = diffuseComponent * ambientIntensity;
		vec3 diffuseTerm      = diffuseComponent * max (dot (N, L), 0.0);
		vec3 specularTerm     = specularColor * pow (max (dot (N, H), 0.0), 128.0 * shininess);
		vec3 emissiveTerm     = emissiveColor;

		finalColor += vec4 (ambientTerm + diffuseTerm + specularTerm + emissiveTerm, alpha);
	}
	else
	{
		if (colorMaterial)
		{
			if (texturing)
			{
				vec4 T = texture2D (texture, vec2 (t .s, t .t));

				if (textureModulate)
				{
					finalColor .rgb = T .rgb * C .rgb;
					finalColor .a   = T .a;
				}
				else
					finalColor = T;
			}
			else
				finalColor = C;
		}
		else
		{
			if (texturing)
				finalColor = texture2D (texture, vec2 (t .s, t .t));
			else
				finalColor = vec4 (1.0, 1.0, 1.0, 1.0);
		}
	}

	gl_FragColor = finalColor;
}
