
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Sound/X3DSoundSourceNode",
	"cobweb/Components/Networking/X3DUrlObject",
	"cobweb/Bits/X3DConstants",
	"cobweb/Browser/Networking/urls",
	"standard/Networking/URI",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DSoundSourceNode, 
          X3DUrlObject, 
          X3DConstants,
          urls,
          URI)
{
"use strict";

	function AudioClip (executionContext)
	{
		X3DSoundSourceNode .call (this, executionContext);
		X3DUrlObject       .call (this, executionContext);

		this .addType (X3DConstants .AudioClip);

		this .urlStack = new Fields .MFString ();
	}

	AudioClip .prototype = $.extend (Object .create (X3DSoundSourceNode .prototype),
		X3DUrlObject .prototype,
	{
		constructor: AudioClip,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",         new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "enabled",          new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "description",      new Fields .SFString ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "url",              new Fields .MFString ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "speed",            new Fields .SFFloat (1)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "pitch",            new Fields .SFFloat (1)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "loop",             new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "startTime",        new Fields .SFTime ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "resumeTime",       new Fields .SFTime ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "pauseTime",        new Fields .SFTime ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "stopTime",         new Fields .SFTime ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "isPaused",         new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "isActive",         new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "cycleTime",        new Fields .SFTime ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "elapsedTime",      new Fields .SFTime ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "duration_changed", new Fields .SFTime (-1)),
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
			this .URL = this .getExecutionContext () .getURL () .transform (this .URL);
			// In Firefox we don't need getRelativePath if there is a file scheme, do we in Chrome???
	
			this .audio .attr ("src", this .URL);
		},
		setError: function ()
		{
			var URL = this .URL .toString ();

			if (! this .URL .isLocal ())
			{
				if (! URL .match (urls .fallbackRx))
					this .urlStack .unshift (urls .fallback + URL);
			}

			if (this .URL .scheme !== "data")
				console .warn ("Error loading audio:", this .URL .toString ());

			this .loadNext ();
		},
		setAudio: function ()
		{
		   // Everything is fine.
			if (this .URL .scheme !== "data")
				console .info ("Done loading audio:", this .URL .toString ());
			
			this .audio .unbind ("canplaythrough");
			this .setMedia (this .audio);
			this .setLoadState (X3DConstants .COMPLETE_STATE);
		},
	});

	return AudioClip;
});


