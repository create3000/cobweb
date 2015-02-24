
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Grouping/X3DGroupingNode",
	"cobweb/Components/CADGeometry/X3DProductStructureChildNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DGroupingNode, 
          X3DProductStructureChildNode, 
          X3DConstants)
{
	with (Fields)
	{
		function CADAssembly (executionContext)
		{
			X3DGroupingNode .call (this, executionContext .getBrowser (), executionContext);
			X3DProductStructureChildNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .CADAssembly);
		}

		CADAssembly .prototype = $.extend (new X3DGroupingNode (),new X3DProductStructureChildNode (),
		{
			constructor: CADAssembly,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",       new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "name",           new SFString ("")),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxSize",       new SFVec3f (-1, -1, -1)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxCenter",     new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "addChildren",    new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "removeChildren", new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "children",       new MFNode ()),
			]),
			getTypeName: function ()
			{
				return "CADAssembly";
			},
			getComponentName: function ()
			{
				return "CADGeometry";
			},
			getContainerField: function ()
			{
				return "children";
			},
		});

		return CADAssembly;
	}
});

