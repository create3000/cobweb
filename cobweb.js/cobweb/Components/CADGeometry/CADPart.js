
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Grouping/X3DTransformNode",
	"cobweb/Components/CADGeometry/X3DProductStructureChildNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DTransformNode, 
          X3DProductStructureChildNode, 
          X3DConstants)
{
	with (Fields)
	{
		function CADPart (executionContext)
		{
			X3DTransformNode .call (this, executionContext .getBrowser (), executionContext);
			X3DProductStructureChildNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .CADPart);
		}

		CADPart .prototype = $.extend (Object .create (X3DTransformNode .prototype),new X3DProductStructureChildNode (),
		{
			constructor: CADPart,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",         new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "name",             new SFString ("")),
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
				return "CADPart";
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

		return CADPart;
	}
});

