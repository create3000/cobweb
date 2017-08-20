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
	"cobweb/Basic/X3DBaseNode",
	"cobweb/Fields",
	"standard/Math/Numbers/Complex",
	"standard/Math/Numbers/Vector3",
],
function ($,
          X3DBaseNode,
          Fields,
          Complex,
          Vector3)
{
"use strict";
	
	function Circle2DOptions (executionContext)
	{
		X3DBaseNode .call (this, executionContext);

		this .addChildObjects ("dimension", new Fields .SFInt32 (40))

		this .vertices = [ ];
	}

	Circle2DOptions .prototype = $.extend (Object .create (X3DBaseNode .prototype),
	{
		constructor: Circle2DOptions,
		getTypeName: function ()
		{
			return "Circle2DOptions";
		},
		getComponentName: function ()
		{
			return "Cobweb";
		},
		getContainerField: function ()
		{
			return "circle2DOptions";
		},
		initialize: function ()
		{
			this .addInterest ("build", this);

			this .build ();
		},
		getVertices: function ()
		{
			return this .vertices;
		},
		build: function ()
		{
			var
				dimension = this .dimension_ .getValue (),
				angle     = Math .PI * 2 / dimension;
		
			this .vertices .length = 0;

			for (var n = 0; n < dimension; ++ n)
			{
				var point = Complex .Polar (1, angle * n);
		
				this .vertices .push (point .real, point .imag, 0, 1);
			}
		},
	});

	return Circle2DOptions;
});
