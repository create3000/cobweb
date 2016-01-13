
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Texturing/X3DTexture2DNode",
	"cobweb/Components/Networking/X3DUrlObject",
	"cobweb/Bits/X3DConstants",
	"cobweb/Browser/Networking/urls",
	"standard/Networking/URI",
	"standard/Math/Algorithm",
	"cobweb/DEBUG",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DTexture2DNode, 
          X3DUrlObject, 
          X3DConstants,
          urls,
          URI,
          Algorithm,
          DEBUG)
{
"use strict";

	function ImageTexture (executionContext)
	{
		X3DTexture2DNode .call (this, executionContext);
		X3DUrlObject     .call (this, executionContext);

		this .addType (X3DConstants .ImageTexture);

		this .urlStack = new Fields .MFString ();
	}

	ImageTexture .prototype = $.extend (Object .create (X3DTexture2DNode .prototype),
		X3DUrlObject .prototype,
	{
		constructor: ImageTexture,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",          new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "url",               new Fields .MFString ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "repeatS",           new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "repeatT",           new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "textureProperties", new Fields .SFNode ()),
		]),
		getTypeName: function ()
		{
			return "ImageTexture";
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
			X3DTexture2DNode .prototype .initialize .call (this);
			X3DUrlObject     .prototype .initialize .call (this);

			this .url_ .addInterest (this, "set_url__");

			this .canvas = $("<canvas>");

			this .image = $("<img>");
			this .image .load (this .setImage .bind (this));
			this .image .error (this .setError .bind (this));
			this .image .bind ("abort", this .setError .bind (this));
			this .image .attr ("crossOrigin", "anonymous");

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

			this .urlStack .setValue (this .url_);
			this .loadNext ();
		},
		loadNext: function ()
		{
			if (this .urlStack .length === 0)
			{
				this .clear ();
				this .setLoadState (X3DConstants .FAILED_STATE);
				return;
			}

			// Get URL.

			this .URL = new URI (this .urlStack .shift ());
			this .URL = this .getExecutionContext () .getURL () .transform (this .URL);
			// In Firefox we don't need getRelativePath if file scheme, do we in Chrome???

			this .image .attr ("src", this .URL);
		},
		setError: function ()
		{
			var URL = this .URL .toString ();

			if (! this .URL .isLocal ())
			{
				if (! URL .match (urls .fallbackExpression))
					this .urlStack .unshift (urls .fallbackUrl + URL);
			}

			if (this .URL .scheme !== "data")
				console .warn ("Error loading image:", this .URL .toString ());

			this .loadNext ();
		},
		setImage: function ()
		{
			if (DEBUG)
			{
				 if (this .URL .scheme !== "data")
			   	console .info ("Done loading image:", this .URL .toString ());
			}

			try
			{
				var
				   image  = this .image [0],
					width  = image .width,
					height = image .height;

				var
					canvas = this .canvas [0],
					cx     = canvas .getContext ("2d");

				// Scale image.

				if (! Algorithm .isPowerOfTwo (width) || ! Algorithm .isPowerOfTwo (height))
				{
					width  = Algorithm .nextPowerOfTwo (width);
					height = Algorithm .nextPowerOfTwo (height);

					canvas .width  = width;
					canvas .height = height;

					cx .drawImage (image, 0, 0, image .width, image .height, 0, 0, width, height);
				}
				else
				{
					canvas .width  = width;
					canvas .height = height;

					cx .drawImage (image, 0, 0);
				}

				// Determine image alpha.

				var
					data   = cx .getImageData (0, 0, width, height) .data,
					opaque = true;

				for (var i = 3; i < data .length; i += 4)
				{
					if (data [i] !== 255)
					{
						opaque = false;
						break;
					}
				}

				setTimeout (function ()
				{
					this .setTexture (width, height, ! opaque, new Uint8Array (data), true);
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
	});

	return ImageTexture;
});

// https://github.com/toji/texture-tester/blob/master/js/webgl-texture-util.js

