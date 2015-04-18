
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Texturing/X3DTexture2DNode",
	"cobweb/Components/Networking/X3DUrlObject",
	"cobweb/Bits/X3DConstants",
	"standard/Networking/URI",
	"standard/Math/Algorithm",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DTexture2DNode, 
          X3DUrlObject, 
          X3DConstants,
          URI,
          Algorithm)
{
	with (Fields)
	{
		function ImageTexture (executionContext)
		{
			X3DTexture2DNode .call (this, executionContext .getBrowser (), executionContext);
			X3DUrlObject     .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .ImageTexture);

			this .urlStack = new MFString ();
		}

		ImageTexture .prototype = $.extend (new X3DTexture2DNode (),
			X3DUrlObject .prototype,
		{
			constructor: ImageTexture,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",          new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "url",               new MFString ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "repeatS",           new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "repeatT",           new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "textureProperties", new SFNode ()),
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

				var URL = new URI (this .urlStack .shift ());

				URL = this .getExecutionContext () .getWorldURL () .transform (URL);
				// In Firefox we don't need getRelativePath if file scheme, do we in Chrome???

				// Create Image

				var image = $("<img>");
				image .load (this .setImage .bind (this, image [0]));
				image .error (this .setError .bind (this, URL));
				image .attr ("crossOrigin", "anonymous");
				image .attr ("src", URL);
			},
			setError: function (URL)
			{
				this .getBrowser () .println ("Error loading image URL '" + URL + "'.");
				this .loadNext ();
			},
			setImage: function (image)
			{
				try
				{
					var
						width  = image .width,
						height = image .height;

					var
						canvas = $("<canvas>") [0],
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
					this .setError (image .src);
				}
			},
		});

		return ImageTexture;
	}
});

// https://github.com/toji/texture-tester/blob/master/js/webgl-texture-util.js
