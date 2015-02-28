
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Sound/X3DSoundSourceNode",
	"cobweb/Components/Networking/X3DUrlObject",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DSoundSourceNode, 
          X3DUrlObject, 
          X3DConstants)
{
	with (Fields)
	{
		function AudioClip (executionContext)
		{
			X3DSoundSourceNode .call (this, executionContext .getBrowser (), executionContext);
			X3DUrlObject .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .AudioClip);
		}

		AudioClip .prototype = $.extend (new X3DSoundSourceNode (),new X3DUrlObject (),
		{
			constructor: AudioClip,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",         new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "enabled",          new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "description",      new SFString ("")),
				new X3DFieldDefinition (X3DConstants .inputOutput, "url",              new MFString ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "speed",            new SFFloat (1)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "pitch",            new SFFloat (1)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "loop",             new SFBool (false)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "startTime",        new SFTime ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "pauseTime",        new SFTime ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "resumeTime",       new SFTime ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "stopTime",         new SFTime ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "isPaused",         new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "isActive",         new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "cycleTime",        new SFTime ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "elapsedTime",      new SFTime ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "duration_changed", new SFTime ()),
			]),
			getTypeName: function ()
			{
				return "AudioClip";
			},
			getComponentName: function ()
			{
				return "Sound";
			},
			getContainerField: function ()
			{
				return "source";
			},
		});

		return AudioClip;
	}
});

