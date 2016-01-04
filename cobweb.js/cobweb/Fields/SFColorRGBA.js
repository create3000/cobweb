
define ([
	"jquery",
	"cobweb/Basic/X3DField",
	"cobweb/Fields/SFColor",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Color4",
],
function ($, X3DField, SFColor, X3DConstants, Color4)
{
"use strict";

	function SFColorRGBA (r, g, b, a)
	{
		if (this instanceof SFColorRGBA)
		{
			if (arguments .length)
			{
				if (arguments [0] instanceof Color4)
					return X3DField .call (this, arguments [0]);
				else
					return X3DField .call (this, new Color4 (+r, +g, +b, +a));
			}

			return X3DField .call (this, new Color4 ());
		}

		return SFColorRGBA .apply (Object .create (SFColorRGBA .prototype), arguments);
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
		equals: SFColor .equals,
		set: SFColor .set,
		getHSV: SFColor .getHSV,
		setHSV: SFColor .setHSV,
		toString: SFColor .toString,
	});

	var r = {
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
	};

	var g = {
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
	};

	var b = {
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
	};

	var a = {
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
	};

	Object .defineProperty (SFColorRGBA .prototype, "r", r);
	Object .defineProperty (SFColorRGBA .prototype, "g", g);
	Object .defineProperty (SFColorRGBA .prototype, "b", b);
	Object .defineProperty (SFColorRGBA .prototype, "a", a);

	r .enumerable = false;
	g .enumerable = false;
	b .enumerable = false;
	a .enumerable = false;

	Object .defineProperty (SFColorRGBA .prototype, "0", r);
	Object .defineProperty (SFColorRGBA .prototype, "1", g);
	Object .defineProperty (SFColorRGBA .prototype, "2", b);
	Object .defineProperty (SFColorRGBA .prototype, "3", a);

	return SFColorRGBA;
});
