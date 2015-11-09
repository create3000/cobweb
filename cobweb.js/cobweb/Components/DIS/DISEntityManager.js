
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Core/X3DChildNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DChildNode, 
          X3DConstants)
{
"use strict";

	function DISEntityManager (executionContext)
	{
		X3DChildNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .DISEntityManager);
	}

	DISEntityManager .prototype = $.extend (Object .create (X3DChildNode .prototype),
	{
		constructor: DISEntityManager,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",        new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "address",         new Fields .SFString ("localhost")),
			new X3DFieldDefinition (X3DConstants .inputOutput, "applicationID",   new Fields .SFInt32 (1)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "mapping",         new Fields .MFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "port",            new Fields .SFInt32 ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "siteID",          new Fields .SFInt32 ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "addedEntities",   new Fields .MFNode ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "removedEntities", new Fields .MFNode ()),
		]),
		getTypeName: function ()
		{
			return "DISEntityManager";
		},
		getComponentName: function ()
		{
			return "DIS";
		},
		getContainerField: function ()
		{
			return "children";
		},
	});

	return DISEntityManager;
});


