data:text/plain;charset=utf-8,
// -*- Mode: C++; coding: utf-8; tab-width: 3; indent-tabs-mode: tab; c-basic-offset: 3 -*-
precision mediump float;

#define NO_FOG           0
#define LINEAR_FOG       1
#define EXPONENTIAL_FOG  2
#define EXPONENTIAL2_FOG 3

uniform int   x3d_FogType;
uniform vec3  x3d_FogColor;
uniform float x3d_FogVisibilityRange;

varying vec4  C;  // color
varying float dv; // distance to vertex

float
getFogInterpolant ()
{
	if (x3d_FogType == NO_FOG)
		return 1.0;

	if (dv >= x3d_FogVisibilityRange)
		return 0.0;

	if (x3d_FogType == LINEAR_FOG)
		return (x3d_FogVisibilityRange - dv) / x3d_FogVisibilityRange;

	if (x3d_FogType == EXPONENTIAL_FOG)
		return exp (-dv / (x3d_FogVisibilityRange - dv));

	return 1.0;
}

void
main ()
{
	float f0 = getFogInterpolant ();

	gl_FragColor .rgb = mix (x3d_FogColor, C .rgb, f0);
	gl_FragColor .a   = C .a;
}
