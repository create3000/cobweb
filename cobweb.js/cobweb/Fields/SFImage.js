
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
		this .width_  = width;
		this .height_ = height;
		this .comp    = comp;
		this .array   = new MFInt32 (array);
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
			this .array .assign (array);
		},
	};

	Object .defineProperty (SFImage .prototype, "width",
	{
		get: function ()
		{
			return this .width_;
		},
		set: function (value)
		{
			this .width_ = value;
			this .array .length = this .width  * this .height;
		},
		enumerable: true,
		configurable: false
	});

	Object .defineProperty (SFImage .prototype, "height",
	{
		get: function ()
		{
			return this .height_;
		},
		set: function (value)
		{
			this .height_ = value;
			this .array .length = this .width  * this .height;
		},
		enumerable: true,
		configurable: false
	});

	/*
	 *  SFImage
	 */

	function SFImage (width, height, comp, array)
	{
		if (arguments .length)
			X3DField .call (this, new Image (+width, +height, +comp, array));
		else
			X3DField .call (this, new Image (0, 0, 0, new MFInt32 ()));

		this .getValue () .array .addParent (this);
		//this .getValue () .array .addInterest (this, "set_size__");
	}

	SFImage .prototype = $.extend (new X3DField (),
	{
		constructor: SFImage,
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
			return this .getValue () .width;
		},
		set: function (value)
		{
			this .getValue () .width = value;
			this .addEvent ();
		},
		enumerable: true,
		configurable: false
	});

	Object .defineProperty (SFImage .prototype, "x",
	{
		get: function ()
		{
			return this .getValue () .width;
		},
		set: function (value)
		{
			this .getValue () .width = value;
			this .addEvent ();
		},
		enumerable: false,
		configurable: false
	});

	Object .defineProperty (SFImage .prototype, "height",
	{
		get: function ()
		{
			return this .getValue () .height;
		},
		set: function (value)
		{
			this .getValue () .height = value;
			this .addEvent ();
		},
		enumerable: true,
		configurable: false
	});

	Object .defineProperty (SFImage .prototype, "y",
	{
		get: function ()
		{
			return this .getValue () .height;
		},
		set: function (value)
		{
			this .getValue () .height = value;
			this .addEvent ();
		},
		enumerable: false,
		configurable: false
	});

	Object .defineProperty (SFImage .prototype, "comp",
	{
		get: function ()
		{
			return this .getValue () .comp;
		},
		set: function (value)
		{
			this .getValue () .comp = value;
			this .addEvent ();
		},
		enumerable: true,
		configurable: false
	});

	Object .defineProperty (SFImage .prototype, "array",
	{
		get: function ()
		{
			return this .getValue () .array;
		},
		set: function (value)
		{
			this .getValue () .array = value;
			this .addEvent ();
		},
		enumerable: true,
		configurable: false
	});

	return SFImage;
});
