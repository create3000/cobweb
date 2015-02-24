precision mediump float;

uniform mat3 normalMatrix;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

attribute vec3 normal;
attribute vec4 position;

varying vec3 v;
varying vec3 N;

void
main ()
{
	v = vec3 (modelViewMatrix * position);
	N = normalize (normalMatrix * normal);

	gl_Position = projectionMatrix * modelViewMatrix * position;
}
