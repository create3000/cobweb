
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Core/X3DInfoNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DInfoNode, 
          X3DConstants)
{
	with (Fields)
	{
		function GeoMetadata (executionContext)
		{
			X3DInfoNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .GeoMetadata);
		}

		GeoMetadata .prototype = $.extend (new X3DInfoNode (),
		{
			constructor: GeoMetadata,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata", new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "url",      new MFString ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "summary",  new MFString ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "data",     new MFNode ()),
			]),
			getTypeName: function ()
			{
				return "GeoMetadata";
			},
			getComponentName: function ()
			{
				return "Geospatial";
			},
			getContainerField: function ()
			{
				return "children";
			},
		});

		return GeoMetadata;
	}
});

