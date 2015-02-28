
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Core/X3DSensorNode",
	"cobweb/Components/Time/X3DTimeDependentNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DSensorNode, 
          X3DTimeDependentNode, 
          X3DConstants)
{
	with (Fields)
	{
		function TimeSensor (executionContext)
		{
			X3DSensorNode .call (this, executionContext .getBrowser (), executionContext);
			X3DTimeDependentNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .TimeSensor);
		}

		TimeSensor .prototype = $.extend (new X3DSensorNode (),new X3DTimeDependentNode (),
		{
			constructor: TimeSensor,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",         new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "enabled",          new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "cycleInterval",    new SFTime (1)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "loop",             new SFBool (false)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "startTime",        new SFTime ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "pauseTime",        new SFTime ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "resumeTime",       new SFTime ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "stopTime",         new SFTime ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "isPaused",         new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "isActive",         new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "cycleTime",        new SFTime ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "elapsedTime",      new SFTime ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "fraction_changed", new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "time",             new SFTime ()),
			]),
			getTypeName: function ()
			{
				return "TimeSensor";
			},
			getComponentName: function ()
			{
				return "Time";
			},
			getContainerField: function ()
			{
				return "children";
			},
		});

		return TimeSensor;
	}
});

