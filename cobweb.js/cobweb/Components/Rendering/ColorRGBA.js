
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Rendering/X3DColorNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Color4",
	"standard/Math/Numbers/Vector4",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DColorNode, 
          X3DConstants,
          Color4,
          Vector4)
{
"use strict";

	var white = new Color4 (1, 1, 1, 1);

	function ColorRGBA (executionContext)
	{
		X3DColorNode .call (this, executionContext);

		this .addType (X3DConstants .ColorRGBA);
	}

	ColorRGBA .prototype = $.extend (Object .create (X3DColorNode .prototype),
	{
		constructor: ColorRGBA,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata", new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "color",    new Fields .MFColorRGBA ()),
		]),
		getTypeName: function ()
		{
			return "ColorRGBA";
		},
		getComponentName: function ()
		{
			return "Rendering";
		},
		getContainerField: function ()
		{
			return "color";
		},
		isTransparent: function ()
		{
			return true;
		},
		getWhite: function ()
		{
			return white;
		},
		getVectors: function (colors)
		{
			var color = this .color_ .getValue ();

			for (var i = 0, length = color .length; i < length; ++ i)
			{
				var c = color [i] .getValue ();

				colors [i] = new Vector4 (c .r, c .g, c .b, c .a);
			}

			colors .length = length;

			return colors;
		},
	});

	return ColorRGBA;
});


