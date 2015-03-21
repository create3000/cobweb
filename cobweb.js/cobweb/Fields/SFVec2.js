
define ([
	"jquery",
	"standard/Math/Numbers/Vector2",
	"cobweb/Basic/X3DField",
	"cobweb/Bits/X3DConstants",
],
function ($, Vector2, X3DField, X3DConstants)
{
	function SFVec2 (x, y)
	{
		if (arguments .length)
		{
			if (arguments [0] instanceof Vector2)
				X3DField .call (this, arguments [0]);
			else
				X3DField .call (this, new Vector2 (+x, +y));
		}
		else
			X3DField .call (this, new Vector2 (0, 0));
	}

	SFVec2 .prototype = $.extend (new X3DField (),
	{
		constructor: SFVec2,
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
			return new (this .constructor) (this .getValue () .copy () .negate ());
		},
		add: function (vector)
		{
			return new (this .constructor) (this .getValue () .copy () .add (vector .getValue ()));
		},
		subtract: function (vector)
		{
			return new (this .constructor) (this .getValue () .copy () .subtract (vector .getValue ()));
		},
		multiply: function (value)
		{
			return new (this .constructor) (this .getValue () .copy () .multiply (value));
		},
		divide: function (value)
		{
			return new (this .constructor) (this .getValue () .copy () .divide (value));
		},
		dot: function (vector)
		{
			return new (this .constructor) (this .getValue () .dot (vector .getValue ()));
		},
		normalize: function (vector)
		{
			return new (this .constructor) (this .getValue () .copy () .normalize ());
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

	Object .defineProperty (SFVec2 .prototype, "x",
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

	Object .defineProperty (SFVec2 .prototype, "0",
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

	Object .defineProperty (SFVec2 .prototype, "y",
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

	Object .defineProperty (SFVec2 .prototype, "1",
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

	/*
	 *  SFVec2d
	 */

	function SFVec2d (x, y)
	{
		SFVec2 .apply (this, arguments);
	}

	SFVec2d .prototype = $.extend (new SFVec2 (),
	{
		constructor: SFVec2d,
		getTypeName: function ()
		{
			return "SFVec2d";
		},
		getType: function ()
		{
			return X3DConstants .SFVec2d;
		},
	});

	/*
	 *  SFVec2f
	 */

	function SFVec2f (x, y)
	{
		SFVec2 .apply (this, arguments);
	}

	SFVec2f .prototype = $.extend (new SFVec2 (),
	{
		constructor: SFVec2f,
		getTypeName: function ()
		{
			return "SFVec2f";
		},
		getType: function ()
		{
			return X3DConstants .SFVec2f;
		},
	});

	return {
		SFVec2d: SFVec2d,
		SFVec2f: SFVec2f,
	};
});
