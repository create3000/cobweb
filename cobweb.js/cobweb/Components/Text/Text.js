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
	"cobweb/Components/Rendering/X3DGeometryNode",
	"cobweb/Bits/X3DCast",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DGeometryNode, 
          X3DCast,
          X3DConstants)
{
"use strict";

	function Text (executionContext)
	{
		X3DGeometryNode .call (this, executionContext);

		this .addType (X3DConstants .Text);
	}

	Text .prototype = $.extend (Object .create (X3DGeometryNode .prototype),
	{
		constructor: Text,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",   new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "string",     new Fields .MFString ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "length",     new Fields .MFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "maxExtent",  new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "solid",      new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "origin",     new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "textBounds", new Fields .SFVec2f ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "lineBounds", new Fields .MFVec2f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "fontStyle",  new Fields .SFNode ()),
		]),
		getTypeName: function ()
		{
			return "Text";
		},
		getComponentName: function ()
		{
			return "Text";
		},
		getContainerField: function ()
		{
			return "geometry";
		},
		initialize: function ()
		{
		   X3DGeometryNode .prototype .initialize .call (this);

		   this .fontStyle_ .addInterest (this, "set_fontStyle__");
	
			this .set_fontStyle__ ();
			this .eventsProcessed ();
		},
		getLength: function (index)
		{
			if (index < this .length_ .length)
				return Math .max (0, this .length_ [index]);

			return 0;
		},
		set_live__: function ()
		{
		    X3DGeometryNode .prototype .set_live__ .call (this);

		   if (this .getExecutionContext () .isLive () .getValue () && this .isLive () .getValue ())
				this .getBrowser () .getBrowserOptions () .PrimitiveQuality_ .addInterest (this, "eventsProcessed");
		   else
				this .getBrowser () .getBrowserOptions () .PrimitiveQuality_ .removeInterest (this, "eventsProcessed");
		},
		set_fontStyle__: function ()
		{
		   if (this .fontStyleNode)
		      this .fontStyleNode .removeInterest (this, "addNodeEvent");

			this .fontStyleNode = X3DCast (X3DConstants .X3DFontStyleNode, this .fontStyle_);

			if (! this .fontStyleNode)
				this .fontStyleNode = this .getBrowser () .getDefaultFontStyle ();

		   this .fontStyleNode .addInterest (this, "addNodeEvent");

		   this .textGeometry = this .fontStyleNode .getTextGeometry (this);
		},
		build: function ()
		{
			this .textGeometry .update ();
			this .textGeometry .build ();

			this .setSolid (this .solid_ .getValue ());
		},
		traverse: function (type)
		{
			this .textGeometry .traverse (type);
		},
		display: function (context)
		{
			this .textGeometry .display (context);

			X3DGeometryNode .prototype .display .call (this, context);
		},
		transform: function (object)
		{
			// Apply sceen nodes transformation in place here.
			this .textGeometry .transform (object);
		},
		getMatrix: function ()
		{
			return this .textGeometry .getMatrix ();
		},
		transformLine: function (line)
		{
			// Apply sceen nodes transformation in place here.
			return this .textGeometry .transformLine (line);
		},
	});

	return Text;
});


