
define ([
	"jquery",
	"cobweb/Basic/X3DField",
	"cobweb/Fields/ArrayFields",
	"cobweb/Bits/X3DConstants",
],
function ($, X3DField, ArrayFields, X3DConstants)
{
	var MFInt32 = ArrayFields .MFInt32;

	/*
	 *  Image
	 */

	function Image (width, height, comp, array)
	{
		this .width  = width;
		this .height = height;
		this .comp   = comp;
		this .array  = new MFInt32 ();
		this .array .setValue (array);
		this .array .length = width * height;
	}
	
	Image .prototype =
	{
		constructor: Image,
		copy: function ()
		{
			return new Image (this .width, this .height, this .comp, this .array);
		},
		equals: function (image)
		{
			return this .width  === image .width &&
			       this .height === image .height &&
			       this .comp   === image .comp &&
			       this .array .equals (image .array);
		},
		assign: function (image)
		{
			this .width  = image .width;
			this .height = image .height;
			this .comp   = image .comp;
			this .array .assign (image .array);
		},
		set: function (width, height, comp, array)
		{
			this .width  = width;
			this .height = height;
			this .comp   = comp;
			this .array .set (array);
		},
		setWidth: function (value)
		{
			this .width = value;
			this .array .length = this .width  * this .height;	
		},
		getWidth: function ()
		{
			return this .width;
		},
		setHeight: function (value)
		{
			this .height = value;
			this .array .length = this .width  * this .height;	
		},
		getHeight: function ()
		{
			return this .height;
		},
		setComp: function (value)
		{
			this .comp = value;
		},
		getComp: function ()
		{
			return this .comp;
		},
		setArray: function (value)
		{
			this .array .setValue (value);
			this .array .length = this .width  * this .height;	
		},
		getArray: function ()
		{
			return this .array;
		},
	};

	/*
	 *  SFImage
	 */

	function SFImage (width, height, comp, array)
	{
		if (arguments .length === 4)
			X3DField .call (this, new Image (+width, +height, +comp, array));
		else
			X3DField .call (this, new Image (0, 0, 0, new MFInt32 ()));

		this .getValue () .getArray () .addParent (this);
		this .addInterest (this, "set_size__");
	}

	SFImage .prototype = $.extend (new X3DField (),
	{
		constructor: SFImage,
		set_size__: function ()
		{
			this .getValue () .getArray () .length = this .width * this .height;
		},
		copy: function ()
		{
			return new SFImage (this .getValue ());
		},
		equals: function (image)
		{
			return this .getValue () .equals (image .getValue ());
		},
		set: function (image)
		{
			this .getValue () .assign (image);
		},
		getTypeName: function ()
		{
			return "SFImage";
		},
		getType: function ()
		{
			return X3DConstants .SFImage;
		},
		toString: function ()
		{
			return this .width + " " + this .height + " " + this .comp;
		},
	});

	Object .defineProperty (SFImage .prototype, "width",
	{
		get: function ()
		{
			return this .getValue () .getWidth ();
		},
		set: function (value)
		{
			this .getValue () .setWidth (value);
			this .addEvent ();
		},
		enumerable: true,
		configurable: false
	});

	Object .defineProperty (SFImage .prototype, "x",
	{
		get: function ()
		{
			return this .getValue () .getWidth ();
		},
		set: function (value)
		{
			this .getValue () .setWidth (value);
			this .addEvent ();
		},
		enumerable: false,
		configurable: false
	});

	Object .defineProperty (SFImage .prototype, "height",
	{
		get: function ()
		{
			return this .getValue () .getHeight ();
		},
		set: function (value)
		{
			this .getValue () .setHeight (value);
			this .addEvent ();
		},
		enumerable: true,
		configurable: false
	});

	Object .defineProperty (SFImage .prototype, "y",
	{
		get: function ()
		{
			return this .getValue () .getHeight ();
		},
		set: function (value)
		{
			this .getValue () .setHeight (value);
			this .addEvent ();
		},
		enumerable: false,
		configurable: false
	});

	Object .defineProperty (SFImage .prototype, "comp",
	{
		get: function ()
		{
			return this .getValue () .getComp ();
		},
		set: function (value)
		{
			this .getValue () .setComp (value);
			this .addEvent ();
		},
		enumerable: true,
		configurable: false
	});

	Object .defineProperty (SFImage .prototype, "array",
	{
		get: function ()
		{
			return this .getValue () .getArray ();
		},
		set: function (value)
		{
			this .getValue () .setArray (value);
			this .addEvent ();
		},
		enumerable: true,
		configurable: false
	});

	return SFImage;
});
