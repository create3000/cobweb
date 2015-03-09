// -*- Mode: C++; coding: utf-8; tab-width: 3; indent-tabs-mode: tab; c-basic-offset: 3 -*-
precision mediump float;

uniform mat4 x3d_textureMatrix;
uniform mat3 x3d_normalMatrix;
uniform mat4 x3d_projectionMatrix;
uniform mat4 x3d_modelViewMatrix;

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

uniform bool      x3d_texturing;      // true if a X3DTexture2DNode is attached, otherwise false
uniform sampler2D x3d_texture;
uniform int       x3d_textureComponents;

attribute vec4 x3d_color;
attribute vec4 x3d_texCoord;
attribute vec3 x3d_normal;
attribute vec4 x3d_position;

varying vec4 vColor; // color
varying vec4 t;      // texCoord

void
main ()
{
	vec4 C = x3d_color;
	     t = x3d_textureMatrix * x3d_texCoord;
	vec3 N = normalize (x3d_normalMatrix * x3d_normal);
	vec3 v = vec3 (x3d_modelViewMatrix * x3d_position);

	gl_Position = x3d_projectionMatrix * x3d_modelViewMatrix * x3d_position;

	if (x3d_lighting)
	{
		vec3 V = normalize (-v); // normalized vector from point on geometry to viewer's position

		// Calculate diffuseFactor & alpha

		vec3  diffuseFactor = vec3 (1.0, 1.0, 1.0);
		float alpha         = 1.0 - x3d_transparency;

		if (x3d_colorMaterial)
		{
			if (x3d_texturing)
			{
				if (x3d_textureComponents < 3)
					diffuseFactor = C .rgb ;
			}
			else
				diffuseFactor = C .rgb;

			alpha *= C .a;
		}
		else
		{
			if (x3d_texturing)
			{
				if (x3d_textureComponents < 3)
					diffuseFactor= x3d_diffuseColor;
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

				vec3 diffuseTerm  = diffuseFactor * max (dot (N, L), 0.0);
				vec3 specularTerm = x3d_specularColor * pow (max (dot (N, H), 0.0), 128.0 * x3d_shininess);

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

				finalColor += attenuation * x3d_lightColor [i] * spot *
				              (x3d_lightAmbientIntensity [i] * ambientTerm +
				               x3d_lightIntensity [i] * (diffuseTerm + specularTerm));
			}
		}

		finalColor += x3d_emissiveColor;

		vColor = vec4 (finalColor, alpha);
	}
	else
	{
		vec4 finalColor = vec4 (1.0, 1.0, 1.0, 1.0);
	
		if (x3d_colorMaterial)
		{
			if (x3d_texturing)
			{
				if (x3d_textureComponents < 3)
					finalColor .rgb = C .rgb;

				finalColor .a *= C .a;
			}
			else
				finalColor = C;
		}

		vColor = finalColor;
	}
}
