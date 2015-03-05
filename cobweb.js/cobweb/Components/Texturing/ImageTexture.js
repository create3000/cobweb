
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

			this .urlStack = null;
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
				this .urlStack = null;
				this .loadNext ();
			},
			loadNext: function ()
			{
				if (! this .urlStack)
					this .urlStack = this .url_ .copy ();

				if (this .urlStack .length === 0)
				{
					this .urlStack = null;
					this .setTexture (1, 1, 3, new Uint8Array ([ 255, 255, 255, 255 ]));
					return;
				}

				// Get URL.

				var URL = new URI (this .urlStack .shift ());

				URL = this .getExecutionContext () .getWorldURL () .transform (URL);

				// Create Image

				var image = $("<img>");
				image .load (this .setImage .bind (this, image [0]));
				image .error (this .setError .bind (this, URL));
				image .attr ("src", URL);
			},
			setError: function (URL)
			{
				this .getBrowser () .println ("Error loading image URL '" + URL + "'.");
				this .loadNext ();
			},
			setImage: function (image)
			{
				this .urlStack = null;

				var width  = image .width;
				var height = image .height;

				// Determine image components.

				var canvas = $("<canvas>") [0];
	
				canvas .width  = width;
				canvas .height = height;

				var cx = canvas .getContext ("2d");
				cx .drawImage (image, 0, 0);

				var data   = cx .getImageData (0, 0, image .width, image .height) .data;
				var gray   = true;
				var opaque = true;

				for (var i = 0; i < data .length && gray; i += 4)
					gray &= (data [i] === data [i + 1]) && (data [i] === data [i + 2]);

				for (var i = 0; i < data .length && opaque; i += 4)
					opaque &= (data [i + 3] === 255);

				var components = (gray ? 1 : 3) + (opaque ? 0 : 1);

				// Scale image.

				if (! Algorithm .isPowerOfTwo (width) || ! Algorithm .isPowerOfTwo (height))
				{
					width  = Algorithm .nextPowerOfTwo (width);
					height = Algorithm .nextPowerOfTwo (height);

					cx .clearRect (0, 0, canvas .width, canvas .height);

					canvas .width  = width;
					canvas .height = height;

					cx .drawImage (image, 0, 0, image .width, image .height, 0, 0, width, height);
					
					data = cx .getImageData (0, 0, width, height) .data;
				}

				setTimeout (this .setTexture .bind (this, width, height, components, new Uint8Array (data)), 0);
			},
		});

		return ImageTexture;
	}
});

// https://github.com/toji/texture-tester/blob/master/js/webgl-texture-util.js
