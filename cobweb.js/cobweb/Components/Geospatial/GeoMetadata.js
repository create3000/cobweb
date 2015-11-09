
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
"use strict";

	function GeoMetadata (executionContext)
	{
		X3DInfoNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .GeoMetadata);
	}

	GeoMetadata .prototype = $.extend (Object .create (X3DInfoNode .prototype),
	{
		constructor: GeoMetadata,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata", new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "url",      new Fields .MFString ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "summary",  new Fields .MFString ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "data",     new Fields .MFNode ()),
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
});


