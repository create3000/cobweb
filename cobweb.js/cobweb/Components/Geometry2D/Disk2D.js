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


define ("cobweb/Components/Geometry2D/Disk2D",
[
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Rendering/X3DGeometryNode",
	"cobweb/Components/Rendering/X3DLineGeometryNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector3",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DGeometryNode,
          X3DLineGeometryNode,
          X3DConstants,
          Vector3)
{
"use strict";

	function Disk2D (executionContext)
	{
		X3DLineGeometryNode .call (this, executionContext);

		this .addType (X3DConstants .Disk2D);

		this .lineGeometry = false;
	}

	Disk2D .prototype = $.extend (Object .create (X3DGeometryNode .prototype),
		//X3DLineGeometryNode .prototype, // Considered X3DLineGeometryNode.
	{
		constructor: Disk2D,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",    new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "innerRadius", new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "outerRadius", new Fields .SFFloat (1)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "solid",       new Fields .SFBool (true)),
		]),
		getTypeName: function ()
		{
			return "Disk2D";
		},
		getComponentName: function ()
		{
			return "Geometry2D";
		},
		getContainerField: function ()
		{
			return "geometry";
		},
		initialize: function ()
		{
			X3DGeometryNode .prototype .initialize .call (this);

			this .setPrimitiveMode (this .getBrowser () .getContext () .LINE_LOOP);
		},
		set_live__: function ()
		{
			X3DGeometryNode .prototype .set_live__ .call (this);

			if (this .getExecutionContext () .isLive () .getValue () && this .isLive () .getValue ())
				this .getBrowser () .getDisk2DOptions () .addInterest (this, "eventsProcessed");
			else
				this .getBrowser () .getDisk2DOptions () .removeInterest (this, "eventsProcessed");
		},
		isLineGeometry: function ()
		{
			return this .lineGeometry;
		},
		build: function ()
		{
			var
				options     = this .getBrowser () .getDisk2DOptions (),
				innerRadius = this .innerRadius_ .getValue (),
				outerRadius = this .outerRadius_ .getValue ();

			if (innerRadius === outerRadius)
			{
				var
					radius          = Math .abs (outerRadius),
					defaultVertices = options .getCircleVertices (),
					vertices        = this .getVertices ();

				// Point

				//if (radius === 0)
				//{
				//	this .addVertex (Vector3 .Zero);
				//	this .setGeometryType (GeometryType .GEOMETRY_POINTS);
				//	return;
				//}

				// Circle

				if (radius === 1)
					this .setVertices (defaultVertices);
				else
				{
					for (var i = 0, length = defaultVertices .length; i < length; i += 4)
						vertices .push (defaultVertices [i] * radius, defaultVertices [i + 1] * radius, 0, 1);
				}
	
				this .getMin () .set (-radius, -radius, 0);
				this .getMax () .set ( radius,  radius, 0);

				this .lineGeometry = true;
				return;
			}

			if (innerRadius === 0 || outerRadius === 0)
			{
				// Disk

				var
					radius          = Math .abs (Math .max (innerRadius, outerRadius)),
					normals         = this .getNormals (),
					defaultVertices = options .getDiskVertices (),
					vertices        = this .getVertices ();

				this .getTexCoords () .push (options .getDiskTexCoords ());
				this .setNormals (options .getDiskNormals ());
	
				if (radius === 1)
					this .setVertices (defaultVertices);
				else
				{
					for (var i = 0, length = defaultVertices .length; i < length; i += 4)
						vertices .push (defaultVertices [i] * radius, defaultVertices [i + 1] * radius, 0, 1);
				}

				this .getMin () .set (-radius, -radius, 0);
				this .getMax () .set ( radius,  radius, 0);
		
				this .setSolid (this .solid_ .getValue ());

				this .lineGeometry = false;
				return;
			}

			var
				maxRadius  = Math .abs (Math .max (innerRadius, outerRadius)),
				minRadius  = Math .abs (Math .min (innerRadius, outerRadius)),
				scale      = minRadius / maxRadius,
				offset     = (1 - scale) / 2,
				texCoords1 = options .getDiskTexCoords (),
				texCoords2 = [ ],
				normals    = this .getNormals (),
				vertices1  = options .getDiskVertices (),
				vertices2  = this .getVertices ();

			this .getTexCoords () .push (texCoords2);

			for (var i = 0, length = vertices1 .length; i < length; i += 12)
			{
				texCoords2 .push (texCoords1 [i + 4] * scale + offset, texCoords1 [i + 5] * scale + offset, 0, 1,
				                  texCoords1 [i + 4], texCoords1 [i + 5], 0, 1,
				                  texCoords1 [i + 8], texCoords1 [i + 9], 0, 1,

				                  texCoords1 [i + 4] * scale + offset, texCoords1 [i + 5] * scale + offset, 0, 1,
				                  texCoords1 [i + 8], texCoords1 [i + 9], 0, 1,
				                  texCoords1 [i + 8] * scale + offset, texCoords1 [i + 9] * scale + offset, 0, 1);

				normals .push (0, 0, 1,  0, 0, 1,  0, 0, 1,
                           0, 0, 1,  0, 0, 1,  0, 0, 1);

				vertices2 .push (vertices1 [i + 4] * minRadius, vertices1 [i + 5] * minRadius, 0, 1,
				                 vertices1 [i + 4] * maxRadius, vertices1 [i + 5] * maxRadius, 0, 1,
				                 vertices1 [i + 8] * maxRadius, vertices1 [i + 9] * maxRadius, 0, 1,

				                 vertices1 [i + 4] * minRadius, vertices1 [i + 5] * minRadius, 0, 1,
				                 vertices1 [i + 8] * maxRadius, vertices1 [i + 9] * maxRadius, 0, 1,
				                 vertices1 [i + 8] * minRadius, vertices1 [i + 9] * minRadius, 0, 1);
			}

			this .getMin () .set (-maxRadius, -maxRadius, 0);
			this .getMax () .set ( maxRadius,  maxRadius, 0);
	
			this .setSolid (this .solid_ .getValue ());

			this .lineGeometry = false;
		},
		display: function (context)
		{
			if (this .isLineGeometry ())
			{
				X3DLineGeometryNode .prototype .display .call (this, context);
			}
			else
			{
				var
					browser = this .getBrowser (),
					gl      = browser .getContext (),
					shader  = browser .getShader ();
	
				shader .use ();
				gl .uniform1i (shader .geometryType, 2);
	
				X3DGeometryNode .prototype .display .call (this, context);
	
				gl .uniform1i (shader .geometryType, 3);
			}
		},
	});

	return Disk2D;
});


