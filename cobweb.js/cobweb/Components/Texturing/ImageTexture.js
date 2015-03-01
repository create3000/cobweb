
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Texturing/X3DTexture2DNode",
	"cobweb/Components/Networking/X3DUrlObject",
	"cobweb/Bits/X3DConstants",
	"standard/Networking/URI",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DTexture2DNode, 
          X3DUrlObject, 
          X3DConstants,
          URI)
{
	with (Fields)
	{
		function ImageTexture (executionContext)
		{
			X3DTexture2DNode .call (this, executionContext .getBrowser (), executionContext);
			X3DUrlObject     .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .ImageTexture);

			this .urlStack    = null;
			this .transparent = false;
			this .components  = 0;
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

				var gl = this .getBrowser () .getContext ();

				this .texture = gl .createTexture ();
				
				this .requestAsyncLoad ();
			},
			
			requestAsyncLoad: function ()
			{
				this .urlStack = undefined;
				this .loadNext ();
			},
			loadNext: function ()
			{
				if (! this .urlStack)
					this .urlStack = this .url_ .copy ();

				if (this .urlStack .length === 0)
				{
					this .urlStack = null;
					return;
				}

				// Get URL.

				var URL = new URI (this .urlStack .shift ());

				URL = this .getExecutionContext () .getWorldURL () .transform (URL);

				if (URL .isLocal ())
					URL = new URI (window .location) .getRelativePath (URL);

				// Create Image

				var image = new Image ();
				image .onload  = this .processImage .bind (this, image);
				image .onerror = this .setError .bind (this, URL);
				image .src     = URL;
			},
			setError: function (URL)
			{
				this .getBrowser () .println ("Error loading image URL '" + URL + "'.");
				this .loadNext ();
			},
			processImage: function (image)
			{
				var canvas = $("<canvas>") [0];
				
				canvas .width  = image .width;
				canvas .height = image .height;
				
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

				setTimeout (this .setImage .bind (this, image, components), 0);
			},
			setImage: function (image, components)
			{
				this .urlStack    = null;
				this .transparent = components && !(components % 2);
				this .comonents   = components;

				var gl = this .getBrowser () .getContext ();

				gl .pixelStorei (gl .UNPACK_FLIP_Y_WEBGL, true);
				gl .bindTexture    (gl .TEXTURE_2D, this .texture);
				gl .texImage2D     (gl .TEXTURE_2D, 0, gl .RGBA, gl .RGBA, gl .UNSIGNED_BYTE, image);
				gl .texParameteri  (gl .TEXTURE_2D, gl .TEXTURE_MAG_FILTER, gl .LINEAR);
				gl .texParameteri  (gl .TEXTURE_2D, gl .TEXTURE_MIN_FILTER, gl .LINEAR_MIPMAP_NEAREST);
				gl .generateMipmap (gl .TEXTURE_2D);
				gl .bindTexture    (gl .TEXTURE_2D, null);
 			},
 			isTransparent: function ()
 			{
				return this .transparent;
 			},
 			getComponents: function ()
 			{
				return this .components;
 			},
 			traverse: function ()
 			{
 			   var browser = this .getBrowser ();
				var gl      = browser .getContext ();
 
				gl .activeTexture (gl .TEXTURE0);
				gl .bindTexture (gl .TEXTURE_2D, this .texture);

				browser .setTexture (this);
 			},
		});

		return ImageTexture;
	}
});

// https://github.com/toji/texture-tester/blob/master/js/webgl-texture-util.js
