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
	"cobweb/Components/Core/X3DChildNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Vector4",
	"standard/Math/Geometry/Plane3",
	"standard/Utility/ObjectCache",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DChildNode, 
          X3DConstants,
          Vector3,
          Vector4,
          Plane3,
          ObjectCache)
{
"use strict";

	var
		vector     = new Vector3 (0, 0, 0),
		plane      = new Plane3 (vector, vector),
		ClipPlanes = ObjectCache (ClipPlaneContainer);

	function ClipPlaneContainer (clipPlane)
	{
		this .plane = new Plane3 (vector, vector);

		this .set (clipPlane);
	}

	ClipPlaneContainer .prototype =
	{
		constructor: ClipPlaneContainer,
		isClipped: function (point, invModelViewMatrix)
		{
			try
			{
				var distance = plane .assign (this .plane) .multRight (invModelViewMatrix) .getDistanceToPoint (point);

				return distance < 0;
			}
			catch (error)
			{
				return false;
			}
		},
		set: function (clipPlane)
		{
			try
			{
				var
					plane  = this .plane,
					plane_ = clipPlane .plane;

				plane .normal .assign (plane_);
				plane .distanceFromOrigin = -plane_ .w;

				plane .multRight (clipPlane .getBrowser () .getModelViewMatrix () .get ());
			}
			catch (error)
			{
				plane .normal .set (0, 1, 0);
				plane .distanceFromOrigin = 0;
			}
		},
		setShaderUniforms: function (gl, shaderObject, i)
		{
			var
				plane  = this .plane,
				normal = plane .normal;

			gl .uniform4f (shaderObject .x3d_ClipPlane [i], normal .x, normal .y, normal .z, plane .distanceFromOrigin);
		},
		recycle: function ()
		{
		   ClipPlanes .push (this);
		},
	};

	function ClipPlane (executionContext)
	{
		X3DChildNode .call (this, executionContext);

		this .addType (X3DConstants .ClipPlane);

		this .enabled = false;
		this .plane   = new Vector4 (0, 0, 0, 0);
	}

	ClipPlane .prototype = $.extend (Object .create (X3DChildNode .prototype),
	{
		constructor: ClipPlane,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata", new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "enabled",  new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "plane",    new Fields .SFVec4f (0, 1, 0, 0)),
		]),
		getTypeName: function ()
		{
			return "ClipPlane";
		},
		getComponentName: function ()
		{
			return "Rendering";
		},
		getContainerField: function ()
		{
			return "children";
		},
		initialize: function ()
		{
			X3DChildNode .prototype .initialize .call (this);

			this .enabled_ .addInterest (this, "set_enabled__");
			this .plane_   .addInterest (this, "set_enabled__");

			this .set_enabled__ ();
		},
		set_enabled__: function ()
		{
			this .plane .assign (this .plane_ .getValue ());

			this .enabled = this .enabled_ .getValue () && ! this .plane .equals (Vector4 .Zero);
		},
		push: function ()
		{
			if (this .enabled)
				this .getCurrentLayer () .getClipPlanes () .push (ClipPlanes .pop (this));
		},
		pop: function ()
		{
			if (this .enabled)
				this .getBrowser () .getClipPlanes () .push (this .getCurrentLayer () .getClipPlanes () .pop ());
		},
	});

	return ClipPlane;
});


