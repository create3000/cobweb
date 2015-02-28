
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
	with (Fields)
	{
		function DISEntityManager (executionContext)
		{
			X3DChildNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .DISEntityManager);
		}

		DISEntityManager .prototype = $.extend (new X3DChildNode (),
		{
			constructor: DISEntityManager,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",        new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "address",         new SFString ("localhost")),
				new X3DFieldDefinition (X3DConstants .inputOutput, "applicationID",   new SFInt32 (1)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "mapping",         new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "port",            new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "siteID",          new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "addedEntities",   new MFNode ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "removedEntities", new MFNode ()),
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
	}
});

