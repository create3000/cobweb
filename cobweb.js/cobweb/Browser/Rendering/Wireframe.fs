// -*- Mode: C++; coding: utf-8; tab-width: 3; indent-tabs-mode: tab; c-basic-offset: 3 -*-
precision mediump float;

#define NO_FOG           0
#define LINEAR_FOG       1
#define EXPONENTIAL_FOG  2
#define EXPONENTIAL2_FOG 3

uniform int   x3d_fogType;
uniform vec3  x3d_fogColor;
uniform float x3d_fogVisibilityRange;

varying vec4  C;  // color
varying float dv; // distance to vertex

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

void
main ()
{
	float f0 = getFogInterpolant ();

	gl_FragColor .rgb = mix (x3d_fogColor, C .rgb, f0);
	gl_FragColor .a   = C .a;
}
