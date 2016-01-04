
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
		ValueType: SFNode,
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
	
	function MFFieldTemplate (TypeName, Type, SFField)
	{
		function MFVec (value)
		{
			if (this instanceof MFVec)
				return X3DArrayField .call (this, arguments);
			
			return X3DArrayField .call (Object .create (MFVec .prototype), arguments);
		}
	
		MFVec .prototype = $.extend (Object .create (X3DArrayField .prototype),
		{
			constructor: MFVec,
			ValueType: SFField,
			getTypeName: function ()
			{
				return TypeName;
			},
			getType: function ()
			{
				return Type;
			},
		});

		return MFVec;
	}

	var ArrayFields =
	{
		MFBool:      MFFieldTemplate ("MFBool",      X3DConstants .MFBool,      SFBool),
		MFColor:     MFFieldTemplate ("MFColor",     X3DConstants .MFColor,     SFColor),
		MFColorRGBA: MFFieldTemplate ("MFColorRGBA", X3DConstants .MFColorRGBA, SFColorRGBA),
		MFDouble:    MFFieldTemplate ("MFDouble",    X3DConstants .MFDouble,    SFDouble),
		MFFloat:     MFFieldTemplate ("MFFloat",     X3DConstants .MFFloat,     SFFloat),
		MFImage:     MFFieldTemplate ("MFImage",     X3DConstants .MFImage,     SFImage),
		MFInt32:     MFFieldTemplate ("MFInt32",     X3DConstants .MFInt32,     SFInt32),
		MFMatrix3d:  MFFieldTemplate ("MFMatrix3d",  X3DConstants .MFMatrix3d,  SFMatrix3d),
		MFMatrix3f:  MFFieldTemplate ("MFMatrix3f",  X3DConstants .MFMatrix3f,  SFMatrix3f),
		MFMatrix4d:  MFFieldTemplate ("MFMatrix4d",  X3DConstants .MFMatrix4d,  SFMatrix4d),
		MFMatrix4f:  MFFieldTemplate ("MFMatrix4f",  X3DConstants .MFMatrix4f,  SFMatrix4f),
		MFNode:      MFNode,
		MFRotation:  MFFieldTemplate ("MFRotation",  X3DConstants .MFRotation,  SFRotation),
		MFString:    MFFieldTemplate ("MFString",    X3DConstants .MFString,    SFString),
		MFTime:      MFFieldTemplate ("MFTime",      X3DConstants .MFTime,      SFTime),
		MFVec2d:     MFFieldTemplate ("MFVec2d",     X3DConstants .MFVec2d,     SFVec2d),
		MFVec2f:     MFFieldTemplate ("MFVec2f",     X3DConstants .MFVec2f,     SFVec2f),
		MFVec3d:     MFFieldTemplate ("MFVec3d",     X3DConstants .MFVec3d,     SFVec3d),
		MFVec3f:     MFFieldTemplate ("MFVec3f",     X3DConstants .MFVec3f,     SFVec3f),
		MFVec4d:     MFFieldTemplate ("MFVec4d",     X3DConstants .MFVec4d,     SFVec4d),
		MFVec4f:     MFFieldTemplate ("MFVec4f",     X3DConstants .MFVec4f,     SFVec4f),
	};

	Object .preventExtensions (ArrayFields);
	Object .freeze (ArrayFields);
	Object .seal (ArrayFields);

	return ArrayFields;
});