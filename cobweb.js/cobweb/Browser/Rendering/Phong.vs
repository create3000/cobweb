// -*- Mode: C++; coding: utf-8; tab-width: 3; indent-tabs-mode: tab; c-basic-offset: 3 -*-
precision mediump float;

uniform mat4 x3d_textureMatrix;
uniform mat3 x3d_normalMatrix;
uniform mat4 x3d_projectionMatrix;
uniform mat4 x3d_modelViewMatrix;

attribute vec4 x3d_color;
attribute vec4 x3d_texCoord;
attribute vec3 x3d_normal;
attribute vec4 x3d_position;

varying vec4 C;  // color
varying vec4 t;  // texCoord
varying vec3 vN; // normalized normal vector at this point on geometry
varying vec3 v;  // point on geometry

void
main ()
{
	C  = x3d_color;
	t  = x3d_textureMatrix * x3d_texCoord;
	vN = normalize (x3d_normalMatrix * x3d_normal);
	v  = vec3 (x3d_modelViewMatrix * x3d_position);

	gl_Position = x3d_projectionMatrix * x3d_modelViewMatrix * x3d_position;
}
