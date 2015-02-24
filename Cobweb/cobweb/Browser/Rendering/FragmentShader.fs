precision mediump float;

float ambientIntensity = 0.0;
vec3  diffuseColor     = vec3 (0.8, 0.8, 0.8);
vec3  specularColor    = vec3 (0.0, 0.0, 0.0);
vec3  emissiveColor    = vec3 (0.0, 0.0, 0.0);
float shininess        = 0.2;
float transparency     = 0.0;

varying vec3 v;
varying vec3 N;

void
main ()
{
	float alpha     = 1.0 - transparency;
	vec4 finalColor = vec4 (0.0, 0.0, 0.0, 0.0);

	vec3 L = normalize (-v);
	vec3 E = normalize (-v);
	vec3 R = normalize (-reflect (L, N));

	vec4 ambientTerm = vec4 (diffuseColor * ambientIntensity, alpha);

	vec4 diffuseTerm = vec4 (diffuseColor, alpha) * max (dot (N, L), 0.0);
	diffuseTerm = clamp (diffuseTerm, 0.0, 1.0);

	vec4 specularTerm = vec4 (specularColor, alpha) * pow (max (dot (R, E), 0.0), 0.3 * shininess);
	specularTerm = clamp (specularTerm, 0.0, 1.0);

	vec4 emissiveTerm = vec4 (emissiveColor, alpha);

	finalColor += ambientTerm + diffuseTerm + specularTerm + emissiveTerm;

	gl_FragColor = finalColor;
}
