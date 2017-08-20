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
],
function (Fields)
{
"use strict";
	
	var p = (1 + Math .sqrt (5)) / 2; // Golden ratio

	function IcoSphere (type, order, radius)
	{
		this .type   = type;
		this .order  = order;
		this .radius = radius;

		this .coord ();
		this .sphericalMapping (this .coordIndex, this .point);
		this .applyRadius ();
	}

	IcoSphere .prototype .getCoordIndex = function ()
	{
		return this .coordIndex;
	}

	IcoSphere .prototype .getPoint = function ()
	{
		return this .point;
	}

	IcoSphere .prototype .getTexCoordIndex = function ()
	{
		return this .texCoordIndex;
	}

	IcoSphere .prototype .getTexPoint = function ()
	{
		return this .texPoint;
	}

	IcoSphere .prototype .coord = function ()
	{
		this .point      = new Fields .MFVec3f ();
		this .coordIndex = new Fields .MFInt32 ();

		this .middlePointIndexCache = [ ];

		if (this .type == 'OCTAHEDRON')
			this .octahedron ();

		else
			this .icosahedron ();

		this .refineTriangles ();
	}

	IcoSphere .prototype .octahedron = function ()
	{
		var coordIndex = this .coordIndex;
		
		this .addPoint (0,  1,  0);
		
		this .addPoint ( 0,  0,  1);
		this .addPoint ( 1,  0,  0);
		this .addPoint ( 0,  0, -1);
		this .addPoint (-1,  0,  0);

		this .addPoint ( 0, -1,  0);
		
		// 8 faces
		this .addTriangle (coordIndex, 0, 1, 2);
		this .addTriangle (coordIndex, 0, 2, 3);
		this .addTriangle (coordIndex, 0, 3, 4);
		this .addTriangle (coordIndex, 0, 4, 1);
		
		this .addTriangle (coordIndex, 5, 2, 1);
		this .addTriangle (coordIndex, 5, 3, 2);
		this .addTriangle (coordIndex, 5, 4, 3);
		this .addTriangle (coordIndex, 5, 1, 4);
	}

	IcoSphere .prototype .icosahedron = function ()
	{
		var coordIndex = this .coordIndex;

		// Create 12 vertices of a icosahedron
		this .addPoint (-1,  p,  0);
		this .addPoint ( 1,  p,  0);
		this .addPoint (-1, -p,  0);
		this .addPoint ( 1, -p,  0);

		this .addPoint ( 0, -1,  p);
		this .addPoint ( 0,  1,  p);
		this .addPoint ( 0, -1, -p);
		this .addPoint ( 0,  1, -p);

		this .addPoint ( p,  0, -1);
		this .addPoint ( p,  0,  1);
		this .addPoint (-p,  0, -1);
		this .addPoint (-p,  0,  1);
		
		// Rotate point thus a vertice is a pole
		if (this .order % 2 == 0)
		{
			var rotation = new Fields .SFRotation (0, 0, 1, Math .atan (1 / p))
			               .multiply (new Fields .SFRotation (0, 1, 0, -Math .PI / 10));

			for (var i = 0; i < this .point .length; ++ i)
				this .point [i] = rotation .multVec (this .point [i]);
		}

		// 5 faces around point 0
		this .addTriangle (coordIndex, 0, 11,  5);
		this .addTriangle (coordIndex, 0,  5,  1);
		this .addTriangle (coordIndex, 0,  1,  7);
		this .addTriangle (coordIndex, 0,  7, 10);
		this .addTriangle (coordIndex, 0, 10, 11);

		// 5 adjacentcoordIndex,  faces
		this .addTriangle (coordIndex,  1,  5,  9);
		this .addTriangle (coordIndex,  5, 11,  4);
		this .addTriangle (coordIndex, 11, 10,  2);
		this .addTriangle (coordIndex, 10,  7,  6);
		this .addTriangle (coordIndex,  7,  1,  8);

		// 5 faces arcoordIndex, ound point 3
		this .addTriangle (coordIndex,  3,  9,  4);
		this .addTriangle (coordIndex,  3,  4,  2);
		this .addTriangle (coordIndex,  3,  2,  6);
		this .addTriangle (coordIndex,  3,  6,  8);
		this .addTriangle (coordIndex,  3,  8,  9);

		// 5 adjacentcoordIndex,  faces
		this .addTriangle (coordIndex,  4,  9,  5);
		this .addTriangle (coordIndex,  2,  4, 11);
		this .addTriangle (coordIndex,  6,  2, 10);
		this .addTriangle (coordIndex,  8,  6,  7);
		this .addTriangle (coordIndex,  9,  8,  1);
	}

	IcoSphere .prototype .refineTriangles = function ()
	{
		var coordIndex = this .coordIndex;

		// Refine triangles
		for (var o = 0; o < this .order; ++ o)
		{
			var coordIndex2 = new Fields .MFInt32 ();

			for (var i = 0; i < coordIndex .length; i += 4)
			{
				// Replace triangle by 4 triangles
				var a = this .getMiddlePoint (coordIndex [i],     coordIndex [i + 1]);
				var b = this .getMiddlePoint (coordIndex [i + 1], coordIndex [i + 2]);
				var c = this .getMiddlePoint (coordIndex [i + 2], coordIndex [i]);

				this .addTriangle (coordIndex2, coordIndex [i],     a, c);
				this .addTriangle (coordIndex2, coordIndex [i + 1], b, a);
				this .addTriangle (coordIndex2, coordIndex [i + 2], c, b);
				this .addTriangle (coordIndex2, a, b, c);
			}

			coordIndex = coordIndex2;
		}
		
		this .coordIndex = coordIndex;
	}

	IcoSphere .prototype .addPoint = function (x, y, z)
	{
		var index = this .point .length;
		this .point [index] = new Fields .SFVec3f (x, y, z) .normalize ();
		return index;
	}

	IcoSphere .prototype .addTriangle = function (coordIndex, i1, i2, i3)
	{
		coordIndex [coordIndex .length] = i1;
		coordIndex [coordIndex .length] = i2;
		coordIndex [coordIndex .length] = i3;
		coordIndex [coordIndex .length] = -1;
	}

	IcoSphere .prototype .getMiddlePoint = function (p1, p2)
	{
		// First check if we have it already
		var firstIsSmaller = p1 < p2;
		var smallerIndex   = firstIsSmaller ? p1 : p2;
		var greaterIndex   = firstIsSmaller ? p2 : p1;
		var key            = smallerIndex + '+' + greaterIndex;

		if (key in this .middlePointIndexCache)
			return this .middlePointIndexCache [key];

		// Not in cache, calculate it
		var point1 = this .point [p1];
		var point2 = this .point [p2];
		
		// Add middle point, makes sure point is on unit sphere
		var index = this .addPoint ((point1 .x + point2 .x) / 2,
		                            (point1 .y + point2 .y) / 2,
		                            (point1 .z + point2 .z) / 2);

		// Store it, return index
		this .middlePointIndexCache [key] = index;

		return index;
	}

	IcoSphere .prototype .sphericalMapping = function (coordIndex, point)
	{
		this .poleThreshold    = 0.001;
		this .overlapThreshold = 0.5;

		//
		// Create texture coordinates
		//

		// Copy coordIndex
		var texCoordIndex = new Fields .MFInt32 ();
		
		for (var i = 0; i < coordIndex .length; ++ i)
			texCoordIndex [i] = coordIndex [i];

		// Apply spherecical mapping
		var texPoint = new Fields .MFVec2f ();
		
		for (var i = 0; i < point .length; ++ i)
		{
			// Always normalize to get rid of floating point errors.
			var normal   = point [i] .normalize ();
			texPoint [i] = new Fields .SFVec2f (Math .atan2 (normal .x, normal .z) / (2 * Math .PI) + 0.5,
			                                    Math .asin (normal .y) / Math .PI + 0.5);
		}

		this .texCoordIndex = texCoordIndex;
		this .texPoint      = texPoint;

		// Refine poles
		var northPoleThreshold = 1 - this .poleThreshold;
		var soutPoleThreshold  = this .poleThreshold;
		
		var length = texCoordIndex .length;
		
		for (var i = 0; i < length; i += 4)
		{
			var i0 = -1, i1, i2;
			
			// Find north pole
			
			if (texPoint [texCoordIndex [i]] .y > northPoleThreshold)
			{
				i0 = i;
				i1 = i + 1;
				i2 = i + 2;
			}
				
			else if (texPoint [texCoordIndex [i + 1]] .y > northPoleThreshold)
			{
				i0 = i + 1;
				i1 = i;
				i2 = i + 2;
			}
			
			else if (texPoint [texCoordIndex [i + 2]] .y > northPoleThreshold)
			{
				i0 = i + 2;
				i1 = i;
				i2 = i + 1;
			}

			// North pole found
			if (i0 > -1)
			{
				var index0 = texCoordIndex [i0]; // North pole
				var index1 = texCoordIndex [i1];
				var index2 = this. resolveOverlap (i1, i2);
			
				texCoordIndex [i0]          = texPoint .length;
				texPoint [texPoint .length] = new Fields .SFVec2f ((texPoint [index1] .x + texPoint [index2] .x) / 2,
				                                                   texPoint [index0] .y);
				
				continue;
			}
			
			// Find south pole

			if (texPoint [texCoordIndex [i]] .y < soutPoleThreshold)
			{
				i0 = i;
				i1 = i + 1;
				i2 = i + 2;
			}
				
			else if (texPoint [texCoordIndex [i + 1]] .y < soutPoleThreshold)
			{
				i0 = i + 1;
				i1 = i;
				i2 = i + 2;
			}
			
			else if (texPoint [texCoordIndex [i + 2]] .y < soutPoleThreshold)
			{
				i0 = i + 2;
				i1 = i;
				i2 = i + 1;
			}

			// South pole found
			if (i0 > -1)
			{
				var index0 = texCoordIndex [i0]; // South pole
				var index1 = texCoordIndex [i1];
				var index2 = this. resolveOverlap (i1, i2);

				texCoordIndex [i0]          = texPoint .length;
				texPoint [texPoint .length] = new Fields .SFVec2f ((texPoint [index1] .x + texPoint [index2] .x) / 2,
				                                                   texPoint [index0] .y);
				
				continue;
			}
			
			this. resolveOverlap (i, i + 1);
			this. resolveOverlap (i, i + 2);
		}
	}


	IcoSphere .prototype .resolveOverlap = function (i0, i1)
	{
		var texCoordIndex = this .texCoordIndex;
		var texPoint      = this .texPoint;

		var index1   = texCoordIndex [i1];
		var distance = texPoint [texCoordIndex [i0]] .x - this .texPoint [index1] .x;
		
		if (distance > this .overlapThreshold)
		{
			texCoordIndex [i1]          = texPoint .length;
			texPoint [texPoint .length] = new Fields .SFVec2f (texPoint [index1] .x + 1,
			                                                   texPoint [index1] .y);
		}
		else if (distance < -this .overlapThreshold)
		{
			texCoordIndex [i1]          = texPoint .length;
			texPoint [texPoint .length] = new Fields .SFVec2f (texPoint [index1] .x - 1,
			                                                   texPoint [index1] .y);	
		}

		return texCoordIndex [i1];
	}

	IcoSphere .prototype .applyRadius = function ()
	{
		if (this .radius == 1)
			return;

		for (var i = 0; i < this .point .length; ++ i)
			this .point [i] = this .point [i] .multiply (this .radius);
	}

	return IcoSphere;
});
