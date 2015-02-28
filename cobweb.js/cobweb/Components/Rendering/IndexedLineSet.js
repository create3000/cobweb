
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Rendering/X3DGeometryNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DGeometryNode, 
          X3DConstants)
{
	with (Fields)
	{
		function IndexedLineSet (executionContext)
		{
			X3DGeometryNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .IndexedLineSet);
		}

		IndexedLineSet .prototype = $.extend (new X3DGeometryNode (),
		{
			constructor: IndexedLineSet,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",       new SFNode ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "colorPerVertex", new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "colorIndex",     new MFInt32 ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "coordIndex",     new MFInt32 ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "attrib",         new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "fogCoord",       new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "color",          new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "coord",          new SFNode ()),
			]),
			getTypeName: function ()
			{
				return "IndexedLineSet";
			},
			getComponentName: function ()
			{
				return "Rendering";
			},
			getContainerField: function ()
			{
				return "geometry";
			},
		});

		return IndexedLineSet;
	}
});

