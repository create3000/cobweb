
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Grouping/X3DTransformNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DTransformNode, 
          X3DConstants)
{
	with (Fields)
	{
		function Transform (executionContext)
		{
			X3DTransformNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .Transform);
		}

		Transform .prototype = $.extend (new X3DTransformNode (),
		{
			constructor: Transform,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",         new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "translation",      new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "rotation",         new SFRotation (0, 0, 1, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "scale",            new SFVec3f (1, 1, 1)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "scaleOrientation", new SFRotation (0, 0, 1, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "center",           new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxSize",         new SFVec3f (-1, -1, -1)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxCenter",       new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "addChildren",      new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "removeChildren",   new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "children",         new MFNode ()),
			]),
			getTypeName: function ()
			{
				return "Transform";
			},
			getComponentName: function ()
			{
				return "Grouping";
			},
			getContainerField: function ()
			{
				return "children";
			},
		});

		return Transform;
	}
});

