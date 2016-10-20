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


define ([
	"cobweb/Fields",
	"cobweb/Components/Networking/LoadSensor",
	"cobweb/Browser/Networking/urls",
	"standard/Networking/URI",
	"lib/sprintf.js/src/sprintf",
	"lib/gettext",
],
function (Fields,
          LoadSensor,
          urls,
          URI,
          sprintf,
          _)
{
"use strict";
	
	var loadCountId = 0;

	function X3DNetworkingContext ()
	{
		this .cache = this .getElement () [0] .getAttribute ("cache") != "false";

		this .addChildObjects ("loadCount", new Fields .SFInt32 ());

		this .loadSensor     = new LoadSensor (this);
		this .loadingTotal   = 0;
		this .loadingObjects = { };
		this .location       = new URI (this .getElement () [0] .baseURI);
		this .defaultScene   = this .createScene ();
		this .privateScene   = this .createScene ();
		this .browserLoading = false;
	}

	X3DNetworkingContext .prototype =
	{
		initialize: function ()
		{
			this .loadSensor .setup ();

			this .defaultScene .setup ();
			this .defaultScene .setLive (true);

			this .privateScene .setPrivate (true);
			this .privateScene .setup ();
			this .privateScene .setLive (true);
		},
		getProviderUrl: function ()
		{
			return urls .providerUrl;
		},
		doCaching: function ()
		{
		   return this .cache;
		},
		getLocation: function ()
		{
			return this .location;
		},
		getDefaultScene: function ()
		{
			return this .defaultScene;
		},
		getPrivateScene: function ()
		{
			return this .privateScene;
		},
		getLoadSensor: function ()
		{
			return this .loadSensor;
		},
		setBrowserLoading: function (value)
		{
			this .browserLoading = value;

			if (value)
			{
				this .resetLoadCount ();
				this .getCanvas ()         .stop (true, true) .animate ({ "delay": 1 }, 1) .fadeOut (0);
				this .getLoadingElement () .stop (true, true) .animate ({ "delay": 1 }, 1) .fadeIn (0);
			}
			else
			{
				this .getLoadingElement () .stop (true, true) .fadeOut (2000);
				this .getCanvas ()         .stop (true, true) .fadeIn (2000);
			}
		},
		addLoadCount: function (object)
		{
		   var id = loadCountId ++;

			++ this .loadingTotal;
		   this .loadingObjects [id] = true;
			
			this .setLoadCount (this .loadCount_ = this .loadCount_ .getValue () + 1);
			this .setCursor ("DEFAULT");

			return id;
		},
		removeLoadCount: function (id)
		{
		   if (! this .loadingObjects .hasOwnProperty (id))
		      return;
		   
			delete this .loadingObjects [id];

			this .setLoadCount (this .loadCount_ = this .loadCount_ .getValue () - 1);
		},
		setLoadCount: function (value)
		{
			if (value)
				var string = sprintf .sprintf (value == 1 ? _ ("Loading %d file") : _ ("Loading %d files"), value);
			
			else
			{
				var string = _("Loading done");
				this .setCursor ("DEFAULT");
			}

			if (! this .browserLoading)
				this .getNotification () .string_ = string;

			this .getLoadingElement () .find (".cobweb-spinner-text") .text (string);

			this .getLoadingElement () .find (".cobweb-progressbar div") .css ("width", ((this .loadingTotal - value) * 100 / this .loadingTotal) + "%");
		},
		resetLoadCount: function ()
		{
			this .loadCount_     = 0;
			this .loadingTotal   = 0;
			this .loadingObjects = { };			   
		},
	};

	return X3DNetworkingContext;
});
