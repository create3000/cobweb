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
 * Copyright 1999, 2012 Holger Seelig <holger.seelig@yahoo.de>.
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


define ([
	"cobweb/Browser/Core/BrowserOptions",
	"cobweb/Browser/Core/RenderingProperties",
	"cobweb/Browser/Core/Notification",
	"cobweb/Browser/Core/BrowserTimings",
	"cobweb/Browser/Core/ContextMenu",
],
function (BrowserOptions,
          RenderingProperties,
          Notification,
          BrowserTimings,
          ContextMenu)
{
"use strict";
	
	function getContext (canvas)
	{
		var context = canvas .getContext ("webgl") ||
                    canvas .getContext ("experimental-webgl");

		if (context)
			return context;

		throw new Error ("Couldn't create WebGL context.");
	}

	function X3DCoreContext (element)
	{
		this .element = element;

		// Get canvas & context.

		var browser  = $("<div></div>") .addClass ("cobweb-browser") .prependTo (this .element);
		var loading  = $("<div></div>") .addClass ("cobweb-loading")  .appendTo (browser);
		var spinner  = $("<div></div>") .addClass ("cobweb-spinner")  .appendTo (loading);
		var progress = $("<div></div>") .addClass ("cobweb-progress") .appendTo (loading);
		var canvas   = $("<div></div>") .addClass ("cobweb-surface")  .appendTo (browser);

		$("<div></div>") .addClass ("cobweb-spinner-one")   .appendTo (spinner);
		$("<div></div>") .addClass ("cobweb-spinner-two")   .appendTo (spinner);
		$("<div></div>") .addClass ("cobweb-spinner-three") .appendTo (spinner);
		$("<div></div>") .addClass ("cobweb-spinner-text")  .appendTo (progress) .text ("Lade 0 Dateien");
		$("<div></div>") .addClass ("cobweb-progressbar")   .appendTo (progress) .append ($("<div></div>"));

		this .loading = loading;
		this .canvas  = $("<canvas></canvas>") .prependTo (canvas);
		this .context = getContext (this .canvas [0]);

		this .browserOptions      = new BrowserOptions (this);
		this .renderingProperties = new RenderingProperties (this);
		this .notification        = new Notification (this);
		this .browserTimings      = new BrowserTimings (this);
		this .contextMenu         = new ContextMenu (this);
	}

	X3DCoreContext .prototype =
	{
		initialize: function ()
		{
			this .browserOptions      .setup ()
			this .renderingProperties .setup ();
			this .notification        .setup ();
			this .browserTimings      .setup ();
			this .contextMenu         .setup ();
		},
		isStrict: function ()
		{
			return false;
		},
		getElement: function ()
		{
			return this .element;
		},
		getLoadingElement: function ()
		{
			return this .loading;
		},
		getCanvas: function ()
		{
			return this .canvas;
		},
		getContext: function ()
		{
			return this .context;
		},
		getBrowserOptions: function ()
		{
			return this .browserOptions;
		},
		getRenderingProperties: function ()
		{
			return this .renderingProperties;
		},
		getNotification: function ()
		{
			return this .notification;
		},
		getBrowserTimings: function ()
		{
			return this .browserTimings;
		},
	};

	return X3DCoreContext;
});
