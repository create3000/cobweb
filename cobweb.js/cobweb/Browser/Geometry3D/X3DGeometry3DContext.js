
define ([
	"cobweb/Browser/Geometry3D/BoxOptions",
	"cobweb/Browser/Geometry3D/ConeOptions",
	"cobweb/Browser/Geometry3D/CylinderOptions",
	"cobweb/Browser/Geometry3D/QuadSphereOptions",
],
function (BoxOptions,
          ConeOptions,
          CylinderOptions,
          QuadSphereOptions)
{
"use strict";
	
	function getOptionNode (name, Type)
	{
		if (this [name])
			return this [name];

		this [name] = new Type (this);
		this [name] .setup ();

		return this [name];
	}

	function X3DGeometry3DContext () { }

	X3DGeometry3DContext .prototype =
	{
		initialize: function ()
		{
		},
		getBoxOptions: function ()
		{
			return getOptionNode .call (this, "boxOptions", BoxOptions);
		},
		getConeOptions: function ()
		{
			return getOptionNode .call (this, "coneOptions", ConeOptions);
		},
		getCylinderOptions: function ()
		{
			return getOptionNode .call (this, "cylinderOptions", CylinderOptions);
		},
		getSphereOptions: function ()
		{
			return getOptionNode .call (this, "sphereOptions", QuadSphereOptions);
		},
	};

	return X3DGeometry3DContext;
});
