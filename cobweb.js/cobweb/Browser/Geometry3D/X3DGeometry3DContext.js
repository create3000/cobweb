
define ([
	"cobweb/Browser/Geometry3D/BoxOptions",
],
function (BoxOptions)
{
	function X3DGeometry3DContext () { }

	X3DGeometry3DContext .prototype =
	{
		initialize: function ()
		{
			this .boxOptions = new BoxOptions (this);
			this .boxOptions .setup ();
		},
		getBoxOptions: function () { return this .boxOptions; },
	};

	return X3DGeometry3DContext;
});
