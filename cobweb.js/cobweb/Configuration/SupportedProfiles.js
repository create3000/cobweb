
define ([
	"jquery",
	"cobweb/Configuration/ProfileInfo",
	"cobweb/Configuration/ProfileInfoArray",
	"cobweb/Configuration/ComponentInfoArray",
	"cobweb/Configuration/SupportedComponents",
	"cobweb/Browser/Networking/ProviderUrl",
],
function ($,
          ProfileInfo,
          ProfileInfoArray,
          ComponentInfoArray,
          SupportedComponents,
          ProviderUrl)
{
"use strict";

	function add (title, name, components)
	{
		supportedProfiles .add (name, new ProfileInfo (name, title, ProviderUrl, new ComponentInfoArray (components)));
	}

	var supportedProfiles = new ProfileInfoArray ();

	add ("Computer-Aided Design (CAD) interchange", "CADInterchange", [
		SupportedComponents ["Core"],
		SupportedComponents ["Networking"],
		SupportedComponents ["Grouping"],
		SupportedComponents ["Rendering"],
		SupportedComponents ["Shape"],
		SupportedComponents ["Lighting"],
		SupportedComponents ["Texturing"],
		SupportedComponents ["Navigation"],
		SupportedComponents ["Shaders"],
		SupportedComponents ["CADGeometry"],
	]);

	add ("Core", "Core", [
		SupportedComponents ["Core"],
	]);

	add ("Full", "Full", [
		SupportedComponents ["Core"],
		SupportedComponents ["Time"],
		SupportedComponents ["Networking"],
		SupportedComponents ["Grouping"],
		SupportedComponents ["Rendering"],
		SupportedComponents ["Shape"],
		SupportedComponents ["Geometry3D"],
		SupportedComponents ["Geometry2D"],
		SupportedComponents ["Text"],
		SupportedComponents ["Sound"],
		SupportedComponents ["Lighting"],
		SupportedComponents ["Texturing"],
		SupportedComponents ["Interpolation"],
		SupportedComponents ["PointingDeviceSensor"],
		SupportedComponents ["KeyDeviceSensor"],
		SupportedComponents ["EnvironmentalSensor"],
		SupportedComponents ["Navigation"],
		SupportedComponents ["EnvironmentalEffects"],
		SupportedComponents ["Geospatial"],
		SupportedComponents ["H-Anim"],
		SupportedComponents ["NURBS"],
		SupportedComponents ["DIS"],
		SupportedComponents ["Scripting"],
		SupportedComponents ["EventUtilities"],
		SupportedComponents ["Shaders"],
		SupportedComponents ["CADGeometry"],
		SupportedComponents ["Texturing3D"],
		SupportedComponents ["CubeMapTexturing"],
		SupportedComponents ["Layering"],
		SupportedComponents ["Layout"],
		SupportedComponents ["RigidBodyPhysics"],
		SupportedComponents ["Picking"],
		SupportedComponents ["Followers"],
		SupportedComponents ["ParticleSystems"], /*,
		SupportedComponents ["VolumeRendering"], */
	]);

	add ("Immersive", "Immersive", [
		SupportedComponents ["Core"],
		SupportedComponents ["Time"],
		SupportedComponents ["Networking"],
		SupportedComponents ["Grouping"],
		SupportedComponents ["Rendering"],
		SupportedComponents ["Shape"],
		SupportedComponents ["Geometry3D"],
		SupportedComponents ["Geometry2D"],
		SupportedComponents ["Text"],
		SupportedComponents ["Sound"],
		SupportedComponents ["Lighting"],
		SupportedComponents ["Texturing"],
		SupportedComponents ["Interpolation"],
		SupportedComponents ["PointingDeviceSensor"],
		SupportedComponents ["KeyDeviceSensor"],
		SupportedComponents ["EnvironmentalSensor"],
		SupportedComponents ["Navigation"],
		SupportedComponents ["EnvironmentalEffects"],
		SupportedComponents ["Scripting"],
		SupportedComponents ["EventUtilities"],
	]);

	add ("Interactive", "Interactive", [
		SupportedComponents ["Core"],
		SupportedComponents ["Time"],
		SupportedComponents ["Networking"],
		SupportedComponents ["Grouping"],
		SupportedComponents ["Rendering"],
		SupportedComponents ["Shape"],
		SupportedComponents ["Geometry3D"],
		SupportedComponents ["Lighting"],
		SupportedComponents ["Texturing"],
		SupportedComponents ["Interpolation"],
		SupportedComponents ["PointingDeviceSensor"],
		SupportedComponents ["KeyDeviceSensor"],
		SupportedComponents ["EnvironmentalSensor"],
		SupportedComponents ["Navigation"],
		SupportedComponents ["EnvironmentalEffects"],
		SupportedComponents ["EventUtilities"],
	]);

	add ("Interchange", "Interchange", [
		SupportedComponents ["Core"],
		SupportedComponents ["Time"],
		SupportedComponents ["Networking"],
		SupportedComponents ["Grouping"],
		SupportedComponents ["Rendering"],
		SupportedComponents ["Shape"],
		SupportedComponents ["Geometry3D"],
		SupportedComponents ["Lighting"],
		SupportedComponents ["Texturing"],
		SupportedComponents ["Interpolation"],
		SupportedComponents ["Navigation"],
		SupportedComponents ["EnvironmentalEffects"],
	]);

//	add ("Medical interchange", "MedicalInterchange", [
//		SupportedComponents ["Core"],
//		SupportedComponents ["Time"],
//		SupportedComponents ["Networking"],
//		SupportedComponents ["Grouping"],
//		SupportedComponents ["Rendering"],
//		SupportedComponents ["Shape"],
//		SupportedComponents ["Geometry3D"],
//		SupportedComponents ["Geometry2D"],
//		SupportedComponents ["Text"],
//		SupportedComponents ["Lighting"],
//		SupportedComponents ["Texturing"],
//		SupportedComponents ["Interpolation"],
//		SupportedComponents ["Navigation"],
//		SupportedComponents ["EnvironmentalEffects"],
//		SupportedComponents ["EventUtilities"],
//		SupportedComponents ["Texturing3D"],
//		SupportedComponents ["VolumeRendering"],
//	]);

	add ("MPEG-4 interactive", "MPEG-4", [
		SupportedComponents ["Core"],
		SupportedComponents ["Time"],
		SupportedComponents ["Networking"],
		SupportedComponents ["Grouping"],
		SupportedComponents ["Rendering"],
		SupportedComponents ["Shape"],
		SupportedComponents ["Geometry3D"],
		SupportedComponents ["Lighting"],
		SupportedComponents ["Texturing"],
		SupportedComponents ["Interpolation"],
		SupportedComponents ["PointingDeviceSensor"],
		SupportedComponents ["EnvironmentalSensor"],
		SupportedComponents ["Navigation"],
		SupportedComponents ["EnvironmentalEffects"],
	]);

	Object .preventExtensions (supportedProfiles);
	Object .freeze (supportedProfiles);
	Object .seal (supportedProfiles);

	return supportedProfiles;
});