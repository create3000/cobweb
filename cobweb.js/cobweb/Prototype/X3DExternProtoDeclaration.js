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
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Networking/X3DUrlObject",
	"cobweb/Prototype/X3DProtoDeclarationNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DUrlObject,
          X3DProtoDeclarationNode, 
          X3DConstants)
{
"use strict";

	function X3DExternProtoDeclaration (executionContext)
	{
		X3DProtoDeclarationNode .call (this, executionContext);
		X3DUrlObject            .call (this, executionContext);

		this .addType (X3DConstants .X3DExternProtoDeclaration);

		this .addChildObjects ("url", new Fields .MFString ());

		this .deferred = $.Deferred ();
	}

	X3DExternProtoDeclaration .prototype = $.extend (Object .create (X3DProtoDeclarationNode .prototype),
		X3DUrlObject .prototype,
	{
		constructor: X3DExternProtoDeclaration,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata", new Fields .SFNode ()),
		]),
		getTypeName: function ()
		{
			return "EXTERNPROTO";
		},
		getComponentName: function ()
		{
			return "Cobweb";
		},
		getContainerField: function ()
		{
			return "externprotos";
		},
		initialize: function ()
		{
			X3DProtoDeclarationNode .prototype .initialize .call (this);
			X3DUrlObject            .prototype .initialize .call (this);
				
			this .isLive () .addInterest (this, "set_live__");
		},
		set_live__: function ()
		{
			if (this .checkLoadState () === X3DConstants .COMPLETE_STATE)
			{
				this .scene .setLive (this .isLive () .getValue ());
			}
		},
		setProtoDeclaration: function (value)
		{
			this .proto = value;
		},
		getProtoDeclaration: function ()
		{
			return this .proto;
		},
		requestAsyncLoad: function (callback)
		{
			this .deferred .done (callback);

			if (this .checkLoadState () === X3DConstants .COMPLETE_STATE || this .checkLoadState () === X3DConstants .IN_PROGRESS_STATE)
				return;

			this .setLoadState (X3DConstants .IN_PROGRESS_STATE);
			this .getScene () .addLoadCount (this);
			
			// Don't create scene cache, as of possible default nodes and complete scenes.

			var Loader = require ("cobweb/InputOutput/Loader");

			new Loader (this) .createX3DFromURL (this .url_, this .setSceneAsync .bind (this));
		},
		setSceneAsync: function (value)
		{
			this .getScene () .removeLoadCount (this);
		
			if (value)
				this .setScene (value);

			else
				this .setError ();
		},
		setError: function (error)
		{
			console .log (error);

			this .setLoadState (X3DConstants .FAILED_STATE);

			this .scene = this .getBrowser () .getPrivateScene ();

			this .setProtoDeclaration (null);

			this .deferred .resolve ();
			this .deferred = $.Deferred ();
		},
		setScene: function (value)
		{
			this .scene = value;

			this .setLoadState (X3DConstants .COMPLETE_STATE);

			this .scene .setLive (this .isLive () .getValue ());
			this .scene .setPrivate (this .getScene () .getPrivate ());
			//this .scene .setExecutionContext (this .getExecutionContext ());

			this .scene .setup ();

			var protoName = this .scene .getURL () .fragment || 0;

			this .setProtoDeclaration (this .scene .protos [protoName]);

			this .deferred .resolve ();
		},
	});

	Object .defineProperty (X3DExternProtoDeclaration .prototype, "name",
	{
		get: function () { return this .getName (); },
		enumerable: true,
		configurable: false
	});

	Object .defineProperty (X3DExternProtoDeclaration .prototype, "fields",
	{
		get: function () { return this .getFieldDefinitions (); },
		enumerable: true,
		configurable: false
	});

	Object .defineProperty (X3DExternProtoDeclaration .prototype, "isExternProto",
	{
		get: function () { return true; },
		enumerable: true,
		configurable: false
	});

	Object .defineProperty (X3DExternProtoDeclaration .prototype, "urls",
	{
		get: function () { return this .url_ .copy (); },
		enumerable: true,
		configurable: false
	});

	Object .defineProperty (X3DExternProtoDeclaration .prototype, "loadState",
	{
		get: function () { return this .checkLoadState (); },
		enumerable: true,
		configurable: false
	});

	return X3DExternProtoDeclaration;
});

