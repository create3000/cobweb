
define ([
	"jquery",
	"cobweb/Fields/SFBool",
	"cobweb/Fields/SFColor",
	"cobweb/Fields/SFColorRGBA",
	"cobweb/Fields/SFDouble",
	"cobweb/Fields/SFFloat",
	"cobweb/Fields/SFImage",
	"cobweb/Fields/SFInt32",
	"cobweb/Fields/SFMatrix3",
	"cobweb/Fields/SFMatrix4",
	"cobweb/Fields/SFNode",
	"cobweb/Fields/SFRotation",
	"cobweb/Fields/SFString",
	"cobweb/Fields/SFTime",
	"cobweb/Fields/SFVec2",
	"cobweb/Fields/SFVec3",
	"cobweb/Fields/SFVec4",
	"cobweb/Basic/X3DArrayField",
	"cobweb/Bits/X3DConstants",
],
function ($,
          SFBool,
          SFColor,
          SFColorRGBA,
          SFDouble,
          SFFloat,
          SFImage,
          SFInt32,
          SFMatrix3,
          SFMatrix4,
          SFNode,
          SFRotation,
          SFString,
          SFTime,
          SFVec2,
          SFVec3,
          SFVec4,
          X3DArrayField,
          X3DConstants)
{
	var
		SFMatrix3d = SFMatrix3 .SFMatrix3d,
		SFMatrix3f = SFMatrix3 .SFMatrix3f,
		SFMatrix4d = SFMatrix4 .SFMatrix4d,
		SFMatrix4f = SFMatrix4 .SFMatrix4f,
		SFVec2d    = SFVec2 .SFVec2d,
		SFVec2f    = SFVec2 .SFVec2f,
		SFVec3d    = SFVec3 .SFVec3d,
		SFVec3f    = SFVec3 .SFVec3f,
		SFVec4d    = SFVec4 .SFVec4d,
		SFVec4f    = SFVec4 .SFVec4f;

	/*
	 *  MFBool
	 */

	function MFBool (value)
	{
		return X3DArrayField .call (this, arguments);
	}

	MFBool .prototype = $.extend (Object .create (X3DArrayField .prototype),
	{
		constructor: MFBool,
		valueType_: SFBool,
		getTypeName: function ()
		{
			return "MFBool";
		},
		getType: function ()
		{
			return X3DConstants .MFBool;
		},
	});

	/*
	 *  MFColor
	 */

	function MFColor (value)
	{
		return X3DArrayField .call (this, arguments);
	}

	MFColor .prototype = $.extend (Object .create (X3DArrayField .prototype),
	{
		constructor: MFColor,
		valueType_: SFColor,
		getTypeName: function ()
		{
			return "MFColor";
		},
		getType: function ()
		{
			return X3DConstants .MFColor;
		},
	});

	/*
	 *  MFColorRGBA
	 */

	function MFColorRGBA (value)
	{
		return X3DArrayField .call (this, arguments);
	}

	MFColorRGBA .prototype = $.extend (Object .create (X3DArrayField .prototype),
	{
		constructor: MFColorRGBA,
		valueType_: SFColorRGBA,
		getTypeName: function ()
		{
			return "MFColorRGBA";
		},
		getType: function ()
		{
			return X3DConstants .MFColorRGBA;
		},
	});

	/*
	 *  MFDouble
	 */

	function MFDouble (value)
	{
		return X3DArrayField .call (this, arguments);
	}

	MFDouble .prototype = $.extend (Object .create (X3DArrayField .prototype),
	{
		constructor: MFDouble,
		valueType_: SFDouble,
		getTypeName: function ()
		{
			return "MFDouble";
		},
		getType: function ()
		{
			return X3DConstants .MFDouble;
		},
	});

	/*
	 *  MFFloat
	 */

	function MFFloat (value)
	{
		return X3DArrayField .call (this, arguments);
	}

	MFFloat .prototype = $.extend (Object .create (X3DArrayField .prototype),
	{
		constructor: MFFloat,
		valueType_: SFFloat,
		getTypeName: function ()
		{
			return "MFFloat";
		},
		getType: function ()
		{
			return X3DConstants .MFFloat;
		},
	});

	/*
	 *  MFImage
	 */

	function MFImage (value)
	{
		return X3DArrayField .call (this, arguments);
	}

	MFImage .prototype = $.extend (Object .create (X3DArrayField .prototype),
	{
		constructor: MFImage,
		valueType_: SFImage,
		getTypeName: function ()
		{
			return "MFImage";
		},
		getType: function ()
		{
			return X3DConstants .MFImage;
		},
	});

	/*
	 *  MFInt32
	 */

	function MFInt32 (value)
	{
		return X3DArrayField .call (this, arguments);
	}

	MFInt32 .prototype = $.extend (Object .create (X3DArrayField .prototype),
	{
		constructor: MFInt32,
		valueType_: SFInt32,
		getTypeName: function ()
		{
			return "MFInt32";
		},
		getType: function ()
		{
			return X3DConstants .MFInt32;
		},
	});

	/*
	 *  MFMatrix3d
	 */

	function MFMatrix3d (value)
	{
		return X3DArrayField .call (this, arguments);
	}

	MFMatrix3d .prototype = $.extend (Object .create (X3DArrayField .prototype),
	{
		constructor: MFMatrix3d,
		valueType_: SFMatrix3d,
		getTypeName: function ()
		{
			return "MFMatrix3d";
		},
		getType: function ()
		{
			return X3DConstants .MFMatrix3d;
		},
	});

	/*
	 *  MFMatrix3f
	 */

	function MFMatrix3f (value)
	{
		return X3DArrayField .call (this, arguments);
	}

	MFMatrix3f .prototype = $.extend (Object .create (X3DArrayField .prototype),
	{
		constructor: MFMatrix3f,
		valueType_: SFMatrix3f,
		getTypeName: function ()
		{
			return "MFMatrix3f";
		},
		getType: function ()
		{
			return X3DConstants .MFMatrix3f;
		},
	});

	/*
	 *  MFMatrix4d
	 */

	function MFMatrix4d (value)
	{
		return X3DArrayField .call (this, arguments);
	}

	MFMatrix4d .prototype = $.extend (Object .create (X3DArrayField .prototype),
	{
		constructor: MFMatrix4d,
		valueType_: SFMatrix4d,
		getTypeName: function ()
		{
			return "MFMatrix4d";
		},
		getType: function ()
		{
			return X3DConstants .MFMatrix4d;
		},
	});

	/*
	 *  MFMatrix4f
	 */

	function MFMatrix4f (value)
	{
		return X3DArrayField .call (this, arguments);
	}

	MFMatrix4f .prototype = $.extend (Object .create (X3DArrayField .prototype),
	{
		constructor: MFMatrix4f,
		valueType_: SFMatrix4f,
		getTypeName: function ()
		{
			return "MFMatrix4f";
		},
		getType: function ()
		{
			return X3DConstants .MFMatrix4f;
		},
	});

	/*
	 *  MFNode
	 */

	function MFNode (value)
	{
		return X3DArrayField .call (this, arguments);
	}

	MFNode .prototype = $.extend (Object .create (X3DArrayField .prototype),
	{
		constructor: MFNode,
		valueType_: SFNode,
		getTypeName: function ()
		{
			return "MFNode";
		},
		getType: function ()
		{
			return X3DConstants .MFNode;
		},
	});

	/*
	 *  MFRotation
	 */

	function MFRotation (value)
	{
		return X3DArrayField .call (this, arguments);
	}

	MFRotation .prototype = $.extend (Object .create (X3DArrayField .prototype),
	{
		constructor: MFRotation,
		valueType_: SFRotation,
		getTypeName: function ()
		{
			return "MFRotation";
		},
		getType: function ()
		{
			return X3DConstants .MFRotation;
		},
	});

	/*
	 *  MFString
	 */

	function MFString (value)
	{
		return X3DArrayField .call (this, arguments);
	}

	MFString .prototype = $.extend (Object .create (X3DArrayField .prototype),
	{
		constructor: MFString,
		valueType_: SFString,
		getTypeName: function ()
		{
			return "MFString";
		},
		getType: function ()
		{
			return X3DConstants .MFString;
		},
	});

	/*
	 *  MFTime
	 */

	function MFTime (value)
	{
		return X3DArrayField .call (this, arguments);
	}

	MFTime .prototype = $.extend (Object .create (X3DArrayField .prototype),
	{
		constructor: MFTime,
		valueType_: SFTime,
		getTypeName: function ()
		{
			return "MFTime";
		},
		getType: function ()
		{
			return X3DConstants .MFTime;
		},
	});

	/*
	 *  MFVec2d
	 */

	function MFVec2d (value)
	{
		return X3DArrayField .call (this, arguments);
	}

	MFVec2d .prototype = $.extend (Object .create (X3DArrayField .prototype),
	{
		constructor: MFVec2d,
		valueType_: SFVec2d,
		getTypeName: function ()
		{
			return "MFVec2d";
		},
		getType: function ()
		{
			return X3DConstants .MFVec2d;
		},
	});

	/*
	 *  MFVec2f
	 */

	function MFVec2f (value)
	{
		return X3DArrayField .call (this, arguments);
	}

	MFVec2f .prototype = $.extend (Object .create (X3DArrayField .prototype),
	{
		constructor: MFVec2f,
		valueType_: SFVec2f,
		getTypeName: function ()
		{
			return "MFVec2f";
		},
		getType: function ()
		{
			return X3DConstants .MFVec2f;
		},
	});

	/*
	 *  MFVec3d
	 */

	function MFVec3d (value)
	{
		return X3DArrayField .call (this, arguments);
	}

	MFVec3d .prototype = $.extend (Object .create (X3DArrayField .prototype),
	{
		constructor: MFVec3d,
		valueType_: SFVec3d,
		getTypeName: function ()
		{
			return "MFVec3d";
		},
		getType: function ()
		{
			return X3DConstants .MFVec3d;
		},
	});

	/*
	 *  MFVec3f
	 */

	function MFVec3f (value)
	{
		return X3DArrayField .call (this, arguments);
	}

	MFVec3f .prototype = $.extend (Object .create (X3DArrayField .prototype),
	{
		constructor: MFVec3f,
		valueType_: SFVec3f,
		getTypeName: function ()
		{
			return "MFVec3f";
		},
		getType: function ()
		{
			return X3DConstants .MFVec3f;
		},
	});

	/*
	 *  MFVec4d
	 */

	function MFVec4d (value)
	{
		return X3DArrayField .call (this, arguments);
	}

	MFVec4d .prototype = $.extend (Object .create (X3DArrayField .prototype),
	{
		constructor: MFVec4d,
		valueType_: SFVec4d,
		getTypeName: function ()
		{
			return "MFVec4d";
		},
		getType: function ()
		{
			return X3DConstants .MFVec4d;
		},
	});

	/*
	 *  MFVec4f
	 */

	function MFVec4f (value)
	{
		return X3DArrayField .call (this, arguments);
	}

	MFVec4f .prototype = $.extend (Object .create (X3DArrayField .prototype),
	{
		constructor: MFVec4f,
		valueType_: SFVec4f,
		getTypeName: function ()
		{
			return "MFVec4f";
		},
		getType: function ()
		{
			return X3DConstants .MFVec4f;
		},
	});

	var ArrayFields =
	{
		MFBool:      MFBool,
		MFColor:     MFColor,
		MFColorRGBA: MFColorRGBA,
		MFDouble:    MFDouble,
		MFFloat:     MFFloat,
		MFImage:     MFImage,
		MFInt32:     MFInt32,
		MFMatrix3d:  MFMatrix3d,
		MFMatrix3f:  MFMatrix3f,
		MFMatrix4d:  MFMatrix4d,
		MFMatrix4f:  MFMatrix4f,
		MFNode:      MFNode,
		MFRotation:  MFRotation,
		MFString:    MFString,
		MFTime:      MFTime,
		MFVec2d:     MFVec2d,
		MFVec2f:     MFVec2f,
		MFVec3d:     MFVec3d,
		MFVec3f:     MFVec3f,
		MFVec4d:     MFVec4d,
		MFVec4f:     MFVec4f,
	};

	Object .preventExtensions (ArrayFields);
	Object .freeze (ArrayFields);
	Object .seal (ArrayFields);

	return ArrayFields;
});