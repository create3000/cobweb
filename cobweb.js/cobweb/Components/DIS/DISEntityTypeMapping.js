
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

	function DISEntityTypeMapping (executionContext)
	{
		X3DInfoNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .DISEntityTypeMapping);
	}

	DISEntityTypeMapping .prototype = $.extend (Object .create (X3DInfoNode .prototype),
	{
		constructor: DISEntityTypeMapping,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",    new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "url",         new Fields .MFString ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "category",    new Fields .SFInt32 ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "country",     new Fields .SFInt32 ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "domain",      new Fields .SFInt32 ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "extra",       new Fields .SFInt32 ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "kind",        new Fields .SFInt32 ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "specific",    new Fields .SFInt32 ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "subcategory", new Fields .SFInt32 ()),
		]),
		getTypeName: function ()
		{
			return "DISEntityTypeMapping";
		},
		getComponentName: function ()
		{
			return "DIS";
		},
		getContainerField: function ()
		{
			return "mapping";
		},
	});

	return DISEntityTypeMapping;
});


