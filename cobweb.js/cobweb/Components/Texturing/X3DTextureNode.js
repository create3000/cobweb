
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Components/Shape/X3DAppearanceChildNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DAppearanceChildNode, 
          X3DConstants)
{
	with (Fields)
	{
		function X3DTextureNode (browser, executionContext)
		{
			X3DAppearanceChildNode .call (this, browser, executionContext);

			this .addType (X3DConstants .X3DTextureNode);

			this .addChildren ("transparent", new SFBool (false));
		}

		X3DTextureNode .prototype = $.extend (Object .create (X3DAppearanceChildNode .prototype),
		{
			constructor: X3DTextureNode,
			initialize: function ()
			{
				X3DAppearanceChildNode .prototype .initialize .call (this);

				var gl = this .getBrowser () .getContext ();

				this .texture = gl .createTexture ();
			},
			getTexture: function ()
			{
				return this .texture;
			},
			updateTextureProperties: function (target, haveTextureProperties, textureProperties, width, height, repeatS, repeatT, repeatR)
			{
				var gl = this .getBrowser () .getContext ();

				gl .bindTexture (target, this .getTexture ());

				if (Math .max (width, height) < this .getBrowser () .getMinTextureSize () && ! haveTextureProperties)
				{
					// Dont generate mipmaps.
					gl .texParameteri (target, gl .TEXTURE_MIN_FILTER, gl .NEAREST);
					gl .texParameteri (target, gl .TEXTURE_MAG_FILTER, gl .NEAREST);
				}
				else
				{
					if (textureProperties .generateMipMaps_ .getValue ())
						gl .generateMipmap (gl .TEXTURE_2D);

					gl .texParameteri (target, gl .TEXTURE_MIN_FILTER, gl [textureProperties .getMinificationFilter ()]);
					gl .texParameteri (target, gl .TEXTURE_MAG_FILTER, gl [textureProperties .getMagnificationFilter ()]);
				}

				if (haveTextureProperties)
				{
					gl .texParameteri (target, gl .TEXTURE_WRAP_S, gl [textureProperties .getBoundaryModeS ()]);
					gl .texParameteri (target, gl .TEXTURE_WRAP_T, gl [textureProperties .getBoundaryModeT ()]);
					//gl .texParameteri (target, gl .TEXTURE_WRAP_R, gl [textureProperties .getBoundaryModeR ()]);
				}
				else
				{
					gl .texParameteri (target, gl .TEXTURE_WRAP_S, repeatS ? gl .REPEAT : gl .CLAMP_TO_EDGE);
					gl .texParameteri (target, gl .TEXTURE_WRAP_T, repeatT ? gl .REPEAT : gl .CLAMP_TO_EDGE);
					//gl .texParameteri (target, gl .TEXTURE_WRAP_R, repeatR ? gl .REPEAT : gl .CLAMP);
				}

				//gl .texParameterfv (target, gl .TEXTURE_BORDER_COLOR,       textureProperties .borderColor_ .getValue ());
				//gl .texParameterf  (target, gl .TEXTURE_MAX_ANISOTROPY_EXT, textureProperties .anisotropicDegree_ .getValue ());
				//gl .texParameterf  (target, gl .TEXTURE_PRIORITY,           textureProperties .texturePriority_ .getValue ());

				/*
				// Anisotropic Filtering in WebGL is handled by an extension, use one of getExtension depending on browser:

				var ext = gl .getExtension ("MOZ_EXT_texture_filter_anisotropic");
				var ext = gl .getExtension ("WEBKIT_EXT_texture_filter_anisotropic");
				var ext = gl .getExtension ("EXT_texture_filter_anisotropic");

				if (ext)
					gl .texParameterf (gl .TEXTURE_2D, ext .TEXTURE_MAX_ANISOTROPY_EXT, textureProperties .anisotropicDegree_ .getValue ());
				*/

				gl .bindTexture (target, null);
			},
		});

		return X3DTextureNode;
	}
});

