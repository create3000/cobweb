
define ([
	"cobweb/Browser/Geometry2D/Rectangle2DOptions",
],
function (Rectangle2DOptions)
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
		getRectangle2DOptions: function ()
		{
			return getOptionNode .call (this, "rectangle2DOptions", Rectangle2DOptions);
		},
	};

	return X3DGeometry2DContext;
});
