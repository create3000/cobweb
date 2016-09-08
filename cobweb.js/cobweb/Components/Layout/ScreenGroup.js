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


define ("cobweb/Components/Layout/ScreenGroup",
[
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Grouping/X3DGroupingNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Rotation4",
	"standard/Math/Numbers/Matrix4",
	"standard/Math/Geometry/ViewVolume",
	"standard/Math/Algorithm",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DGroupingNode, 
          X3DConstants,
          Vector3,
          Rotation4,
          Matrix4,
          ViewVolume,
          Algorithm)
{
"use strict";

	var
		translation = new Vector3 (0, 0, 0),
		rotation    = new Rotation4 (0, 0, 1, 0),
		scale       = new Vector3 (1, 1, 1),
		screenPoint = new Vector3 (0, 0, 0);

	function ScreenGroup (executionContext)
	{
		X3DGroupingNode .call (this, executionContext);

		this .addType (X3DConstants .ScreenGroup);

		this .screenMatrix       = new Matrix4 ();
		this .modelViewMatrix    = new Matrix4 ();
		this .invModelViewMatrix = new Matrix4 ();
	}

	ScreenGroup .prototype = $.extend (Object .create (X3DGroupingNode .prototype),
	{
		constructor: ScreenGroup,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",       new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxSize",       new Fields .SFVec3f (-1, -1, -1)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxCenter",     new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "addChildren",    new Fields .MFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "removeChildren", new Fields .MFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "children",       new Fields .MFNode ()),
		]),
		getTypeName: function ()
		{
			return "ScreenGroup";
		},
		getComponentName: function ()
		{
			return "Layout";
		},
		getContainerField: function ()
		{
			return "children";
		},
		getBBox: function (bbox)
		{
			return X3DGroupingNode .prototype .getBBox .call (this, bbox) .multRight (this .getMatrix ());
		},
		getMatrix: function ()
		{
			try
			{
				this .invModelViewMatrix .assign (this .modelViewMatrix) .inverse ();
				this .matrix .assign (this .screenMatrix) .multRight (this .invModelViewMatrix);
			}
			catch (error)
			{ }

			return this .matrix;
		},
		scale: function (type)
		{
			// throws domain error

			this .getModelViewMatrix (type, this .modelViewMatrix);
			this .modelViewMatrix .get (translation, rotation, scale);
		
			var
				projectionMatrix = this .getBrowser () .getProjectionMatrix (),
				viewport         = this .getCurrentLayer () .getViewVolume () .getViewport (),
				screenScale      = this .getCurrentViewpoint () .getScreenScale (translation, viewport);
		
			this .screenMatrix .set (translation, rotation, scale .set (screenScale .x * (scale .x < 0 ? -1 : 1),
		                                                               screenScale .y * (scale .y < 0 ? -1 : 1),
		                                                               screenScale .z * (scale .z < 0 ? -1 : 1)));

			// Snap to whole pixel

			ViewVolume .projectPoint (Vector3 .Zero, this .screenMatrix, projectionMatrix, viewport, screenPoint);

			screenPoint .x = Math .round (screenPoint .x);
			screenPoint .y = Math .round (screenPoint .y);

			ViewVolume .unProjectPoint (screenPoint .x, screenPoint .y, screenPoint .z, this .screenMatrix, projectionMatrix, viewport, screenPoint);

			screenPoint .z = 0;
			this .screenMatrix .translate (screenPoint);

			// Assign modelViewMatrix

			this .getBrowser () .getModelViewMatrix () .set (this .screenMatrix);
		},
		traverse: function (type)
		{
			var modelViewMatrix = this .getBrowser () .getModelViewMatrix ();
	
			modelViewMatrix .push ();
			
			try
			{
				this .scale (type);
			
				X3DGroupingNode .prototype .traverse .call (this, type);
			}
			catch (error)
			{ }
			
			modelViewMatrix .pop ();
		},
	});

	return ScreenGroup;
});


