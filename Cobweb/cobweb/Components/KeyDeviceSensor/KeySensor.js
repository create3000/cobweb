
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
		function KeySensor (executionContext)
		{
			X3DKeyDeviceSensorNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .KeySensor);
		}

		KeySensor .prototype = $.extend (new X3DKeyDeviceSensorNode (),
		{
			constructor: KeySensor,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",         new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "enabled",          new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "controlKey",       new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "shiftKey",         new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "altKey",           new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "actionKeyPress",   new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "actionKeyRelease", new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "keyPress",         new SFString ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "keyRelease",       new SFString ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "isActive",         new SFBool ()),
			]),
			getTypeName: function ()
			{
				return "KeySensor";
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

		return KeySensor;
	}
});

