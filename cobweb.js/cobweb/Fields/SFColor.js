
define ([
	"jquery",
	"standard/Math/Numbers/Color3",
	"cobweb/Basic/X3DField",
	"cobweb/Bits/X3DConstants",
],
function ($, Color3, X3DField, X3DConstants)
{
"use strict";

	function SFColor (r, g, b)
	{
		if (this instanceof SFColor)
		{
			if (arguments .length)
			{
				if (arguments [0] instanceof Color3)
					return X3DField .call (this, arguments [0]);
				else
					return X3DField .call (this, new Color3 (+r, +g, +b));
			}

			return X3DField .call (this, new Color3 ());
		}

		return SFColor .apply (Object .create (SFColor .prototype), arguments);
	}

	SFColor .prototype = $.extend (Object .create (X3DField .prototype),
	{
		constructor: SFColor,
		copy: function ()
		{
			return new SFColor (this .getValue () .copy ());
		},
		getTypeName: function ()
		{
			return "SFColor";
		},
		getType: function ()
		{
			return X3DConstants .SFColor;
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
			return this .getValue () .getHSV () .slice (0);
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

	Object .defineProperty (SFColor .prototype, "r",
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

	Object .defineProperty (SFColor .prototype, "0",
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

	Object .defineProperty (SFColor .prototype, "g",
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

	Object .defineProperty (SFColor .prototype, "1",
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

	Object .defineProperty (SFColor .prototype, "b",
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

	Object .defineProperty (SFColor .prototype, "2",
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

	return SFColor;
});
