
define ([
	"jquery",
	"cobweb/Fields/SFVec3",
	"cobweb/Basic/X3DField",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Rotation4",
],
function ($, SFVec3, X3DField, X3DConstants, Rotation4)
{
	var SFVec3f = SFVec3 .SFVec3f;

	function SFRotation (x, y, z, angle)
	{
		switch (arguments .length)
		{
			case 0:
				X3DField .call (this, new Rotation4 ());
				return;
			case 1:
				X3DField .call (this, arguments [0]);
				return;
			case 2:
				if (arguments [1] instanceof SFVec3f)
					X3DField .call (this, new Rotation4 (arguments [0] .getValue (), arguments [1] .getValue ()));
				else
					X3DField .call (this, new Rotation4 (arguments [0] .getValue (), +arguments [1]));
				return;
			case 4:
				X3DField .call (this, new Rotation4 (+x, +y, +z, +angle));
				return;
		}
	}

	SFRotation .prototype = $.extend (new X3DField (),
	{
		constructor: SFRotation,
		copy: function ()
		{
			return new SFRotation (this .getValue () .copy ());
		},
		equals: function (rotation)
		{
			return this .getValue () .equals (rotation .getValue ());
		},
		getTypeName: function ()
		{
			return "SFRotation";
		},
		getType: function ()
		{
			return X3DConstants .SFRotation;
		},
		set: function (value)
		{
			this .getValue () .assign (value);
		},
		inverse: function ()
		{
			return new SFRotation (this .getValue () .copy () .inverse ());
		},
		multiply: function (rotation)
		{
			return new SFRotation (this .getValue () .copy () .multLeft (rotation .getValue ()));
		},
		multVec: function (vector)
		{
			return new SFVec3f (this .getValue () .multVecRot (vector .getValue () .copy ()));
		},
		slerp: function (rotation, t)
		{
			return new SFRotation (Rotation4 .slerp (this .getValue (), rotation .getValue (), t));
		},
		toString: function ()
		{
			return this .getValue () .toString ();
		},
	});

	Object .defineProperty (SFRotation .prototype, "x",
	{
		get: function ()
		{
			return this .getValue () .x;
		},
		set: function (value)
		{
			this .getValue () .x = value;
			this .addEvent ();
		},
		enumerable: false,
		configurable: false
	});

	Object .defineProperty (SFRotation .prototype, "0",
	{
		get: function ()
		{
			return this .getValue () .x;
		},
		set: function (value)
		{
			this .getValue () .x = value;
			this .addEvent ();
		},
		enumerable: true,
		configurable: false
	});

	Object .defineProperty (SFRotation .prototype, "y",
	{
		get: function ()
		{
			return this .getValue () .y;
		},
		set: function (value)
		{
			this .getValue () .y = value;
			this .addEvent ();
		},
		enumerable: false,
		configurable: false
	});

	Object .defineProperty (SFRotation .prototype, "1",
	{
		get: function ()
		{
			return this .getValue () .y;
		},
		set: function (value)
		{
			this .getValue () .y = value;
			this .addEvent ();
		},
		enumerable: true,
		configurable: false
	});

	Object .defineProperty (SFRotation .prototype, "z",
	{
		get: function ()
		{
			return this .getValue () .z;
		},
		set: function (value)
		{
			this .getValue () .z = value;
			this .addEvent ();
		},
		enumerable: false,
		configurable: false
	});

	Object .defineProperty (SFRotation .prototype, "2",
	{
		get: function ()
		{
			return this .getValue () .z;
		},
		set: function (value)
		{
			this .getValue () .z = value;
			this .addEvent ();
		},
		enumerable: true,
		configurable: false
	});

	Object .defineProperty (SFRotation .prototype, "angle",
	{
		get: function ()
		{
			return this .getValue () .angle;
		},
		set: function (value)
		{
			this .getValue () .angle = value;
			this .addEvent ();
		},
		enumerable: false,
		configurable: false
	});

	Object .defineProperty (SFRotation .prototype, "3",
	{
		get: function ()
		{
			return this .getValue () .angle;
		},
		set: function (value)
		{
			this .getValue () .angle = value;
			this .addEvent ();
		},
		enumerable: true,
		configurable: false
	});

	return SFRotation;
});
