// -*- Mode: C++; coding: utf-8; tab-width: 3; indent-tabs-mode: tab; c-basic-offset: 3 -*-
precision mediump float;

uniform mat4 x3d_TextureMatrix;
uniform mat3 x3d_NormalMatrix;
uniform mat4 x3d_ProjectionMatrix;
uniform mat4 x3d_ModelViewMatrix;

uniform bool x3d_Lighting;      // true if a X3DMaterialNode is attached, otherwise false
uniform bool x3d_ColorMaterial; // true if a X3DColorNode is attached, otherwise false

#define MAX_LIGHTS        8
#define DIRECTIONAL_LIGHT 0
#define POINT_LIGHT       1
#define SPOT_LIGHT        2

uniform int   x3d_LightType [MAX_LIGHTS]; // 0: DirectionalLight, 1: PointLight, 2: SpotLight
uniform bool  x3d_LightOn [MAX_LIGHTS];
uniform vec3  x3d_LightColor [MAX_LIGHTS];
uniform float x3d_LightIntensity [MAX_LIGHTS];
uniform float x3d_LightAmbientIntensity [MAX_LIGHTS];
uniform vec3  x3d_LightAttenuation [MAX_LIGHTS];
uniform vec3  x3d_LightLocation [MAX_LIGHTS];
uniform vec3  x3d_LightDirection [MAX_LIGHTS];
uniform float x3d_LightRadius [MAX_LIGHTS];
uniform float x3d_LightBeamWidth [MAX_LIGHTS];
uniform float x3d_LightCutOffAngle [MAX_LIGHTS];

uniform float x3d_AmbientIntensity;
uniform vec3  x3d_DiffuseColor;
uniform vec3  x3d_SpecularColor;
uniform vec3  x3d_EmissiveColor;
uniform float x3d_Shininess;
uniform float x3d_Transparency;

uniform float x3d_BackAmbientIntensity;
uniform vec3  x3d_BackDiffuseColor;
uniform vec3  x3d_BackSpecularColor;
uniform vec3  x3d_BackEmissiveColor;
uniform float x3d_BackShininess;
uniform float x3d_BackTransparency;

uniform bool      x3d_Texturing;      // true if a X3DTexture2DNode is attached, otherwise false
uniform sampler2D x3d_Texture;

attribute vec4 x3d_Color;
attribute vec4 x3d_TexCoord;
attribute vec3 x3d_Normal;
attribute vec4 x3d_Vertex;

varying vec4  frontColor; // color
varying vec4  backColor;  // color
varying vec4  t;          // texCoord
varying float dv;         // distance to vertex

void
main ()
{
	vec4 C  = x3d_Color;
	vec4 p  = x3d_ModelViewMatrix * x3d_Vertex;
	vec3 v  = vec3 (p);

	if (x3d_Texturing)
		t = x3d_TextureMatrix * x3d_TexCoord;

	dv = length (v);

	gl_Position = x3d_ProjectionMatrix * p;

	if (x3d_Lighting)
	{
		vec3 N  = normalize (x3d_NormalMatrix * x3d_Normal);
		vec3 bN = -N;
		vec3 V  = normalize (-v); // normalized vector from point on geometry to viewer's position

		// Calculate diffuseFactor & alpha

		vec3  diffuseFactor    = vec3 (1.0, 1.0, 1.0);
		vec3  backDiffuseFactor = vec3 (1.0, 1.0, 1.0);
		float alpha             = 1.0 - x3d_Transparency;
		float backAlpha         = 1.0 - x3d_BackTransparency;

		if (x3d_ColorMaterial)
		{
			diffuseFactor     = C .rgb;
			backDiffuseFactor = C .rgb;

			alpha     *= C .a;
			backAlpha *= C .a;
		}
		else
		{
			diffuseFactor     = x3d_DiffuseColor;
			backDiffuseFactor = x3d_BackDiffuseColor;
		}

		vec3 ambientTerm     = diffuseFactor * x3d_AmbientIntensity;
		vec3 backAmbientTerm = backDiffuseFactor * x3d_BackAmbientIntensity;

		// Apply light sources

		vec3 frontFinalColor = vec3 (0.0, 0.0, 0.0);
		vec3 backFinalColor  = vec3 (0.0, 0.0, 0.0);

		for (int i = 0; i < MAX_LIGHTS; ++ i)
		{
			float dL = length (x3d_LightLocation [i] - v);

			if (x3d_LightOn [i] && (x3d_LightType [i] == DIRECTIONAL_LIGHT || dL <= x3d_LightRadius [i]))
			{
				vec3 c = x3d_LightAttenuation [i];
				vec3 L = x3d_LightType [i] == DIRECTIONAL_LIGHT ? -x3d_LightDirection [i] : normalize (x3d_LightLocation [i] - v);
				vec3 H = normalize (L + V); // specular term

				vec3  frontDiffuseTerm    = diffuseFactor * max (dot (N, L), 0.0);
				float frontSpecularFactor = bool (x3d_Shininess) ? pow (max (dot (N, H), 0.0), x3d_Shininess) : 1.0;
				vec3  frontSpecularTerm   = x3d_SpecularColor * frontSpecularFactor;

				vec3  backDiffuseTerm    = backDiffuseFactor * max (dot (bN, L), 0.0);
				float backSpecularFactor = bool (x3d_BackShininess) ? pow (max (dot (bN, H), 0.0), x3d_BackShininess) : 1.0;
				vec3  backSpecularTerm   = x3d_BackSpecularColor * backSpecularFactor;

				float attenuation = x3d_LightType [i] == DIRECTIONAL_LIGHT ? 1.0 : 1.0 / max (c [0] + c [1] * dL + c [2] * (dL * dL), 1.0);
				float spot        = 1.0;

				if (x3d_LightType [i] == SPOT_LIGHT)
				{
					float spotAngle = acos (dot (-L, x3d_LightDirection [i]));
					
					if (spotAngle >= x3d_LightCutOffAngle [i])
						spot = 0.0;
					else if (spotAngle <= x3d_LightBeamWidth [i])
						spot = 1.0;
					else
						spot = (spotAngle - x3d_LightCutOffAngle [i]) / (x3d_LightBeamWidth [i] - x3d_LightCutOffAngle [i]);
				}

				vec3 lightFactor        = (attenuation * spot) * x3d_LightColor [i];
				vec3 ambientLightFactor = lightFactor * x3d_LightAmbientIntensity [i];
				vec3 ambientLight       = ambientLightFactor * ambientTerm;
				vec3 backAmbientLight   = ambientLightFactor * backAmbientTerm;

				lightFactor *= x3d_LightIntensity [i];

				frontFinalColor += ambientLight + lightFactor * (frontDiffuseTerm + frontSpecularTerm);
				backFinalColor  += ambientLight + lightFactor * (backDiffuseTerm  + backSpecularTerm);
			}
		}

		frontFinalColor += x3d_EmissiveColor;
		backFinalColor  += x3d_BackEmissiveColor;

		frontColor = vec4 (clamp (frontFinalColor, 0.0, 1.0), alpha);
		backColor  = vec4 (clamp (backFinalColor,  0.0, 1.0), backAlpha);
	}
	else
	{
		vec4 finalColor = vec4 (1.0, 1.0, 1.0, 1.0);

		if (x3d_ColorMaterial)
			finalColor = C;

		frontColor = finalColor;
		backColor  = finalColor;
	}
}
