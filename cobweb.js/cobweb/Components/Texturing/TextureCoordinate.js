
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
	with (Fields)
	{
		function TextureCoordinate (executionContext)
		{
			X3DTextureCoordinateNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .TextureCoordinate);
		}

		TextureCoordinate .prototype = $.extend (new X3DTextureCoordinateNode (),
		{
			constructor: TextureCoordinate,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata", new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "point",    new MFVec2f ()),
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
				if (index < this .point_ .length)
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
	}
});

