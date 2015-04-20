
define ([
	"jquery",
	"cobweb/Components/Texturing/X3DTextureNode",
	"cobweb/Bits/X3DCast",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DTextureNode,
          X3DCast,
          X3DConstants)
{
	function X3DTexture2DNode (browser, executionContext)
	{
		X3DTextureNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DTexture2DNode);
			
		this .width  = 0;
		this .height = 0;
	}

	X3DTexture2DNode .prototype = $.extend (Object .create (X3DTextureNode .prototype),
	{
		constructor: X3DTexture2DNode,
		initialize: function ()
		{
			X3DTextureNode .prototype .initialize .call (this);
			
			this .repeatS_           .addInterest (this, "updateTextureProperties");
			this .repeatT_           .addInterest (this, "updateTextureProperties");
			this .textureProperties_ .addInterest (this, "set_textureProperties__");

			this .set_textureProperties__ ();
		},
		set_textureProperties__: function ()
		{
			if (this .texturePropertiesNode)
				this .texturePropertiesNode .removeInterest (this, "updateTextureProperties");

			this .texturePropertiesNode = X3DCast (X3DConstants .TextureProperties, this .textureProperties_);

			if (! this .texturePropertiesNode)
				this .texturePropertiesNode = this .getBrowser () .getDefaultTextureProperties ();

			this .texturePropertiesNode .addInterest (this, "updateTextureProperties");

			this .updateTextureProperties ();
		},
		getWidth: function ()
		{
			return this .width;
		},
		getHeight: function ()
		{
			return this .height;
		},
		setTexture: function (width, height, transparent, data, flip)
		{
			this .transparent_ = transparent;
			this .width        = width;
			this .height       = height;

			var gl = this .getBrowser () .getContext ();

			gl .pixelStorei (gl .UNPACK_FLIP_Y_WEBGL, flip);
			gl .pixelStorei (gl .UNPACK_ALIGNMENT, 1);
			gl .bindTexture (gl .TEXTURE_2D, this .getTexture ());
			gl .texImage2D  (gl .TEXTURE_2D, 0, gl .RGBA, width, height, 0, gl .RGBA, gl .UNSIGNED_BYTE, data);
			gl .bindTexture (gl .TEXTURE_2D, null);

			this .updateTextureProperties ();

			this .getBrowser () .addBrowserEvent ();
		},
		updateTextureProperties: function ()
		{
			var gl = this .getBrowser () .getContext ();

			X3DTextureNode .prototype .updateTextureProperties .call (this,
			                                                          gl .TEXTURE_2D,
			                                                          this .textureProperties_ .getValue (),
			                                                          this .texturePropertiesNode,
			                                                          this .width,
			                                                          this .height,
			                                                          this .repeatS_ .getValue (),
			                                                          this .repeatT_ .getValue (),
			                                                          false);
		},
		clear: function ()
		{
			this .setTexture (1, 1, false, new Uint8Array ([ 255, 255, 255, 255 ]), false);
		},
		traverse: function ()
		{
			var gl = this .getBrowser () .getContext ();

			gl .activeTexture (gl .TEXTURE0);
			gl .bindTexture (gl .TEXTURE_2D, this .texture);
		},
	});

	return X3DTexture2DNode;
});

