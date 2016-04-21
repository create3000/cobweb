
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Texturing/X3DTextureCoordinateNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector4",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DTextureCoordinateNode, 
          X3DConstants,
          Vector4)
{
"use strict";

	function TextureCoordinate (executionContext)
	{
		X3DTextureCoordinateNode .call (this, executionContext);

		this .addType (X3DConstants .TextureCoordinate);
	}

	TextureCoordinate .prototype = $.extend (Object .create (X3DTextureCoordinateNode .prototype),
	{
		constructor: TextureCoordinate,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata", new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "point",    new Fields .MFVec2f ()),
		]),
		getTypeName: function ()
		{
			return "TextureCoordinate";
		},
		getComponentName: function ()
		{
			return "Texturing";
		},
		getContainerField: function ()
		{
			return "texCoord";
		},
		addTexCoordToChannel: function (texCoords, index)
		{
			if (index >= 0 && index < this .point_ .length)
			{
				var point = this .point_ [index];
	
				texCoords .push (point .x, point .y, 0, 1);
			}
			else
				texCoords .push (0, 0, 0, 1);

		},
		getTexCoord: function (array)
		{
			var point = this .point_ .getValue ();

			for (var i = 0, length = point .length; i < length; ++ i)
			{
				var p = point[i] .getValue ();

				array [i] = new Vector4 (p .x, p .y, 0, 1);
			}

			array .length = length;

			return array;
		},
	});

	return TextureCoordinate;
});


