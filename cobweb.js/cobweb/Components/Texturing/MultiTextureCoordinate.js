
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

	function MultiTextureCoordinate (executionContext)
	{
		X3DTextureCoordinateNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .MultiTextureCoordinate);
	}

	MultiTextureCoordinate .prototype = $.extend (Object .create (X3DTextureCoordinateNode .prototype),
	{
		constructor: MultiTextureCoordinate,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata", new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "texCoord", new Fields .MFNode ()),
		]),
		getTypeName: function ()
		{
			return "MultiTextureCoordinate";
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

	return MultiTextureCoordinate;
});


