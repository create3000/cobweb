
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Components/Texturing/X3DTextureNode",
	"cobweb/Bits/X3DCast",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DTextureNode,
          X3DCast,
          X3DConstants)
{
"use strict";

	function X3DTexture2DNode (executionContext)
	{
		X3DTextureNode .call (this, executionContext);

		this .addType (X3DConstants .X3DTexture2DNode);

		this .width  = 0;
		this .height = 0;
		this .flipY  = false;
		this .data   = null;
	}

	X3DTexture2DNode .prototype = $.extend (Object .create (X3DTextureNode .prototype),
	{
		constructor: X3DTexture2DNode,
		initialize: function ()
		{
			X3DTextureNode .prototype .initialize .call (this);
			
			var gl = this .getBrowser () .getContext ();
			
			this .target = gl .TEXTURE_2D;

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
		getTarget: function ()
		{
			return this .target;
		},
		getWidth: function ()
		{
			return this .width;
		},
		getHeight: function ()
		{
			return this .height;
		},
		getFlipY: function ()
		{
			return this .flipY;
		},
		getData: function ()
		{
			return this .data;
		},
		setTexture: function (width, height, transparent, data, flipY)
		{
			this .transparent_ = transparent;
			this .width        = width;
			this .height       = height;
			this .flipY        = flipY;
			this .data         = data;

			var gl = this .getBrowser () .getContext ();

			gl .pixelStorei (gl .UNPACK_FLIP_Y_WEBGL, flipY);
			gl .pixelStorei (gl .UNPACK_ALIGNMENT, 1);
			gl .bindTexture (gl .TEXTURE_2D, this .getTexture ());
			gl .texImage2D  (gl .TEXTURE_2D, 0, gl .RGBA, width, height, 0, gl .RGBA, gl .UNSIGNED_BYTE, data);
			gl .bindTexture (gl .TEXTURE_2D, null);

			this .updateTextureProperties ();
		},
		updateTexture: function (data)
		{
			this .data = data;

			var gl = this .getBrowser () .getContext ();

			gl .bindTexture (gl .TEXTURE_2D, this .getTexture ());
			gl .texSubImage2D (gl .TEXTURE_2D, 0, 0, 0, gl .RGBA, gl .UNSIGNED_BYTE, data);

			if (this .texturePropertiesNode .generateMipMaps_ .getValue ())
				gl .generateMipmap (gl .TEXTURE_2D);

			gl .bindTexture (gl .TEXTURE_2D, null);
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
		resize: function (input, inputWidth, inputHeight, outputWidth, outputHeight)
		{
		   // Nearest neighbor scaling algorithm for very small images.

			var
				output = new Uint8Array (outputWidth * outputHeight * 4),
				scaleX = outputWidth / inputWidth,
				scaleY = outputHeight / inputHeight;

			for (var y = 0; y < outputHeight; ++ y)
			{
				var
					inputW  = Math .floor (y / scaleY) * inputWidth,
					outputW = y * outputWidth;

				for (var x = 0; x < outputWidth; ++ x)
				{
					var
						index       = (inputW + Math.floor (x / scaleX)) * 4,
						indexScaled = (outputW + x) * 4;

					output [indexScaled]     = input [index];
					output [indexScaled + 1] = input [index + 1];
					output [indexScaled + 2] = input [index + 2];
					output [indexScaled + 3] = input [index + 3];
				}
			}

			return output;
		},
		traverse: function (gl, shader, i)
		{
			shader .textureTypeArray [i] = 2;
			gl .activeTexture (gl .TEXTURE0);
			gl .bindTexture (gl .TEXTURE_2D, this .getTexture ());
			gl .uniform1iv (shader .textureType, shader .textureTypeArray);
		},
	});

	return X3DTexture2DNode;
});


