/* -*- Mode: JavaScript; coding: utf-8; tab-width: 3; indent-tabs-mode: tab; c-basic-offset: 3 -*-
 *******************************************************************************
 *
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * Copyright create3000, Scheffelstraße 31a, Leipzig, Germany 2011.
 *
 * All rights reserved. Holger Seelig <holger.seelig@yahoo.de>.
 *
 * The copyright notice above does not evidence any actual of intended
 * publication of such source code, and is an unpublished work by create3000.
 * This material contains CONFIDENTIAL INFORMATION that is the property of
 * create3000.
 *
 * No permission is granted to copy, distribute, or create derivative works from
 * the contents of this software, in whole or in part, without the prior written
 * permission of create3000.
 *
 * NON-MILITARY USE ONLY
 *
 * All create3000 software are effectively free software with a non-military use
 * restriction. It is free. Well commented source is provided. You may reuse the
 * source in any way you please with the exception anything that uses it must be
 * marked to indicate is contains 'non-military use only' components.
 *
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * Copyright 2015, 2016 Holger Seelig <holger.seelig@yahoo.de>.
 *
 * This file is part of the Cobweb Project.
 *
 * Cobweb is free software: you can redistribute it and/or modify it under the
 * terms of the GNU General Public License version 3 only, as published by the
 * Free Software Foundation.
 *
 * Cobweb is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU General Public License version 3 for more
 * details (a copy is included in the LICENSE file that accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version 3
 * along with Cobweb.  If not, see <http://www.gnu.org/licenses/gpl.html> for a
 * copy of the GPLv3 License.
 *
 * For Silvio, Joy and Adi.
 *
 ******************************************************************************/


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

		this .lastBuffer = gl .getParameter (gl .FRAMEBUFFER_BINDING);
		this .buffer     = gl .createFramebuffer ();

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

		// The depth buffer

		var depthBuffer = gl .createRenderbuffer ();

		gl .bindRenderbuffer (gl .RENDERBUFFER, depthBuffer);
		gl .renderbufferStorage (gl .RENDERBUFFER, gl .DEPTH_COMPONENT16, width, height);
		gl .framebufferRenderbuffer (gl .FRAMEBUFFER, gl .DEPTH_ATTACHMENT, gl .RENDERBUFFER, depthBuffer);

		// Always check that our framebuffer is ok

		if (gl .checkFramebufferStatus (gl .FRAMEBUFFER) !== gl .FRAMEBUFFER_COMPLETE)
			throw new Error ("Couldn't create frame buffer.");

		gl .bindFramebuffer (gl .FRAMEBUFFER, this .lastBuffer);
	}

	DepthBuffer .prototype =
	{
		constructor: DepthBuffer,
		getWidth: function ()
		{
			return this .width;
		},
		getHeight: function ()
		{
			return this .height;
		},
		getDepthTexture: function ()
		{
			return this .depthTexture;
		},
		getDistance: function (radius, zNear, zFar)
		{
			var
				gl       = this .browser .getContext (),
				array    = this .array,
				distance = Number .POSITIVE_INFINITY,
				w1       = 2 / (this .width  - 1),
				h1       = 2 / (this .height - 1),
				zWidth   = zFar - zNear;

			gl .readPixels (0, 0, this .width, this .height, gl .RGBA, gl .UNSIGNED_BYTE, array);

			for (var py = 0, i = 0; py < this .height; ++ py)
			{
				var y2 = Math .pow ((py * h1 - 1) * radius, 2);

			   for (var px = 0; px < this .width; ++ px, i += 4)
			   {
				   var
				      x = (px * w1 - 1) * radius,
				      z = zNear + zWidth * (array [i] / 255 + array [i + 1] / 65025 + array [i + 2] / 16581375 + array [i + 3] / 4228250625);

					distance = Math .min (distance, Math .sqrt (x * x + y2 + z * z));
			   }
			}

			return distance;
		},
		bind: function ()
		{
			var gl = this .browser .getContext ();

			this .lastBuffer = gl .getParameter (gl .FRAMEBUFFER_BINDING);

			gl .bindFramebuffer (gl .FRAMEBUFFER, this .buffer);
		},
		unbind: function ()
		{
			var gl = this .browser .getContext ();
			gl .bindFramebuffer (gl .FRAMEBUFFER, this .lastBuffer);
		},
	};

	return DepthBuffer;
});
