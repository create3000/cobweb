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
	"standard/Math/Numbers/Vector3",
],
function (Vector3)
{
"use strict";

	function Line3 (point, direction)
	{
		this .point     = point     .copy ();
		this .direction = direction .copy ();
	}

	Line3 .prototype =
	{
		constructor: Line3,
		// Static vectors for line / triangle intersection.
		u: new Vector3 (0, 0, 0),
		pvec: new Vector3 (0, 0, 0),
		tvec: new Vector3 (0, 0, 0),
		copy: function ()
		{
			var copy = Object .create (Line3 .prototype);
			copy .point     = this .point .copy ();
			copy .direction = this .direction .copy ();
			return copy;
		},
		assign: function (line)
		{
			this .point     .assign (line .point);
			this .direction .assign (line .direction);
			return this;
		},
		set: function (point, direction)
		{
			this .point     .assign (point);
			this .direction .assign (direction);
			return this;
		},
		setPoints: function (point1, point2)
		{
			this .point .assign (point1);
			this .direction .assign (point2) .subtract (point1) .normalize ();
			return this;
		},
		multMatrixLine: function (matrix)
		{
			matrix .multMatrixVec (this .point);
			matrix .multMatrixDir (this .direction) .normalize ();
			return this;
		},
		multLineMatrix: function (matrix)
		{
			matrix .multVecMatrix (this .point);
			matrix .multDirMatrix (this .direction) .normalize ();
			return this;
		},
		getClosestPointToPoint: function (point, result)
		{
			var
				r = result .assign (point) .subtract (this .point),
				d = r .dot (this .direction);

			return result .assign (this .direction) .multiply (d) .add (this .point);
		},
		getClosestPointToLine: function (line, point)
		{
			var
				p1 = this .point,
				p2 = line .point,
				d1 = this .direction,
				d2 = line .direction;

			var t = Vector3 .dot (d1, d2);

			if (Math .abs (t) >= 1)
				return false;  // lines are parallel

			var u = this .u .assign (p2) .subtract (p1);

			t = (Vector3 .dot (u, d1) - t * Vector3 .dot (u, d2)) / (1 - t * t);

			point .assign (d1) .multiply (t) .add (p1);
			return true;
		},
		getPerpendicularVector: function (point)
		{
			var d = Vector3 .subtract (this .point, point);

			return d .subtract (this .direction .copy () .multiply (Vector3 .dot (d, this .direction)));
		},
		intersectsTriangle: function (A, B, C, uvt)
		{
			// Find vectors for two edges sharing vert0.
			var
				edge1 = B .subtract (A),
				edge2 = C .subtract (A);

			// Begin calculating determinant - also used to calculate U parameter.
			var pvec = this .pvec .assign (this .direction) .cross (edge2);

			// If determinant is near zero, ray lies in plane of triangle.
			var det = edge1 .dot (pvec);

			// Non culling intersection.

			if (det === 0)
				return false;

			var inv_det = 1 / det;

			// Calculate distance from vert0 to ray point.
			var tvec = this .tvec .assign (this .point) .subtract (A);

			// Calculate U parameter and test bounds.
			var u = tvec .dot (pvec) * inv_det;

			if (u < 0 || u > 1)
				return false;

			// Prepare to test V parameter.
			var qvec = tvec .cross (edge1);

			// Calculate V parameter and test bounds.
			var v = this .direction .dot (qvec) * inv_det;

			if (v < 0 || u + v > 1)
				return false;

			var t = edge2 .dot (qvec) * inv_det;

			uvt .u = u;
			uvt .v = v;
			uvt .t = t;

			return true;
		},
		toString: function ()
		{
			return this .point + ", " + this .direction;
		},
	};

	Line3 .Points = function (point1, point2)
	{
		var line = Object .create (Line3 .prototype);
		line .point     = point1 .copy ();
		line .direction = Vector3 .subtract (point2, point1) .normalize ();
		return line;
	};

	return Line3;
});
