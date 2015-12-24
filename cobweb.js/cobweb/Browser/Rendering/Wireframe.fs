data:text/plain;charset=utf-8,
// -*- Mode: C++; coding: utf-8; tab-width: 3; indent-tabs-mode: tab; c-basic-offset: 3 -*-

precision mediump float;

// 2
uniform bool  X3D_Points;
uniform float x3d_LinewidthScaleFactor;

#define MAX_CLIP_PLANES 6

// 30
uniform bool x3d_ClipPlaneEnabled [MAX_CLIP_PLANES];
uniform vec4 x3d_ClipPlaneVector [MAX_CLIP_PLANES];

#define NO_FOG           0
#define LINEAR_FOG       1
#define EXPONENTIAL_FOG  2
#define EXPONENTIAL2_FOG 3

// 5
uniform int   x3d_Fog;
uniform vec3  x3d_FogColor;
uniform float x3d_FogVisibilityRange;

// 5
varying vec4 C; // color
varying vec3 v; // point on geometry

void
clip ()
{
	if (X3D_Points && x3d_LinewidthScaleFactor >= 2.0)
	{
		float dist = distance (vec2 (0.5, 0.5), gl_PointCoord);
	
		if (dist > 0.5)
			discard;
	}

	for (int i = 0; i < MAX_CLIP_PLANES; ++ i)
	{
		if (x3d_ClipPlaneEnabled [i])
		{
			if (dot (v, x3d_ClipPlaneVector [i] .xyz) - x3d_ClipPlaneVector [i] .w < 0.0)
			{
				discard;
			}
		}
		else
			break;
	}
}

float
getFogInterpolant ()
{
	if (x3d_Fog == NO_FOG)
		return 1.0;

	float dV = length (v);

	if (dV >= x3d_FogVisibilityRange)
		return 0.0;

	if (x3d_Fog == LINEAR_FOG)
		return (x3d_FogVisibilityRange - dV) / x3d_FogVisibilityRange;

	if (x3d_Fog == EXPONENTIAL_FOG)
		return exp (-dV / (x3d_FogVisibilityRange - dV));

	return 1.0;
}

void
main ()
{
	clip ();

	float f0 = getFogInterpolant ();

	gl_FragColor .rgb = mix (x3d_FogColor, C .rgb, f0);
	gl_FragColor .a   = C .a;
}
