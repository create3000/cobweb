
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/PointingDeviceSensor/X3DDragSensorNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DDragSensorNode, 
          X3DConstants)
{
	with (Fields)
	{
		function PlaneSensor (executionContext)
		{
			X3DDragSensorNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .PlaneSensor);
		}

		PlaneSensor .prototype = $.extend (new X3DDragSensorNode (),
		{
			constructor: PlaneSensor,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",            new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "enabled",             new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "description",         new SFString ("")),
				new X3DFieldDefinition (X3DConstants .inputOutput, "axisRotation",        new SFRotation (0, 0, 1, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "autoOffset",          new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "offset",              new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "minPosition",         new SFVec2f (0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "maxPosition",         new SFVec2f (-1, -1)),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "trackPoint_changed",  new SFVec3f ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "translation_changed", new SFVec3f ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "isOver",              new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "isActive",            new SFBool ()),
			]),
			getTypeName: function ()
			{
				return "PlaneSensor";
			},
			getComponentName: function ()
			{
				return "PointingDeviceSensor";
			},
			getContainerField: function ()
			{
				return "children";
			},
		});

		return PlaneSensor;
	}
});

