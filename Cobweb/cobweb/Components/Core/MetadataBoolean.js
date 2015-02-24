
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
		function MetadataBoolean (executionContext)
		{
			X3DNode .call (this, executionContext .getBrowser (), executionContext);
			X3DMetadataObject .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .MetadataBoolean);
		}

		MetadataBoolean .prototype = $.extend (new X3DNode (),new X3DMetadataObject (),
		{
			constructor: MetadataBoolean,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",  new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "name",      new SFString ("")),
				new X3DFieldDefinition (X3DConstants .inputOutput, "reference", new SFString ("")),
				new X3DFieldDefinition (X3DConstants .inputOutput, "value",     new MFBool ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",  new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "name",      new SFString ("")),
				new X3DFieldDefinition (X3DConstants .inputOutput, "reference", new SFString ("")),
				new X3DFieldDefinition (X3DConstants .inputOutput, "value",     new MFBool ()),
			]),
			getTypeName: function ()
			{
				return "MetadataBoolean";
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

		return MetadataBoolean;
	}
});

