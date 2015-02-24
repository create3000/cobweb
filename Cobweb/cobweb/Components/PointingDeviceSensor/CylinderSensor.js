
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
		function CylinderSensor (executionContext)
		{
			X3DDragSensorNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .CylinderSensor);
		}

		CylinderSensor .prototype = $.extend (new X3DDragSensorNode (),
		{
			constructor: CylinderSensor,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",           new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "enabled",            new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "description",        new SFString ("")),
				new X3DFieldDefinition (X3DConstants .inputOutput, "axisRotation",       new SFRotation (0, 0, 1, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "diskAngle",          new SFFloat (0.261799)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "minAngle",           new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "maxAngle",           new SFFloat (-1)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "offset",             new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "autoOffset",         new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "trackPoint_changed", new SFVec3f ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "rotation_changed",   new SFRotation ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "isOver",             new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "isActive",           new SFBool ()),
			]),
			getTypeName: function ()
			{
				return "CylinderSensor";
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

		return CylinderSensor;
	}
});

