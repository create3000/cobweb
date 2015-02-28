
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/EnvironmentalSensor/X3DEnvironmentalSensorNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DEnvironmentalSensorNode, 
          X3DConstants)
{
	with (Fields)
	{
		function VisibilitySensor (executionContext)
		{
			X3DEnvironmentalSensorNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .VisibilitySensor);
		}

		VisibilitySensor .prototype = $.extend (new X3DEnvironmentalSensorNode (),
		{
			constructor: VisibilitySensor,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",  new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "enabled",   new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "size",      new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "center",    new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "enterTime", new SFTime ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "exitTime",  new SFTime ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "isActive",  new SFBool ()),
			]),
			getTypeName: function ()
			{
				return "VisibilitySensor";
			},
			getComponentName: function ()
			{
				return "EnvironmentalSensor";
			},
			getContainerField: function ()
			{
				return "children";
			},
		});

		return VisibilitySensor;
	}
});

