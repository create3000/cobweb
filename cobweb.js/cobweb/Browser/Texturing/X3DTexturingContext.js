
define ([
	"cobweb/Components/Texturing/TextureProperties",
	"cobweb/Components/Texturing/TextureTransform",
	"cobweb/Components/Texturing/TextureCoordinate",
	"standard/Math/Numbers/Matrix4",
	"standard/Math/Utility/MatrixStack",
],
function (TextureProperties,
          TextureTransform,
          TextureCoordinate,
          Matrix4,
          MatrixStack)
{
"use strict";

	function X3DTexturingContext ()
	{
		this .textureUnits             = [ ];
		this .combinedTextureUnits     = [ ];
		this .textureStages            = 1;
		this .textureTransform         = [ ];
		this .defaultTextureProperties = new TextureProperties (this);
		this .defaultTextureTransform  = new TextureTransform (this);
		this .defaultTextureCoordinate = new TextureCoordinate (this);
	}

	X3DTexturingContext .prototype =
	{
		initialize: function ()
		{
			var gl = this .getBrowser () .getContext ();

			// BrowserOptions
			{
				this .defaultTextureProperties .magnificationFilter_ .setValue ("NICEST");
				this .defaultTextureProperties .minificationFilter_  .setValue ("AVG_PIXEL_AVG_MIPMAP");
				this .defaultTextureProperties .textureCompression_  .setValue ("NICEST");
				this .defaultTextureProperties .generateMipMaps_     .setValue (true);
			}

			this .maxTextureSize          = gl .getParameter (gl .MAX_TEXTURE_SIZE);
			this .maxTextureUnits         = gl .getParameter (gl .MAX_TEXTURE_IMAGE_UNITS);
			this .maxCombinedTextureUnits = gl .getParameter (gl .MAX_COMBINED_TEXTURE_IMAGE_UNITS);

			var
				textureUnits         = this .textureUnits,
				combinedTextureUnits = this .combinedTextureUnits;

			for (var i = this .maxTextureUnits - 1; i >= 0; -- i)
				textureUnits .push (i);

			for (var i = this .maxTextureUnits, length = this .maxCombinedTextureUnits; i < length; ++ i)
				combinedTextureUnits .push (i);

			this .defaultTextureProperties .setup ();
			this .defaultTextureTransform  .setup ();
			this .defaultTextureCoordinate .setup ();
		},
		getMinTextureSize: function ()
		{
			return 16;
		},
		getMaxTextureSize: function ()
		{
			return this .maxTextureSize;
		},
		getMaxTextureUnits: function ()
		{
			return this .maxTextureUnits;
		},
		getMaxCombinedTextureUnits: function ()
		{
			return this .maxCombinedTextureUnits;
		},
		getTextureUnits: function ()
		{
			return this .textureUnits;
		},
		getCombinedTextureUnits: function ()
		{
			return this .combinedTextureUnits;
		},
		getTextureTransform: function ()
		{
			return this .textureTransform;
		},
		getDefaultTextureProperties: function ()
		{
			return this .defaultTextureProperties;
		},
		getDefaultTextureTransform: function ()
		{
			return this .defaultTextureTransform;
		},
		getDefaultTextureCoordinate: function ()
		{
			return this .defaultTextureCoordinate;
		},
	};

	return X3DTexturingContext;
});
