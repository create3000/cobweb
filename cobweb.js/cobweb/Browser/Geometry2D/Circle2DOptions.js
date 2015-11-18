
define ([
	"jquery",
	"cobweb/Basic/X3DBaseNode",
	"cobweb/Fields",
	"standard/Math/Numbers/Complex",
	"standard/Math/Numbers/Vector3",
],
function ($,
          X3DBaseNode,
          Fields,
          Complex,
          Vector3)
{
"use strict";
	
	function Circle2DOptions (executionContext)
	{
		X3DBaseNode .call (this, executionContext .getBrowser (), executionContext);

		this .addChildren ("segments", new Fields .SFInt32 (40))

		this .vertices = [ ];
		this .extents  = [new Vector3 (-1, -1, 0), new Vector3 (1, 1, 0)];
	}

	Circle2DOptions .prototype = $.extend (Object .create (X3DBaseNode .prototype),
	{
		constructor: Circle2DOptions,
		getTypeName: function ()
		{
			return "Circle2DOptions";
		},
		getComponentName: function ()
		{
			return "Cobweb";
		},
		getContainerField: function ()
		{
			return "circle2DOptions";
		},
		initialize: function ()
		{
			this .addInterest (this, "build");

			this .build ();
		},
		getVertices: function ()
		{
			return this .vertices;
		},
		getExtents: function ()
		{
			return this .extents;
		},
		build: function ()
		{
			var
				segments = this .segments_ .getValue (),
				angle    = Math .PI * 2 / segments;
		
			this .vertices .length = 0;

			for (var n = 0; n < segments; ++ n)
			{
				var point = Complex .Polar (1, angle * n);
		
				this .vertices .push (point .real, point .imag, 0, 1);
			}
		},
	});

	return Circle2DOptions;
});
