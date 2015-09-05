
define (function ()
{
	function DepthBuffer (browser, width, height)
	{
		var gl = browser .getContext ();
	
		if (! gl .getExtension ("WEBGL_depth_texture"))
		{
		}

		this .browser = browser;
		this .width   = width;
		this .height  = height;
		this .array   = new Uint8Array (width * height * 4);

		// The frame buffer.

		this .buffer = gl .createFramebuffer ();

		gl .bindFramebuffer (gl .FRAMEBUFFER, this .buffer);

		// The depth texture

		this .depthTexture = gl .createTexture ();

		gl .bindTexture (gl .TEXTURE_2D, this .depthTexture);
		gl .texParameteri (gl .TEXTURE_2D, gl .TEXTURE_WRAP_S,     gl .CLAMP_TO_EDGE);
		gl .texParameteri (gl .TEXTURE_2D, gl .TEXTURE_WRAP_T,     gl .CLAMP_TO_EDGE);
		gl .texParameteri (gl .TEXTURE_2D, gl .TEXTURE_MIN_FILTER, gl .LINEAR);
		gl .texParameteri (gl .TEXTURE_2D, gl .TEXTURE_MAG_FILTER, gl .LINEAR);
		gl .texImage2D (gl .TEXTURE_2D, 0, gl .RGBA, width, height, 0, gl .RGBA, gl .UNSIGNED_BYTE, null);

		gl .framebufferTexture2D (gl .FRAMEBUFFER, gl .COLOR_ATTACHMENT0, gl .TEXTURE_2D, this .depthTexture, 0);
		gl .bindTexture (gl .TEXTURE_2D, null);

		// The depth buffer

		var depthBuffer = gl .createRenderbuffer ();

		gl .bindRenderbuffer (gl .RENDERBUFFER, depthBuffer);
		gl .renderbufferStorage (gl .RENDERBUFFER, gl .DEPTH_COMPONENT16, width, height);
		gl .framebufferRenderbuffer (gl .FRAMEBUFFER, gl .DEPTH_ATTACHMENT, gl .RENDERBUFFER, depthBuffer);

		// Always check that our framebuffer is ok
		if (gl .checkFramebufferStatus (gl .FRAMEBUFFER) !== gl .FRAMEBUFFER_COMPLETE)
			throw new Error ("Couldn't create frame buffer.");

		gl .bindFramebuffer (gl .FRAMEBUFFER, null);
	}

	function unpack (r, g, b)
	{
		var f = 0;

		f += r / 255;
		f += g / 65025;
		f += b / 16581375;

		return f;
	}

	DepthBuffer .prototype =
	{
		constructor: DepthBuffer,
		getDistance: function (zNear, zFar)
		{
			var gl = this .browser .getContext ();

			gl .readPixels (0, 0, this .width, this .height, gl .RGBA, gl .UNSIGNED_BYTE, this .array);

			var
				array = this .array,
				z     = Number .POSITIVE_INFINITY;

			for (var i = 0; i < array .length; i += 4)
			{
				z = Math .min (z, unpack (array [i], array [i + 1], array [i + 2]));
			}

			var distance = zNear + (zFar - zNear) * z;

			//console .log (distance);

			return distance;
		},
		bind: function ()
		{
			var gl = this .browser .getContext ();

			gl .bindFramebuffer (gl .FRAMEBUFFER, this .buffer);

			gl .viewport (0, 0, this .width, this .height);
			gl .scissor (0, 0, this .width, this .height);
			
			gl .clearColor (1, 0, 0, 0);
			gl .clear (gl .COLOR_BUFFER_BIT | gl .DEPTH_BUFFER_BIT);
		},
		unbind: function ()
		{
			var gl = this .browser .getContext ();
			gl .bindFramebuffer (gl .FRAMEBUFFER, null);
		},
	};

	return DepthBuffer;
});
