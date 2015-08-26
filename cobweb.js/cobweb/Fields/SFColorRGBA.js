
define ([
	"jquery",
	"standard/Math/Numbers/Color4",
	"cobweb/Basic/X3DField",
	"cobweb/Bits/X3DConstants",
],
function ($, Color4, X3DField, X3DConstants)
{
	function SFColorRGBA (r, g, b, a)
	{
		if (arguments .length)
		{
			if (arguments [0] instanceof Color4)
				X3DField .call (this, arguments [0]);
			else
				X3DField .call (this, new Color4 (+r, +g, +b, +a));
		}
		else
			X3DField .call (this, new Color4 ());
	}

	SFColorRGBA .prototype = $.extend (Object .create (X3DField .prototype),
	{
		constructor: SFColorRGBA,
		copy: function ()
		{
			return new SFColorRGBA (this .getValue () .copy ());
		},
		getTypeName: function ()
		{
			return "SFColorRGBA";
		},
		getType: function ()
		{
			return X3DConstants .SFColorRGBA;
		},
		equals: function (color)
		{
			return this .getValue () .equals (color .getValue ());
		},
		set: function (value)
		{
			this .getValue () .assign (value);
		},
		getHSV: function ()
		{
			return this .getValue () .getHSV ();
		},
		setHSV: function (h, s, v)
		{
			this .getValue () .setHSV (h, s, v);
			this .addEvent ();
		},
		toString: function ()
		{
			return this .getValue () .toString ();
		},
	});

	Object .defineProperty (SFColorRGBA .prototype, "r",
	{
		get: function ()
		{
			return this .getValue () .r;
		},
		set: function (value)
		{
			this .getValue () .r = value;
			this .addEvent ();
		},
		enumerable: true,
		configurable: false
	});

	Object .defineProperty (SFColorRGBA .prototype, "0",
	{
		get: function ()
		{
			return this .getValue () .r;
		},
		set: function (value)
		{
			this .getValue () .r = value;
			this .addEvent ();
		},
		enumerable: false,
		configurable: false
	});

	Object .defineProperty (SFColorRGBA .prototype, "g",
	{
		get: function ()
		{
			return this .getValue () .g;
		},
		set: function (value)
		{
			this .getValue () .g = value;
			this .addEvent ();
		},
		enumerable: true,
		configurable: false
	});

	Object .defineProperty (SFColorRGBA .prototype, "1",
	{
		get: function ()
		{
			return this .getValue () .g;
		},
		set: function (value)
		{
			this .getValue () .g = value;
			this .addEvent ();
		},
		enumerable: false,
		configurable: false
	});

	Object .defineProperty (SFColorRGBA .prototype, "b",
	{
		get: function ()
		{
			return this .getValue () .b;
		},
		set: function (value)
		{
			this .getValue () .b = value;
			this .addEvent ();
		},
		enumerable: true,
		configurable: false
	});

	Object .defineProperty (SFColorRGBA .prototype, "2",
	{
		get: function ()
		{
			return this .getValue () .b;
		},
		set: function (value)
		{
			this .getValue () .b = value;
			this .addEvent ();
		},
		enumerable: false,
		configurable: false
	});

	Object .defineProperty (SFColorRGBA .prototype, "a",
	{
		get: function ()
		{
			return this .getValue () .a;
		},
		set: function (value)
		{
			this .getValue () .a = value;
			this .addEvent ();
		},
		enumerable: true,
		configurable: false
	});

	Object .defineProperty (SFColorRGBA .prototype, "3",
	{
		get: function ()
		{
			return this .getValue () .a;
		},
		set: function (value)
		{
			this .getValue () .a = value;
			this .addEvent ();
		},
		enumerable: false,
		configurable: false
	});

	return SFColorRGBA;
});
