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
	"jquery",
	"../../Fields.js",
	"../../Basic/X3DFieldDefinition.js",
	"../../Basic/FieldDefinitionArray.js",
	"./X3DSoundSourceNode.js",
	"../Networking/X3DUrlObject.js",
	"../../Bits/X3DConstants.js",
	"../../Browser/Networking/urls.js",
	"../../../standard/Networking/URI.js",
	"../../DEBUG.js",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DSoundSourceNode, 
          X3DUrlObject, 
          X3DConstants,
          urls,
          URI,
          DEBUG)
{
"use strict";

	function AudioClip (executionContext)
	{
		X3DSoundSourceNode .call (this, executionContext);
		X3DUrlObject       .call (this, executionContext);

		this .addType (X3DConstants .AudioClip);

		this .urlStack = new Fields .MFString ();
	}

	AudioClip .prototype = $.extend (Object .create (X3DSoundSourceNode .prototype),
		X3DUrlObject .prototype,
	{
		constructor: AudioClip,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",         new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "enabled",          new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "description",      new Fields .SFString ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "url",              new Fields .MFString ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "speed",            new Fields .SFFloat (1)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "pitch",            new Fields .SFFloat (1)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "loop",             new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "startTime",        new Fields .SFTime ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "resumeTime",       new Fields .SFTime ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "pauseTime",        new Fields .SFTime ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "stopTime",         new Fields .SFTime ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "isPaused",         new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "isActive",         new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "cycleTime",        new Fields .SFTime ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "elapsedTime",      new Fields .SFTime ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "duration_changed", new Fields .SFTime (-1)),
		]),
		getTypeName: function ()
		{
			return "AudioClip";
		},
		getComponentName: function ()
		{
			return "Sound";
		},
		getContainerField: function ()
		{
			return "source";
		},
		initialize: function ()
		{
			X3DSoundSourceNode .prototype .initialize .call (this);
			X3DUrlObject       .prototype .initialize .call (this);

			this .url_ .addInterest ("set_url__", this);

			this .audio = $("<audio></audio>");
			this .audio .on ("error", this .setError .bind (this));
			this .audio .bind ("abort", this .setError .bind (this));

			this .audio [0] .preload     = "auto";
			this .audio [0] .volume      = 0;
			this .audio [0] .crossOrigin = "Anonymous";

			this .requestAsyncLoad ();
		},
		set_url__: function ()
		{
			this .setLoadState (X3DConstants .NOT_STARTED_STATE);

			this .requestAsyncLoad ();
		},
		requestAsyncLoad: function ()
		{
			if (this .checkLoadState () === X3DConstants .COMPLETE_STATE || this .checkLoadState () === X3DConstants .IN_PROGRESS_STATE)
				return;

			this .setLoadState (X3DConstants .IN_PROGRESS_STATE);

			this .setMedia (null);
			this .urlStack .setValue (this .url_);
			this .audio .bind ("canplaythrough", this .setAudio .bind (this));
			this .loadNext ();
		},
		loadNext: function ()
		{
			if (this .urlStack .length === 0)
			{
			   this .duration_changed_ = -1;
				this .setLoadState (X3DConstants .FAILED_STATE);
				return;
			}

			// Get URL.

			this .URL = new URI (this .urlStack .shift ());
			this .URL = this .getExecutionContext () .getURL () .transform (this .URL);
			// In Firefox we don't need getRelativePath if there is a file scheme, do we in Chrome???
	
			this .audio .attr ("src", this .URL);
		},
		setError: function ()
		{
			var URL = this .URL .toString ();

			if (DEBUG)
			{
				if (! (this .URL .isLocal () || this .URL .host === "localhost"))
				{
					if (! URL .match (urls .fallbackExpression))
						this .urlStack .unshift (urls .fallbackUrl + URL);
				}
			}

			if (this .URL .scheme !== "data")
				console .warn ("Error loading audio:", this .URL .toString ());

			this .loadNext ();
		},
		setAudio: function ()
		{
			if (DEBUG)
			{
				if (this .URL .scheme !== "data")
					console .info ("Done loading audio:", this .URL .toString ());
			}
			
			this .audio .unbind ("canplaythrough");
			this .setMedia (this .audio);
			this .setLoadState (X3DConstants .COMPLETE_STATE);
		},
	});

	return AudioClip;
});


