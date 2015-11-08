
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
"use strict";

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
		if (this instanceof MFBool)
			return X3DArrayField .call (this, arguments);
		
		return X3DArrayField .call (Object .create (MFBool .prototype), arguments);
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
		if (this instanceof MFColor)
			return X3DArrayField .call (this, arguments);
		
		return X3DArrayField .call (Object .create (MFColor .prototype), arguments);
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
		if (this instanceof MFColorRGBA)
			return X3DArrayField .call (this, arguments);
		
		return X3DArrayField .call (Object .create (MFColorRGBA .prototype), arguments);
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
		if (this instanceof MFDouble)
			return X3DArrayField .call (this, arguments);
		
		return X3DArrayField .call (Object .create (MFDouble .prototype), arguments);
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
		if (this instanceof MFFloat)
			return X3DArrayField .call (this, arguments);
		
		return X3DArrayField .call (Object .create (MFFloat .prototype), arguments);
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
		if (this instanceof MFImage)
			return X3DArrayField .call (this, arguments);
		
		return X3DArrayField .call (Object .create (MFImage .prototype), arguments);
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
		if (this instanceof MFInt32)
			return X3DArrayField .call (this, arguments);
		
		return X3DArrayField .call (Object .create (MFInt32 .prototype), arguments);
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
		if (this instanceof MFMatrix3d)
			return X3DArrayField .call (this, arguments);
		
		return X3DArrayField .call (Object .create (MFMatrix3d .prototype), arguments);
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
		if (this instanceof MFMatrix3f)
			return X3DArrayField .call (this, arguments);
		
		return X3DArrayField .call (Object .create (MFMatrix3f .prototype), arguments);
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
		if (this instanceof MFMatrix4d)
			return X3DArrayField .call (this, arguments);
		
		return X3DArrayField .call (Object .create (MFMatrix4d .prototype), arguments);
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
		if (this instanceof MFMatrix4f)
			return X3DArrayField .call (this, arguments);
		
		return X3DArrayField .call (Object .create (MFMatrix4f .prototype), arguments);
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
		if (this instanceof MFNode)
			return X3DArrayField .call (this, arguments);
		
		return X3DArrayField .call (Object .create (MFNode .prototype), arguments);
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
		clone: function ()
		{
			var clone = new MFNode ();
			clone .setValue (this);
			return clone;
		},
		copy: function (executionContext)
		{
			var
				copy   = new MFNode (),
				array1 = this .getValue (),
				array2 = copy .getValue ();

			for (var i = 0, length = array1 .length; i < length; ++ i)
			{
				var value = array1 [i] .copy (executionContext);
				value .addParent (copy);
				array2 .push (value);
			}

			return copy;
		},
	});

	/*
	 *  MFRotation
	 */

	function MFRotation (value)
	{
		if (this instanceof MFRotation)
			return X3DArrayField .call (this, arguments);
		
		return X3DArrayField .call (Object .create (MFRotation .prototype), arguments);
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
		if (this instanceof MFString)
			return X3DArrayField .call (this, arguments);
		
		return X3DArrayField .call (Object .create (MFString .prototype), arguments);
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
		if (this instanceof MFTime)
			return X3DArrayField .call (this, arguments);
		
		return X3DArrayField .call (Object .create (MFTime .prototype), arguments);
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
		if (this instanceof MFVec2d)
			return X3DArrayField .call (this, arguments);
		
		return X3DArrayField .call (Object .create (MFVec2d .prototype), arguments);
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
		if (this instanceof MFVec2f)
			return X3DArrayField .call (this, arguments);
		
		return X3DArrayField .call (Object .create (MFVec2f .prototype), arguments);
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
		if (this instanceof MFVec3d)
			return X3DArrayField .call (this, arguments);
		
		return X3DArrayField .call (Object .create (MFVec3d .prototype), arguments);
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
		if (this instanceof MFVec3f)
			return X3DArrayField .call (this, arguments);
		
		return X3DArrayField .call (Object .create (MFVec3f .prototype), arguments);
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
		if (this instanceof MFVec4d)
			return X3DArrayField .call (this, arguments);
		
		return X3DArrayField .call (Object .create (MFVec4d .prototype), arguments);
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
		if (this instanceof MFVec4f)
			return X3DArrayField .call (this, arguments);
		
		return X3DArrayField .call (Object .create (MFVec4f .prototype), arguments);
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