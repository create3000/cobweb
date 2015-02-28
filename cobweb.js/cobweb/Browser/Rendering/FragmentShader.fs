// -*- Mode: C++; coding: utf-8; tab-width: 3; indent-tabs-mode: tab; c-basic-offset: 3 -*-
precision mediump float;

uniform bool lighting;
uniform bool colorMaterial;

uniform float ambientIntensity;
uniform vec3  diffuseColor;
uniform vec3  specularColor;
uniform vec3  emissiveColor;
uniform float shininess;
uniform float transparency;

varying vec4 C; // color
varying vec3 N; // normalized normal vector at this point on geometry
varying vec3 v; // point on geometry

void
main ()
{
	if (lighting)
	{
		float alpha      = 1.0 - transparency;
		vec4  finalColor = vec4 (0.0, 0.0, 0.0, 0.0);

		vec3 L = normalize (-v);    // normalized vector from point on geometry to light source i position
		vec3 V = normalize (-v);    // normalized vector from point on geometry to viewer's position
		vec3 H = normalize (L + V); // specular term

		vec3 diffuseComponent = colorMaterial ? vec3 (C) : diffuseColor;
		vec3 ambientTerm      = diffuseComponent * ambientIntensity;
		vec3 diffuseTerm      = diffuseComponent * max (dot (N, L), 0.0);
		vec3 specularTerm     = specularColor * pow (max (dot (N, H), 0.0), 128.0 * shininess);
		vec3 emissiveTerm     = emissiveColor;

		finalColor += vec4 (ambientTerm + diffuseTerm + specularTerm + emissiveTerm, alpha);

		gl_FragColor = finalColor;
	}
	else
		gl_FragColor = colorMaterial ? C : vec4 (1.0, 1.0, 1.0, 1.0);
}
