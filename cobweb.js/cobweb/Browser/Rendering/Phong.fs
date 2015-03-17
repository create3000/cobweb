// -*- Mode: C++; coding: utf-8; tab-width: 3; indent-tabs-mode: tab; c-basic-offset: 3 -*-
precision mediump float;

uniform bool x3d_lighting;      // true if a X3DMaterialNode is attached, otherwise false
uniform bool x3d_colorMaterial; // true if a X3DColorNode is attached, otherwise false

#define MAX_LIGHTS        8
#define DIRECTIONAL_LIGHT 0
#define POINT_LIGHT       1
#define SPOT_LIGHT        2
uniform int   x3d_lightType [MAX_LIGHTS]; // 0: DirectionalLight, 1: PointLight, 2: SpotLight
uniform bool  x3d_lightOn [MAX_LIGHTS];
uniform vec3  x3d_lightColor [MAX_LIGHTS];
uniform float x3d_lightIntensity [MAX_LIGHTS];
uniform float x3d_lightAmbientIntensity [MAX_LIGHTS];
uniform vec3  x3d_lightAttenuation [MAX_LIGHTS];
uniform vec3  x3d_lightLocation [MAX_LIGHTS];
uniform vec3  x3d_lightDirection [MAX_LIGHTS];
uniform float x3d_lightRadius [MAX_LIGHTS];
uniform float x3d_lightBeamWidth [MAX_LIGHTS];
uniform float x3d_lightCutOffAngle [MAX_LIGHTS];

uniform float x3d_ambientIntensity;
uniform vec3  x3d_diffuseColor;
uniform vec3  x3d_specularColor;
uniform vec3  x3d_emissiveColor;
uniform float x3d_shininess;
uniform float x3d_transparency;

uniform bool      x3d_texturing; // true if a X3DTexture2DNode is attached, otherwise false
uniform sampler2D x3d_texture;

varying vec4 C;  // color
varying vec4 t;  // texCoord
varying vec3 vN; // normalized normal vector at this point on geometry
varying vec3 v;  // point on geometry

vec4
getTextureColor ()
{
	return texture2D (x3d_texture, vec2 (t .s, t .t));
}

void
main ()
{
	if (x3d_lighting)
	{
		vec3  N  = normalize (gl_FrontFacing ? vN : -vN);
		vec3  V  = normalize (-v); // normalized vector from point on geometry to viewer's position
		float dV = length (v);

		// Calculate diffuseFactor & alpha

		vec3  diffuseFactor = vec3 (1.0, 1.0, 1.0);
		float alpha         = 1.0 - x3d_transparency;

		if (x3d_colorMaterial)
		{
			if (x3d_texturing)
			{
				vec4 T = getTextureColor ();

				diffuseFactor  = T .rgb * C .rgb;
				alpha         *= T .a;
			}
			else
				diffuseFactor = C .rgb;

			alpha *= C .a;
		}
		else
		{
			if (x3d_texturing)
			{
				vec4 T = getTextureColor ();

				diffuseFactor  = T .rgb * x3d_diffuseColor;
				alpha         *= T .a;
			}
			else
				diffuseFactor = x3d_diffuseColor;
		}

		vec3 ambientTerm = diffuseFactor * x3d_ambientIntensity;

		// Apply light sources

		vec3 finalColor = vec3 (0.0, 0.0, 0.0);

		for (int i = 0; i < MAX_LIGHTS; ++ i)
		{
			float dL = length (x3d_lightLocation [i] - v);

			if (x3d_lightOn [i] && (x3d_lightType [i] == DIRECTIONAL_LIGHT || dL <= x3d_lightRadius [i]))
			{
				vec3 c = x3d_lightAttenuation [i];
				vec3 L = x3d_lightType [i] == DIRECTIONAL_LIGHT ? -x3d_lightDirection [i] : normalize (x3d_lightLocation [i] - v);
				vec3 H = normalize (L + V); // specular term

				vec3  diffuseTerm    = diffuseFactor * max (dot (N, L), 0.0);
				float specularFactor = bool (x3d_shininess) ? pow (max (dot (N, H), 0.0), x3d_shininess) : 1.0;
				vec3  specularTerm   = x3d_specularColor * specularFactor;

				float attenuation = 1.0 / max (c [0] + c [1] * dL + c [2] * (dL * dL), 1.0);
				float spot        = 1.0;

				if (x3d_lightType [i] == SPOT_LIGHT)
				{
					float spotAngle = acos (dot (-L, x3d_lightDirection [i]));
					
					if (spotAngle >= x3d_lightCutOffAngle [i])
						spot = 0.0;
					else if (spotAngle <= x3d_lightBeamWidth [i])
						spot = 1.0;
					else
						spot = (spotAngle - x3d_lightCutOffAngle [i]) / (x3d_lightBeamWidth [i] - x3d_lightCutOffAngle [i]);
				}

				finalColor += (attenuation * spot) * x3d_lightColor [i] *
				              (x3d_lightAmbientIntensity [i] * ambientTerm +
				               x3d_lightIntensity [i] * (diffuseTerm + specularTerm));
			}
		}

		finalColor += x3d_emissiveColor;

		gl_FragColor = vec4 (finalColor, alpha);
	}
	else
	{
		vec4 finalColor = vec4 (1.0, 1.0, 1.0, 1.0);
	
		if (x3d_colorMaterial)
		{
			if (x3d_texturing)
			{
				vec4 T = getTextureColor ();

				finalColor = T * C;
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
