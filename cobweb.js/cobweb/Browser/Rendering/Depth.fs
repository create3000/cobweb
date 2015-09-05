// -*- Mode: C++; coding: utf-8; tab-width: 3; indent-tabs-mode: tab; c-basic-offset: 3 -*-
precision mediump float;

vec3
pack (float f)
{
	vec3 color;

	f *= 255.0;
	color .r = floor (f);

	f -= color .r;
	f *= 255.0;
	color .g = floor (f);

	f -= color .g;
	f *= 255.0;
	color .b = floor (f);

	return color / 255.0;
}

void
main ()
{
	gl_FragColor .rgb = pack (gl_FragCoord .z);
}
