// -*- Mode: C++; coding: utf-8; tab-width: 3; indent-tabs-mode: tab; c-basic-offset: 3 -*-
precision mediump float;

uniform mat4 x3d_projectionMatrix;
uniform mat4 x3d_modelViewMatrix;

uniform bool  x3d_colorMaterial;   // true if a X3DColorNode is attached, otherwise false
uniform bool  x3d_lighting;        // true if a X3DMaterialNode is attached, otherwise false
uniform vec3  x3d_emissiveColor;
uniform float x3d_transparency;

attribute vec4 x3d_color;
attribute vec4 x3d_position;

varying vec4 C; // color

void
main ()
{
	if (x3d_lighting)
	{
		if (x3d_colorMaterial)
		{
			C .rgb = x3d_color .rgb;
			C .a   = x3d_color .a * x3d_transparency;
		}
		else
		{
			C .rgb = x3d_emissiveColor;
			C .a   = x3d_transparency;
		}
	}
	else
	{
		if (x3d_colorMaterial)
			C = x3d_color;
		else
			C = vec4 (1.0, 1.0, 1.0, 1.0);
	}

	//gl_PointSize = 10.0;
	gl_Position  = x3d_projectionMatrix * x3d_modelViewMatrix * x3d_position;
}
