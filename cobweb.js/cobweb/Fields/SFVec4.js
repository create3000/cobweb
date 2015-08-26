
define ([
	"jquery",
	"standard/Math/Numbers/Vector4",
	"cobweb/Basic/X3DField",
	"cobweb/Bits/X3DConstants",
],
function ($, Vector4, X3DField, X3DConstants)
{
	function SFVec4 (x, y, z, w)
	{
		if (arguments .length)
		{
			if (arguments [0] instanceof Vector4)
				X3DField .call (this, arguments [0]);
			else
				X3DField .call (this, new Vector4 (+x, +y, +z, +w));
		}
		else
			X3DField .call (this, new Vector4 (0, 0, 0, 0));
	}

	SFVec4 .prototype = $.extend (Object .create (X3DField .prototype),
	{
		constructor: SFVec4,
		copy: function ()
		{
			return new (this .constructor) (this .getValue () .copy ());
		},
		equals: function (vector)
		{
			return this .getValue () .equals (vector .getValue ());
		},
		set: function (value)
		{
			this .getValue () .assign (value);
		},
		negate: function ()
		{
			return new (this .constructor) (Vector4 .negate (this .getValue () .copy ()));
		},
		add: function (vector)
		{
			return new (this .constructor) (Vector4 .add (this .getValue (), vector .getValue ()));
		},
		subtract: function (vector)
		{
			return new (this .constructor) (Vector4 .subtract (this .getValue (), vector .getValue ()));
		},
		multiply: function (value)
		{
			return new (this .constructor) (Vector4 .multiply (this .getValue (), value));
		},
		divide: function (value)
		{
			return new (this .constructor) (Vector4 .divide (this .getValue (), value));
		},
		dot: function (vector)
		{
			return new (this .constructor) (this .getValue () .dot (vector .getValue ()));
		},
		normalize: function (vector)
		{
			return new (this .constructor) (Vector4 .normalize (this .getValue ()));
		},
		length: function (vector)
		{
			return new (this .constructor) (this .getValue () .abs ());
		},
		toString: function ()
		{
			return this .getValue () .toString ();
		},
	});

	Object .defineProperty (SFVec4 .prototype, "x",
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

	Object .defineProperty (SFVec4 .prototype, "0",
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

	Object .defineProperty (SFVec4 .prototype, "y",
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

	Object .defineProperty (SFVec4 .prototype, "1",
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

	Object .defineProperty (SFVec4 .prototype, "z",
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

	Object .defineProperty (SFVec4 .prototype, "2",
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

	Object .defineProperty (SFVec4 .prototype, "w",
	{
		get: function ()
		{
			return this .getValue () .w;
		},
		set: function (value)
		{
			this .getValue () .w = value;
			this .addEvent ();
		},
		enumerable: true,
		configurable: false
	});

	Object .defineProperty (SFVec4 .prototype, "3",
	{
		get: function ()
		{
			return this .getValue () .w;
		},
		set: function (value)
		{
			this .getValue () .w = value;
			this .addEvent ();
		},
		enumerable: false,
		configurable: false
	});

	/*
	 *  SFVec4d
	 */

	function SFVec4d (x, y, z, w)
	{
		SFVec4 .apply (this, arguments);
	}

	SFVec4d .prototype = $.extend (Object .create (SFVec4 .prototype),
	{
		constructor: SFVec4d,
		getTypeName: function ()
		{
			return "SFVec4d";
		},
		getType: function ()
		{
			return X3DConstants .SFVec4d;
		},
	});

	/*
	 *  SFVec4f
	 */

	function SFVec4f (x, y, z, w)
	{
		SFVec4 .apply (this, arguments);
	}

	SFVec4f .prototype = $.extend (Object .create (SFVec4 .prototype),
	{
		constructor: SFVec4f,
		getTypeName: function ()
		{
			return "SFVec4f";
		},
		getType: function ()
		{
			return X3DConstants .SFVec4f;
		},
	});

	return {
		SFVec4d: SFVec4d,
		SFVec4f: SFVec4f,
	};
});
