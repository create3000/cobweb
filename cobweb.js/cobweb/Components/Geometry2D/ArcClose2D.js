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


define ("cobweb/Components/Geometry2D/ArcClose2D",
[
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Rendering/X3DGeometryNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Complex",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Algorithm",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DGeometryNode, 
          X3DConstants,
          Complex,
          Vector3,
          Algorithm)
{
"use strict";

	var half = new Complex (0.5, 0.5);

	function ArcClose2D (executionContext)
	{
		X3DGeometryNode .call (this, executionContext);

		this .addType (X3DConstants .ArcClose2D);
	}

	ArcClose2D .prototype = $.extend (Object .create (X3DGeometryNode .prototype),
	{
		constructor: ArcClose2D,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",    new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "closureType", new Fields .SFString ("PIE")),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "startAngle",  new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "endAngle",    new Fields .SFFloat (1.5708)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "radius",      new Fields .SFFloat (1)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "solid",       new Fields .SFBool (true)),
		]),
		getTypeName: function ()
		{
			return "ArcClose2D";
		},
		getComponentName: function ()
		{
			return "Geometry2D";
		},
		getContainerField: function ()
		{
			return "geometry";
		},
		set_live__: function ()
		{
			X3DGeometryNode .prototype .set_live__ .call (this);

			if (this .getExecutionContext () .isLive () .getValue () && this .isLive () .getValue ())
				this .getBrowser () .getArcClose2DOptions () .addInterest (this, "eventsProcessed");
			else
				this .getBrowser () .getArcClose2DOptions () .removeInterest (this, "eventsProcessed");
		},
		getAngle: function ()
		{
			var
				start = Algorithm .interval (this .startAngle_ .getValue (), 0, Math .PI * 2),
				end   = Algorithm .interval (this .endAngle_   .getValue (), 0, Math .PI * 2);
		
			if (start === end)
				return Math .PI * 2;
		
			var difference = Math .abs (end - start);
		
			if (start > end)
				return (Math .PI * 2) - difference;
		
			if (! isNaN (difference))
				return difference;
			
			// We must test for NAN, as NAN to int is undefined.
			return 0;
		},
		build: function ()
		{
			var
				options    = this .getBrowser () .getArcClose2DOptions (),
				chord      = this .closureType_ .getValue () === "CHORD",
				minAngle   = options .minAngle_ .getValue (),
				startAngle = this .startAngle_ .getValue  (),
				radius     = Math .abs (this .radius_ .getValue ()),
				difference = this .getAngle (),
				segments   = Math .ceil (difference / minAngle),
				angle      = difference / segments,
				texCoords  = [ ],
				normals    = this .getNormals (),
				vertices   = this .getVertices (),
				texCoord   = [ ],
				points     = [ ];

			this .getTexCoords () .push (texCoords);

			for (var n = 0, length = segments + 1; n < length; ++ n)
			{
				var theta = startAngle + angle * n;

				texCoord .push (Complex .Polar (0.5, theta) .add (half));
				points   .push (Complex .Polar (radius, theta));
			}

			if (chord)
			{
				var
					t0 = texCoord [0],
					p0 = points [0];

				for (var i = 1; i < segments; ++ i)
				{
					var
						t1 = texCoord [i],
						t2 = texCoord [i + 1],
						p1 = points [i],
						p2 = points [i + 1];

					texCoords .push (t0 .real, t0 .imag, 0, 1,
					                 t1 .real, t1 .imag, 0, 1,
					                 t2 .real, t2 .imag, 0, 1);

					normals .push (0, 0, 1,
					               0, 0, 1,
					               0, 0, 1);

					vertices .push (p0 .real, p0 .imag, 0, 1,
					                p1 .real, p1 .imag, 0, 1,
					                p2 .real, p2 .imag, 0, 1);
				}
			}
			else
			{
				for (var i = 0; i < segments; ++ i)
				{
					var
						t1 = texCoord [i],
						t2 = texCoord [i + 1],
						p1 = points [i],
						p2 = points [i + 1];

					texCoords .push (0.5, 0.5, 0, 1,
					                 t1 .real, t1 .imag, 0, 1,
					                 t2 .real, t2 .imag, 0, 1);

					normals .push (0, 0, 1,  0, 0, 1,  0, 0, 1);

					vertices .push (0, 0, 0, 1,
					                p1 .real, p1 .imag, 0, 1,
					                p2 .real, p2 .imag, 0, 1);
				}
			}

			this .getMin () .set (-radius, -radius, 0);
			this .getMax () .set ( radius,  radius, 0);	
	
			this .setSolid (this .solid_ .getValue ());
		},
		display: function (context)
		{
			var
				browser = this .getBrowser (),
				gl      = browser .getContext (),
				shader  = browser .getShader ();

			shader .use ();
			gl .uniform1i (shader .geometryType, 2);

			X3DGeometryNode .prototype .display .call (this, context);

			gl .uniform1i (shader .geometryType, 3);
		},
	});

	return ArcClose2D;
});


