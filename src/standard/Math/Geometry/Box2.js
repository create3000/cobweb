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
	"../Numbers/Matrix3.js",
	"../Numbers/Vector2.js",
],
function (Matrix3, Vector2)
{
;"use strict";

	var
		x   = new Vector2 (0, 0),
		y   = new Vector2 (0, 0),
		min = new Vector2 (0, 0),
		max = new Vector2 (0, 0),
		p1  = new Vector2 (0, 0);

	var
		lhs_min = new Vector2 (0, 0),
		lhs_max = new Vector2 (0, 0),
		rhs_min = new Vector2 (0, 0),
		rhs_max = new Vector2 (0, 0);

	function Box2 (size, center)
	{
		switch (arguments .length)
		{
			case 0:
			{
				this .matrix = new Matrix3 (0.5, 0,   0,
				                            0,   0.5, 0,
				                            0,   0,   0);
				return;
			}
			case 2:
			{
				this .matrix = new Matrix3 (size .x / 2, 0, 0,
				                            0, size .y / 2, 0,
				                            center .x, center .y, 1);
				return;
			}
			case 3:
			{
				var
					min = arguments [0],
					max = arguments [1],
					sx  = (max .x - min .x) / 2,
					sy  = (max .y - min .y) / 2,
					cx  = (max .x + min .x) / 2,
					cy  = (max .y + min .y) / 2;

				this .matrix = new Matrix3 (sx, 0,  0,
				                            0,  sy, 0,
				                            cx, cy, 1);
				return;
			}
		}
	}

	Box2 .prototype =
	{
		constructor: Box2,
		copy: function ()
		{
			var copy = Object .create (Box2 .prototype);
			copy .matrix = this .matrix .copy ();
			return copy;
		},
		assign: function (box)
		{
			this .matrix .assign (box .matrix);
			return this;
		},
		equals: function (box)
		{
			return this .matrix .equals (box .matrix);
		},
		set: function (size, center)
		{
			var m = this .matrix;
		
			switch (arguments .length)
			{
				case 0:
				{
					m [0] = 0.5; m [1] = 0;   m [2] = 0;
					m [3] = 0;   m [4] = 0.5; m [5] = 0;
					m [6] = 0;   m [7] = 0;   m [8] = 0;
					return this;
				}
				case 2:
				{
					// size, center
					m [0] = size .x / 2; m [1] = 0;           m [2] = 0;
					m [3] = 0;           m [4] = size .y / 2; m [5] = 0;
					m [6] = center .x;   m [7] = center .y;   m [8] = 1;
					return this;
				}
			}
		},
		setExtents: function (min, max)
		{
			var
				m  = this .matrix,
				sx = (max .x - min .x) / 2,
				sy = (max .y - min .y) / 2,
				cx = (max .x + min .x) / 2,
				cy = (max .y + min .y) / 2;

			m [0] = sx; m [1] = 0;  m [2] = 0;
			m [3] = 0;  m [4] = sy; m [5] = 0;
			m [6] = cx; m [7] = cy; m [8] = 1;
			return this;
		},
		isEmpty: function ()
		{
			return this .matrix [8] === 0;
		},
		add: function (box)
		{
			if (this .isEmpty ())
				return this .assign (box);

			if (box .isEmpty ())
				return this;

			this .getExtents (lhs_min, lhs_max);
			box  .getExtents (rhs_min, rhs_max);

			return this .assign (new Box2 (lhs_min .min (rhs_min), lhs_max .max (rhs_max), true));
		},
		multLeft: function (matrix)
		{
			this .matrix .multLeft (matrix);
			return this;
		},
		multRight: function (matrix)
		{
			this .matrix .multRight (matrix);
			return this;
		},
		getExtents: function (min, max)
		{
			this .getAbsoluteExtents (min, max);

			min .add (this .center);
			max .add (this .center);
		},
		getAbsoluteExtents: function (min, max)
		{
		   var m = this .matrix;

			x .set (m [0], m [1]);
			y .set (m [3], m [4]);

			p1 .assign (x) .add (y);

			var p2 = y .subtract (x);

			min .assign (p1) .min (p2);
			max .assign (p1) .max (p2);

			p1 .negate ();
			p2 .negate ();

			min .min (p1, p2);
			max .max (p1, p2);
		},
		intersectsPoint: function (point)
		{
			this .getExtents (min, max);

			return min .x <= point .x &&
			       max .x >= point .x &&
			       min .y <= point .y &&
			       max .y >= point .y;
		},
		toString: function ()
		{
			return this .size + ", " + this .center;
		},
	};

	Object .defineProperty (Box2 .prototype, "size",
	{
		get: function ()
		{
			var max = new Vector2 (0, 0);
			
			this .getAbsoluteExtents (min, max);

			return max .subtract (min);
		},
		enumerable: true,
		configurable: false
	});

	Object .defineProperty (Box2 .prototype, "center",
	{
		get: function ()
		{
			return this .matrix .origin;
		},
		enumerable: true,
		configurable: false
	});

	return Box2;
});
