
define ([
	"jquery",
	"cobweb/Configuration/ComponentInfo",
	"cobweb/Configuration/ComponentInfoArray",
	"cobweb/Browser/Networking/ProviderUrl",
],
function ($, ComponentInfo, ComponentInfoArray, ProviderUrl)
{
"use strict";

	function add (title, name, level)
	{
		supportedComponents .add (name, new ComponentInfo (name, level, title, ProviderUrl));
	}

	var supportedComponents = new ComponentInfoArray ();

	add ("Computer-Aided Design (CAD) model geometry", "CADGeometry",          2);
	add ("Core",                                       "Core",                 2);
	add ("Cube map environmental texturing",           "CubeMapTexturing",     3);
	add ("Distributed interactive simulation (DIS)",   "DIS",                  2);
	add ("Environmental effects",                      "EnvironmentalEffects", 4);
	add ("Environmental sensor",                       "EnvironmentalSensor",  3);
	add ("Event utilities",                            "EventUtilities",       1);
	add ("Followers",                                  "Followers",            1);
	add ("Geometry2D",                                 "Geometry2D",           2);
	add ("Geometry3D",                                 "Geometry3D",           4);
	add ("Geospatial",                                 "Geospatial",           2);
	add ("Grouping",                                   "Grouping",             3);
	add ("Humanoid animation (H-Anim)",                "H-Anim",               1);
	add ("Interpolation",                              "Interpolation",        5);
	add ("Key device sensor",                          "KeyDeviceSensor",      2);
	add ("Layering",                                   "Layering",             1);
	add ("Layout",                                     "Layout",               2);
	add ("Lighting",                                   "Lighting",             3);
	add ("Navigation",                                 "Navigation",           3);
	add ("Networking",                                 "Networking",           4);
	add ("Non-uniform Rational B-Spline (NURBS)",      "NURBS",                4);
	add ("Particle systems",                           "ParticleSystems",      3);
	add ("Picking sensor",                             "Picking",              3);
	add ("Pointing device sensor",                     "PointingDeviceSensor", 1);
	add ("Programmable shaders",                       "Shaders",              1);
	add ("Rendering",                                  "Rendering",            5);
	add ("Rigid body physics",                         "RigidBodyPhysics",     2);
	add ("Scripting",                                  "Scripting",            1);
	add ("Shape",                                      "Shape",                4);
	add ("Sound",                                      "Sound",                1);
	add ("Text",                                       "Text",                 1);
	add ("Texturing",                                  "Texturing",            3);
	add ("Texturing3D",                                "Texturing3D",          2);
	add ("Time",                                       "Time",                 2);
	add ("Volume rendering",                           "VolumeRendering",      4);

	add ("Cobweb",                                     "Cobweb",               1); // Non standard.

	Object .preventExtensions (supportedComponents);
	Object .freeze (supportedComponents);
	Object .seal (supportedComponents);

	return supportedComponents;
});