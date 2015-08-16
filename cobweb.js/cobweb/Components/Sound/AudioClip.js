
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Sound/X3DSoundSourceNode",
	"cobweb/Components/Networking/X3DUrlObject",
	"cobweb/Bits/X3DConstants",
	"standard/Networking/URI",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DSoundSourceNode, 
          X3DUrlObject, 
          X3DConstants,
          URI)
{
	with (Fields)
	{
		function AudioClip (executionContext)
		{
			X3DSoundSourceNode .call (this, executionContext .getBrowser (), executionContext);
			X3DUrlObject       .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .AudioClip);

			this .urlStack = new MFString ();
		}

		AudioClip .prototype = $.extend (Object .create (X3DSoundSourceNode .prototype),
			X3DUrlObject .prototype,
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
				new X3DFieldDefinition (X3DConstants .outputOnly,  "duration_changed", new SFTime (-1)),
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
			initialize: function ()
			{
				X3DSoundSourceNode .prototype .initialize .call (this);
				X3DUrlObject       .prototype .initialize .call (this);

				this .url_ .addInterest (this, "set_url__");

				this .audio = $("<audio>");
				this .audio .error (this .setError .bind (this));
				this .audio .bind ("abort", this .setError .bind (this));
				this .audio .attr ("preload", "auto");
				this .audio .attr ("volume", 0);
				this .audio .attr ("crossOrigin", "anonymous");

				this .requestAsyncLoad ();
			},
			set_url__: function ()
			{
				this .setLoadState (X3DConstants .NOT_STARTED_STATE);

				this .requestAsyncLoad ();
			},
			requestAsyncLoad: function ()
			{
				if (this .checkLoadState () === X3DConstants .COMPLETE_STATE || this .checkLoadState () === X3DConstants .IN_PROGRESS_STATE)
					return;

				this .setLoadState (X3DConstants .IN_PROGRESS_STATE);

				this .setMedia (null);
				this .urlStack .setValue (this .url_);
				this .audio .bind ("canplaythrough", this .setAudio .bind (this));
				this .loadNext ();
			},
			loadNext: function ()
			{
				if (this .urlStack .length === 0)
				{
				   this .duration_changed_ = -1;
					this .setLoadState (X3DConstants .FAILED_STATE);
					return;
				}

				// Get URL.

				this .URL = new URI (this .urlStack .shift ());
				this .URL = this .getExecutionContext () .getWorldURL () .transform (this .URL);
				// In Firefox we don't need getRelativePath if there is a file scheme, do we in Chrome???
	
				this .audio .attr ("src", this .URL);
			},
			setError: function ()
			{
				console .warn ("Error loading audio:", this .URL .toString ());
				this .loadNext ();
			},
			setAudio: function ()
			{
			   // Everything is fine.
				
				this .audio .unbind ("canplaythrough");
				this .setMedia (this .audio [0]);
				this .setLoadState (X3DConstants .COMPLETE_STATE);
			},
		});

		return AudioClip;
	}
});

