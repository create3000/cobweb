
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Shape/X3DShapeNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DShapeNode, 
          X3DConstants)
{
	with (Fields)
	{
		function Shape (executionContext)
		{
			X3DShapeNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .Shape);
		}

		Shape .prototype = $.extend (new X3DShapeNode (),
		{
			constructor: Shape,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",   new SFNode ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxSize",   new SFVec3f (-1, -1, -1)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxCenter", new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "appearance", new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "geometry",   new SFNode ()),
			]),
			getTypeName: function ()
			{
				return "Shape";
			},
			getComponentName: function ()
			{
				return "Shape";
			},
			getContainerField: function ()
			{
				return "children";
			},
		});

		return Shape;
	}
});

