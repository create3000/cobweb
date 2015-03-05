
define ([
	"jquery",
	"cobweb/Components/Shape/X3DAppearanceChildNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DAppearanceChildNode, 
          X3DConstants)
{
	function X3DTextureNode (browser, executionContext)
	{
		X3DAppearanceChildNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DTextureNode);
	}

	X3DTextureNode .prototype = $.extend (new X3DAppearanceChildNode (),
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

			gl .bindTexture (gl .TEXTURE_2D, this .getTexture ());
			
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
			//gl .texParameterf  (target, gl .TEXTURE_PRIORITY,           textureProperties .texturePriority_);

			gl .bindTexture (gl .TEXTURE_2D, null);
		},
		bind: function (target)
		{
			var browser = this .getBrowser ();
			var gl      = browser .getContext ();

			gl .activeTexture (gl .TEXTURE0);
			gl .bindTexture (target, this .texture);

			browser .setTexture (this);
		},
	});

	return X3DTextureNode;
});

