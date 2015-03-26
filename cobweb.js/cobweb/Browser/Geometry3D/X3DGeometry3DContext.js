
define ([
	"cobweb/Browser/Geometry3D/BoxOptions",
	"cobweb/Browser/Geometry3D/QuadSphereOptions",
	"cobweb/Browser/Geometry3D/CylinderOptions",
],
function (BoxOptions,
          QuadSphereOptions,
          CylinderOptions)
{
	function X3DGeometry3DContext () { }

	X3DGeometry3DContext .prototype =
	{
		initialize: function ()
		{
		},
		getBoxOptions: function ()
		{
			if (this .boxOptions)
				return this .boxOptions;

			this .boxOptions = new BoxOptions (this);
			this .boxOptions .setup ();

			return this .boxOptions;
		},
		getSphereOptions: function ()
		{
			if (this .sphereOptions)
				return this .sphereOptions;

			this .sphereOptions = new QuadSphereOptions (this);
			this .sphereOptions .setup ();

			return this .sphereOptions;
		},
		getCylinderOptions: function ()
		{
			if (this .cylinderOptions)
				return this .cylinderOptions;

			this .cylinderOptions = new CylinderOptions (this);
			this .cylinderOptions .setup ();

			return this .cylinderOptions;
		},
	};

	return X3DGeometry3DContext;
});
