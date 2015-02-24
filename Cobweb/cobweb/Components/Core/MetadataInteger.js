
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Core/X3DNode",
	"cobweb/Components/Core/X3DMetadataObject",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DNode, 
          X3DMetadataObject, 
          X3DConstants)
{
	with (Fields)
	{
		function MetadataInteger (executionContext)
		{
			X3DNode .call (this, executionContext .getBrowser (), executionContext);
			X3DMetadataObject .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .MetadataInteger);
		}

		MetadataInteger .prototype = $.extend (new X3DNode (),new X3DMetadataObject (),
		{
			constructor: MetadataInteger,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",  new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "name",      new SFString ("")),
				new X3DFieldDefinition (X3DConstants .inputOutput, "reference", new SFString ("")),
				new X3DFieldDefinition (X3DConstants .inputOutput, "value",     new MFInt32 ()),
			]),
			getTypeName: function ()
			{
				return "MetadataInteger";
			},
			getComponentName: function ()
			{
				return "Core";
			},
			getContainerField: function ()
			{
				return "metadata";
			},
		});

		return MetadataInteger;
	}
});

