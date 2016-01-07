
define ([
	"jquery",
	"cobweb/Configuration/ProfileInfo",
	"cobweb/Configuration/ProfileInfoArray",
	"cobweb/Configuration/ComponentInfoArray",
	"cobweb/Browser/Networking/urls",
],
function ($,
          ProfileInfo,
          ProfileInfoArray,
          ComponentInfoArray,
          urls)
{
"use strict";

	return function (browser)
	{
		function add (title, name, components)
		{
			supportedProfiles .add (name, new ProfileInfo (name, title, urls .povider, new ComponentInfoArray (browser, components)));
		}

		var
			supportedComponents = browser .supportedComponents,
			supportedProfiles   = new ProfileInfoArray ();

		add ("Computer-Aided Design (CAD) interchange", "CADInterchange", [
			supportedComponents ["Core"],
			supportedComponents ["Networking"],
			supportedComponents ["Grouping"],
			supportedComponents ["Rendering"],
			supportedComponents ["Shape"],
			supportedComponents ["Lighting"],
			supportedComponents ["Texturing"],
			supportedComponents ["Navigation"],
			supportedComponents ["Shaders"],
			supportedComponents ["CADGeometry"],
		]);
	
		add ("Core", "Core", [
			supportedComponents ["Core"],
		]);
	
		add ("Full", "Full", [
			supportedComponents ["Core"],
			supportedComponents ["Time"],
			supportedComponents ["Networking"],
			supportedComponents ["Grouping"],
			supportedComponents ["Rendering"],
			supportedComponents ["Shape"],
			supportedComponents ["Geometry3D"],
			supportedComponents ["Geometry2D"],
			supportedComponents ["Text"],
			supportedComponents ["Sound"],
			supportedComponents ["Lighting"],
			supportedComponents ["Texturing"],
			supportedComponents ["Interpolation"],
			supportedComponents ["PointingDeviceSensor"],
			supportedComponents ["KeyDeviceSensor"],
			supportedComponents ["EnvironmentalSensor"],
			supportedComponents ["Navigation"],
			supportedComponents ["EnvironmentalEffects"],
			supportedComponents ["Geospatial"],
			supportedComponents ["H-Anim"],
			supportedComponents ["NURBS"],
			supportedComponents ["DIS"],
			supportedComponents ["Scripting"],
			supportedComponents ["EventUtilities"],
			supportedComponents ["Shaders"],
			supportedComponents ["CADGeometry"],
			supportedComponents ["Texturing3D"],
			supportedComponents ["CubeMapTexturing"],
			supportedComponents ["Layering"],
			supportedComponents ["Layout"],
			supportedComponents ["RigidBodyPhysics"],
			supportedComponents ["Picking"],
			supportedComponents ["Followers"],
			supportedComponents ["ParticleSystems"], /*,
			supportedComponents ["VolumeRendering"], */
		]);
	
		add ("Immersive", "Immersive", [
			supportedComponents ["Core"],
			supportedComponents ["Time"],
			supportedComponents ["Networking"],
			supportedComponents ["Grouping"],
			supportedComponents ["Rendering"],
			supportedComponents ["Shape"],
			supportedComponents ["Geometry3D"],
			supportedComponents ["Geometry2D"],
			supportedComponents ["Text"],
			supportedComponents ["Sound"],
			supportedComponents ["Lighting"],
			supportedComponents ["Texturing"],
			supportedComponents ["Interpolation"],
			supportedComponents ["PointingDeviceSensor"],
			supportedComponents ["KeyDeviceSensor"],
			supportedComponents ["EnvironmentalSensor"],
			supportedComponents ["Navigation"],
			supportedComponents ["EnvironmentalEffects"],
			supportedComponents ["Scripting"],
			supportedComponents ["EventUtilities"],
		]);
	
		add ("Interactive", "Interactive", [
			supportedComponents ["Core"],
			supportedComponents ["Time"],
			supportedComponents ["Networking"],
			supportedComponents ["Grouping"],
			supportedComponents ["Rendering"],
			supportedComponents ["Shape"],
			supportedComponents ["Geometry3D"],
			supportedComponents ["Lighting"],
			supportedComponents ["Texturing"],
			supportedComponents ["Interpolation"],
			supportedComponents ["PointingDeviceSensor"],
			supportedComponents ["KeyDeviceSensor"],
			supportedComponents ["EnvironmentalSensor"],
			supportedComponents ["Navigation"],
			supportedComponents ["EnvironmentalEffects"],
			supportedComponents ["EventUtilities"],
		]);
	
		add ("Interchange", "Interchange", [
			supportedComponents ["Core"],
			supportedComponents ["Time"],
			supportedComponents ["Networking"],
			supportedComponents ["Grouping"],
			supportedComponents ["Rendering"],
			supportedComponents ["Shape"],
			supportedComponents ["Geometry3D"],
			supportedComponents ["Lighting"],
			supportedComponents ["Texturing"],
			supportedComponents ["Interpolation"],
			supportedComponents ["Navigation"],
			supportedComponents ["EnvironmentalEffects"],
		]);
	
	//	add ("Medical interchange", "MedicalInterchange", [
	//		supportedComponents ["Core"],
	//		supportedComponents ["Time"],
	//		supportedComponents ["Networking"],
	//		supportedComponents ["Grouping"],
	//		supportedComponents ["Rendering"],
	//		supportedComponents ["Shape"],
	//		supportedComponents ["Geometry3D"],
	//		supportedComponents ["Geometry2D"],
	//		supportedComponents ["Text"],
	//		supportedComponents ["Lighting"],
	//		supportedComponents ["Texturing"],
	//		supportedComponents ["Interpolation"],
	//		supportedComponents ["Navigation"],
	//		supportedComponents ["EnvironmentalEffects"],
	//		supportedComponents ["EventUtilities"],
	//		supportedComponents ["Texturing3D"],
	//		supportedComponents ["VolumeRendering"],
	//	]);
	
		add ("MPEG-4 interactive", "MPEG-4", [
			supportedComponents ["Core"],
			supportedComponents ["Time"],
			supportedComponents ["Networking"],
			supportedComponents ["Grouping"],
			supportedComponents ["Rendering"],
			supportedComponents ["Shape"],
			supportedComponents ["Geometry3D"],
			supportedComponents ["Lighting"],
			supportedComponents ["Texturing"],
			supportedComponents ["Interpolation"],
			supportedComponents ["PointingDeviceSensor"],
			supportedComponents ["EnvironmentalSensor"],
			supportedComponents ["Navigation"],
			supportedComponents ["EnvironmentalEffects"],
		]);
	
		Object .preventExtensions (supportedProfiles);
		Object .freeze (supportedProfiles);
		Object .seal (supportedProfiles);
	
		return supportedProfiles;
	};
});