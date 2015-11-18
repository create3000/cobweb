
define ([
	"cobweb/Browser/Geometry2D/Arc2DOptions",
	"cobweb/Browser/Geometry2D/Rectangle2DOptions",
],
function (Arc2DOptions,
          Rectangle2DOptions)
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

	function X3DGeometry2DContext () { }

	X3DGeometry2DContext .prototype =
	{
		initialize: function ()
		{
		},
		getArc2DOptions: function ()
		{
			return getOptionNode .call (this, "arc2DOptions", Arc2DOptions);
		},
		getRectangle2DOptions: function ()
		{
			return getOptionNode .call (this, "rectangle2DOptions", Rectangle2DOptions);
		},
	};

	return X3DGeometry2DContext;
});
