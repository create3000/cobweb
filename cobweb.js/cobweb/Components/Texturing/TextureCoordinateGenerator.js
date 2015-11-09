
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

	function TextureCoordinateGenerator (executionContext)
	{
		X3DTextureCoordinateNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .TextureCoordinateGenerator);
	}

	TextureCoordinateGenerator .prototype = $.extend (Object .create (X3DTextureCoordinateNode .prototype),
	{
		constructor: TextureCoordinateGenerator,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",  new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "mode",      new Fields .SFString ("SPHERE")),
			new X3DFieldDefinition (X3DConstants .inputOutput, "parameter", new Fields .MFFloat ()),
		]),
		getTypeName: function ()
		{
			return "TextureCoordinateGenerator";
		},
		getComponentName: function ()
		{
			return "Texturing";
		},
		getContainerField: function ()
		{
			return "texCoord";
		},
	});

	return TextureCoordinateGenerator;
});


