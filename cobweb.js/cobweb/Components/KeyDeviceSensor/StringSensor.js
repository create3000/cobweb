
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/KeyDeviceSensor/X3DKeyDeviceSensorNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DKeyDeviceSensorNode, 
          X3DConstants)
{
	with (Fields)
	{
		function StringSensor (executionContext)
		{
			X3DKeyDeviceSensorNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .StringSensor);
		}

		StringSensor .prototype = $.extend (Object .create (X3DKeyDeviceSensorNode .prototype),
		{
			constructor: StringSensor,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",        new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "enabled",         new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "deletionAllowed", new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "enteredText",     new SFString ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "finalText",       new SFString ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "isActive",        new SFBool ()),
			]),
			getTypeName: function ()
			{
				return "StringSensor";
			},
			getComponentName: function ()
			{
				return "KeyDeviceSensor";
			},
			getContainerField: function ()
			{
				return "children";
			},
		});

		return StringSensor;
	}
});

