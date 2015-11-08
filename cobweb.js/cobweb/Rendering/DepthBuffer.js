
define (function ()
{
"use strict";

	function DepthBuffer (browser, width, height)
	{
		var gl = browser .getContext ();

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

	DepthBuffer .prototype =
	{
		constructor: DepthBuffer,
		getDistance: function (radius, zNear, zFar)
		{
			var gl = this .browser .getContext ();

			gl .readPixels (0, 0, this .width, this .height, gl .RGBA, gl .UNSIGNED_BYTE, this .array);

			var
				array    = this .array,
				distance = Number .POSITIVE_INFINITY,
				w1       = 2 / (this .width  - 1),
				h1       = 2 / (this .height - 1),
				zWidth   = zFar - zNear;

			for (var py = 0, i = 0; py < this .height; ++ py)
			{
				var y2 = Math .pow ((py * h1 - 1) * radius, 2);

			   for (var px = 0; px < this .width; ++ px, i += 4)
			   {
				   var
				      x = (px * w1 - 1) * radius,
				      z = zNear + zWidth * (array [i] / 255 + array [i + 1] / 65025 + array [i + 2] / 16581375);

					distance = Math .min (distance, Math .sqrt (x * x + y2 + z * z));
			   }
			}

			return distance;
		},
		bind: function ()
		{
			var gl = this .browser .getContext ();

			gl .bindFramebuffer (gl .FRAMEBUFFER, this .buffer);

			gl .viewport (0, 0, this .width, this .height);
			gl .scissor  (0, 0, this .width, this .height);

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
