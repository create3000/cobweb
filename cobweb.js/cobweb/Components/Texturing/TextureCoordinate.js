
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Texturing/X3DTextureCoordinateNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DTextureCoordinateNode, 
          X3DConstants)
{
"use strict";

	function TextureCoordinate (executionContext)
	{
		X3DTextureCoordinateNode .call (this, executionContext .getBrowser (), executionContext);

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
		init: function (texCoords)
		{
			texCoords .push ([ ]);
		},
		addTexCoord: function (texCoord, index)
		{
			this .addTexCoordToChannel (texCoord [0], index);
		},
		addTexCoordToChannel: function (texCoords, index)
		{
			if (index >= 0 && index < this .point_ .length)
			{
				var point2 = this .point_ [index];
	
				texCoords .push (point2 .x);
				texCoords .push (point2 .y);
				texCoords .push (0);
				texCoords .push (1);
			}
			else
			{
				texCoords .push (0);
				texCoords .push (0);
				texCoords .push (0);
				texCoords .push (1);
			}
		},
	});

	return TextureCoordinate;
});


