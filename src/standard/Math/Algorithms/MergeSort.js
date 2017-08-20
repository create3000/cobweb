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


define (function ()
{
"use strict";

	function MergeSort (array, compare)
	{
		this .array     = array;
		this .auxiliary = [ ];

		if (compare)
			this .compare = compare;
	}

	MergeSort .prototype =
	{
		compare: function (lhs, rhs)
		{
			return lhs < rhs;
		},
		sort: function (first, last)
		{
			this .mergeSort (first, last - 1);
		},
		mergeSort: function (lo, hi)
		{
			if (lo < hi)
			{
				var m = (lo + hi) >>> 1;
				this .mergeSort (lo, m);   // Recursion
				this .mergeSort (m + 1, hi); // Recursion
				this .merge (lo, m, hi);
			}
		},
		merge: function (lo, m, hi)
		{
			var i, j, k;

			i = 0, j = lo;
			// Copy first half of array a to auxiliary array b.
			while (j <= m)
				this .auxiliary [i++] = this .array [j++];

			i = 0; k = lo;
			// Copy back next-greatest element at each time.
			while (k < j && j <= hi)
			{
				if (this .compare (this .array [j], this .auxiliary [i]))
					this .array [k++] = this .array [j++];
				else
					this .array [k++] = this .auxiliary [i++];
			}

			// Copy back remaining elements of first half (if any).
			while (k < j)
				this .array [k++] = this .auxiliary [i++];
		}
	};

	return MergeSort;
});
