
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

	function TextureCoordinate3D (executionContext)
	{
		X3DTextureCoordinateNode .call (this, executionContext);

		this .addType (X3DConstants .TextureCoordinate3D);
	}

	TextureCoordinate3D .prototype = $.extend (Object .create (X3DTextureCoordinateNode .prototype),
	{
		constructor: TextureCoordinate3D,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata", new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "point",    new Fields .MFVec3f ()),
		]),
		getTypeName: function ()
		{
			return "TextureCoordinate3D";
		},
		getComponentName: function ()
		{
			return "Texturing3D";
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
	
				texCoords .push (point .x,
				                 point .y,
				                 point .z,
				                 1);
			}
			else
				texCoords .push (0, 0, 0, 1);
		},
	});

	return TextureCoordinate3D;
});


