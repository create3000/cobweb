
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Texturing/X3DTexture2DNode",
	"cobweb/Components/Sound/X3DSoundSourceNode",
	"cobweb/Components/Networking/X3DUrlObject",
	"cobweb/Bits/X3DConstants",
	"standard/Networking/URI",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DTexture2DNode, 
          X3DSoundSourceNode, 
          X3DUrlObject, 
          X3DConstants,
          URI)
{
	with (Fields)
	{
		function MovieTexture (executionContext)
		{
			X3DTexture2DNode   .call (this, executionContext .getBrowser (), executionContext);
			X3DSoundSourceNode .call (this, executionContext .getBrowser (), executionContext);
			X3DUrlObject       .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .MovieTexture);

			this .urlStack = new MFString ();
		}

		MovieTexture .prototype = $.extend (Object .create (X3DTexture2DNode .prototype),
			X3DSoundSourceNode .prototype,
			X3DUrlObject .prototype,
		{
			constructor: MovieTexture,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",          new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "enabled",           new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "description",       new SFString ("")),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "url",               new MFString ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "speed",             new SFFloat (1)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "pitch",             new SFFloat (1)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "loop",              new SFBool ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "startTime",         new SFTime ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "pauseTime",         new SFTime ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "resumeTime",        new SFTime ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "stopTime",          new SFTime ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "isPaused",          new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "isActive",          new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "cycleTime",         new SFTime ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "elapsedTime",       new SFTime ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "duration_changed",  new SFTime (-1)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "repeatS",           new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "repeatT",           new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "textureProperties", new SFNode ()),
			]),
			getTypeName: function ()
			{
				return "MovieTexture";
			},
			getComponentName: function ()
			{
				return "Texturing";
			},
			getContainerField: function ()
			{
				return "texture";
			},
			initialize: function ()
			{
				X3DTexture2DNode   .prototype .initialize .call (this);
				X3DSoundSourceNode .prototype .initialize .call (this);
				X3DUrlObject       .prototype .initialize .call (this);

				this .url_ .addInterest (this, "set_url__");

				this .canvas = $("<canvas>");

				this .video = $("<video>");
				this .video .error (this .setError .bind (this));
				this .video .bind ("abort", this .setError .bind (this));
				this .video .attr ("preload", "auto");
				this .video .attr ("volume", 0);
				this .video .attr ("crossOrigin", "anonymous");

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
				this .video .bind ("canplaythrough", this .setVideo .bind (this));
				this .loadNext ();
			},
			loadNext: function ()
			{
				if (this .urlStack .length === 0)
				{
				   this .duration_changed_ = -1;
					this .clear (); // clearTexture
					this .setLoadState (X3DConstants .FAILED_STATE);
					return;
				}

				// Get URL.

				this .URL = new URI (this .urlStack .shift ());
				this .URL = this .getExecutionContext () .getWorldURL () .transform (this .URL);
				// In Firefox we don't need getRelativePath if there is a file scheme, do we in Chrome???
	
				this .video .attr ("src", this .URL);
			},
			setError: function ()
			{
				console .warn ("Error loading movie:", this .URL .toString ());
				this .loadNext ();
			},
			setVideo: function ()
			{
			   var video = this .video [0];
	
				try
				{
					var
						width  = video .videoWidth,
						height = video .videoHeight,
						canvas = this .canvas [0],
						cx     = canvas .getContext ("2d");

					canvas .width  = width;
					canvas .height = height;

					cx .drawImage (video, 0, 0);

					var data = cx .getImageData (0, 0, width, height) .data;

					setTimeout (function ()
					{
					   this .video .unbind ("canplaythrough");
					   this .setMedia (this .video);
						this .setTexture (width, height, false, new Uint8Array (data), true);
						this .setLoadState (X3DConstants .COMPLETE_STATE);
					}
					.bind (this), 16);
				}
				catch (error)
				{
					// Catch security error from cross origin requests.
					console .log (error .message);
					this .setError ();
				}
			},
			prepareEvents: function ()
			{
			   X3DSoundSourceNode .prototype .prepareEvents .call (this);

			   var video = this .getMedia ();

				if (video)
					this .updateTexture (video [0]);
			},
			traverse: X3DTexture2DNode .prototype .traverse,
		});

		return MovieTexture;
	}
});

