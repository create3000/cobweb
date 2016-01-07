
define ([
	"jquery",
	"cobweb/Configuration/ComponentInfoArray",
	"cobweb/Browser/Networking/urls",
],
function ($, ComponentInfoArray, urls)
{
"use strict";

	return function (browser)
	{
		var supportedComponents = new ComponentInfoArray (browser);

		supportedComponents .addComponentInfo (
		{
			title:      "Computer-Aided Design (CAD) model geometry",
			name:       "CADGeometry",
			level:       2,
			providerUrl: urls .provider,
			url: [ ],
		});

		supportedComponents .addComponentInfo (
		{
			title:      "Core",
			name:       "Core",
			level:       2,
			providerUrl: urls .provider,
			url: [ ],
		});

		supportedComponents .addComponentInfo (
		{
			title:      "Cube map environmental texturing",
			name:       "CubeMapTexturing",
			level:       3,
			providerUrl: urls .provider,
			url: [ ],
		});

		supportedComponents .addComponentInfo (
		{
			title:      "Distributed interactive simulation (DIS)",
			name:       "DIS",
			level:       2,
			providerUrl: urls .provider,
			url: [ ],
		});

		supportedComponents .addComponentInfo (
		{
			title:      "Environmental effects",
			name:       "EnvironmentalEffects",
			level:       4,
			providerUrl: urls .provider,
			url: [ ],
		});

		supportedComponents .addComponentInfo (
		{
			title:      "Environmental sensor",
			name:       "EnvironmentalSensor",
			level:       4,
			providerUrl: urls .provider,
			url: [ ],
		});

		supportedComponents .addComponentInfo (
		{
			title:      "Event utilities",
			name:       "EventUtilities",
			level:       4,
			providerUrl: urls .provider,
			url: [ ],
		});

		supportedComponents .addComponentInfo (
		{
			title:      "Followers",
			name:       "Followers",
			level:       4,
			providerUrl: urls .provider,
			url: [ ],
		});

		supportedComponents .addComponentInfo (
		{
			title:      "Geometry2D",
			name:       "Geometry2D",
			level:       2,
			providerUrl: urls .provider,
			url: [ ],
		});

		supportedComponents .addComponentInfo (
		{
			title:      "Geometry3D",
			name:       "Geometry3D",
			level:       4,
			providerUrl: urls .provider,
			url: [ ],
		});

		supportedComponents .addComponentInfo (
		{
			title:      "Geospatial",
			name:       "Geospatial",
			level:       2,
			providerUrl: urls .provider,
			url: [ ],
		});

		supportedComponents .addComponentInfo (
		{
			title:      "Grouping",
			name:       "Grouping",
			level:       3,
			providerUrl: urls .provider,
			url: [ ],
		});

		supportedComponents .addComponentInfo (
		{
			title:      "Humanoid animation (H-Anim)",
			name:       "H-Anim",
			level:       3,
			providerUrl: urls .provider,
			url: [ ],
		});

		supportedComponents .addComponentInfo (
		{
			title:      "Interpolation",
			name:       "Interpolation",
			level:       5,
			providerUrl: urls .provider,
			url: [ ],
		});

		supportedComponents .addComponentInfo (
		{
			title:      "Key device sensor",
			name:       "KeyDeviceSensor",
			level:       2,
			providerUrl: urls .provider,
			url: [ ],
		});

		supportedComponents .addComponentInfo (
		{
			title:      "Layering",
			name:       "Layering",
			level:       1,
			providerUrl: urls .provider,
			url: [ ],
		});

		supportedComponents .addComponentInfo (
		{
			title:      "Layout",
			name:       "Layout",
			level:       1,
			providerUrl: urls .provider,
			url: [ ],
		});

		supportedComponents .addComponentInfo (
		{
			title:      "Lighting",
			name:       "Lighting",
			level:       3,
			providerUrl: urls .provider,
			url: [ ],
		});

		supportedComponents .addComponentInfo (
		{
			title:      "Navigation",
			name:       "Navigation",
			level:       3,
			providerUrl: urls .provider,
			url: [ ],
		});

		supportedComponents .addComponentInfo (
		{
			title:      "Networking",
			name:       "Networking",
			level:       4,
			providerUrl: urls .provider,
			url: [ ],
		});

		supportedComponents .addComponentInfo (
		{
			title:      "Non-uniform Rational B-Spline (NURBS)",
			name:       "NURBS",
			level:       4,
			providerUrl: urls .provider,
			url: [ ],
		});

		supportedComponents .addComponentInfo (
		{
			title:      "Particle systems",
			name:       "ParticleSystems",
			level:       3,
			providerUrl: urls .provider,
			url: [ ],
		});

		supportedComponents .addComponentInfo (
		{
			title:      "Picking sensor",
			name:       "Picking",
			level:       3,
			providerUrl: urls .provider,
			url: [ ],
		});

		supportedComponents .addComponentInfo (
		{
			title:      "Pointing device sensor",
			name:       "PointingDeviceSensor",
			level:       1,
			providerUrl: urls .provider,
			url: [ ],
		});

		supportedComponents .addComponentInfo (
		{
			title:      "Programmable shaders",
			name:       "Shaders",
			level:       1,
			providerUrl: urls .provider,
			url: [ ],
		});

		supportedComponents .addComponentInfo (
		{
			title:      "Rendering",
			name:       "Rendering",
			level:       5,
			providerUrl: urls .provider,
			url: [ ],
		});

		supportedComponents .addComponentInfo (
		{
			title:      "Rigid body physics",
			name:       "RigidBodyPhysics",
			level:       5,
			providerUrl: urls .provider,
			url: [ ],
		});

		supportedComponents .addComponentInfo (
		{
			title:      "Scripting",
			name:       "Scripting",
			level:       1,
			providerUrl: urls .provider,
			url: [ ],
		});

		supportedComponents .addComponentInfo (
		{
			title:      "Shape",
			name:       "Shape",
			level:       4,
			providerUrl: urls .provider,
			url: [ ],
		});

		supportedComponents .addComponentInfo (
		{
			title:      "Sound",
			name:       "Sound",
			level:       1,
			providerUrl: urls .provider,
			url: [ ],
		});

		supportedComponents .addComponentInfo (
		{
			title:      "Text",
			name:       "Text",
			level:       1,
			providerUrl: urls .provider,
			url: [ ],
		});

		supportedComponents .addComponentInfo (
		{
			title:      "Texturing",
			name:       "Texturing",
			level:       3,
			providerUrl: urls .provider,
			url: [ ],
		});

		supportedComponents .addComponentInfo (
		{
			title:      "Texturing3D",
			name:       "Texturing3D",
			level:       3,
			providerUrl: urls .provider,
			url: [ ],
		});

		supportedComponents .addComponentInfo (
		{
			title:      "Time",
			name:       "Time",
			level:       2,
			providerUrl: urls .provider,
			url: [ ],
		});

		supportedComponents .addComponentInfo (
		{
			title:      "Volume rendering",
			name:       "VolumeRendering",
			level:       2,
			providerUrl: urls .provider,
			url: [ ],
		});

		// Custom, non-standard component.

		supportedComponents .addComponentInfo (
		{
			title:      "Cobweb",
			name:       "Cobweb",
			level:       1,
			providerUrl: urls .provider,
			url: [ ],
		});

		Object .preventExtensions (supportedComponents);
		Object .freeze (supportedComponents);
		Object .seal (supportedComponents);
	
		return supportedComponents;
	};
});