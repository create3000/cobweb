
define ([
	"cobweb/Browser/Geometry2D/Arc2DOptions",
	"cobweb/Browser/Geometry2D/ArcClose2DOptions",
	"cobweb/Browser/Geometry2D/Circle2DOptions",
	"cobweb/Browser/Geometry2D/Disk2DOptions",
	"cobweb/Browser/Geometry2D/Rectangle2DOptions",
],
function (Arc2DOptions,
          ArcClose2DOptions,
          Circle2DOptions,
          Disk2DOptions,
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
		getArcClose2DOptions: function ()
		{
			return getOptionNode .call (this, "arcClose2DOptions", ArcClose2DOptions);
		},
		getCircle2DOptions: function ()
		{
			return getOptionNode .call (this, "circle2DOptions", Circle2DOptions);
		},
		getDisk2DOptions: function ()
		{
			return getOptionNode .call (this, "disk2DOptions", Disk2DOptions);
		},
		getRectangle2DOptions: function ()
		{
			return getOptionNode .call (this, "rectangle2DOptions", Rectangle2DOptions);
		},
	};

	return X3DGeometry2DContext;
});
