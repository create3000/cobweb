// -*- Mode: C++; coding: utf-8; tab-width: 3; indent-tabs-mode: tab; c-basic-offset: 3 -*-
precision mediump float;

uniform mat4 x3d_projectionMatrix;
uniform mat4 x3d_modelViewMatrix;

attribute vec4 x3d_color;
attribute vec4 x3d_position;

varying vec4 C;

void
main ()
{
	C           = x3d_color;
	gl_Position = x3d_projectionMatrix * x3d_modelViewMatrix * x3d_position;
}
