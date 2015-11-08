
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
	"cobweb/Fields/ArrayFields",
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
          ArrayFields)
{
"use strict";

	var Fields = $.extend (
	{
		SFBool:      SFBool,
		SFColor:     SFColor,
		SFColorRGBA: SFColorRGBA,
		SFDouble:    SFDouble,
		SFFloat:     SFFloat,
		SFImage:     SFImage,
		SFInt32:     SFInt32,
		SFMatrix3d:  SFMatrix3 .SFMatrix3d,
		SFMatrix3f:  SFMatrix3 .SFMatrix3f,
		SFMatrix4d:  SFMatrix4 .SFMatrix4d,
		SFMatrix4f:  SFMatrix4 .SFMatrix4f,
		SFNode:      SFNode,
		SFRotation:  SFRotation,
		SFString:    SFString,
		SFTime:      SFTime,
		SFVec3d:     SFVec2 .SFVec2d,
		SFVec2f:     SFVec2 .SFVec2f,
		SFVec2d:     SFVec3 .SFVec3d,
		SFVec3f:     SFVec3 .SFVec3f,
		SFVec4d:     SFVec4 .SFVec4d,
		SFVec4f:     SFVec4 .SFVec4f,
		VrmlMatrix:  SFMatrix4 .VrmlMatrix,
	},
	ArrayFields);

	Object .preventExtensions (Fields);
	Object .freeze (Fields);
	Object .seal (Fields);

	return Fields;
});