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
	"../../Fields.js",
	"../../Basic/X3DFieldDefinition.js",
	"../../Basic/FieldDefinitionArray.js",
	"./X3DColorNode.js",
	"../../Bits/X3DConstants.js",
	"../../../standard/Math/Numbers/Color3.js",
	"../../../standard/Math/Numbers/Vector4.js",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DColorNode, 
          X3DConstants,
          Color3,
          Vector4)
{
"use strict";

	var white = new Color3 (1, 1, 1);

	function Color (executionContext)
	{
		X3DColorNode .call (this, executionContext);

		this .addType (X3DConstants .Color);
	}

	Color .prototype = $.extend (Object .create (X3DColorNode .prototype),
	{
		constructor: Color,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata", new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "color",    new Fields .MFColor ()),
		]),
		getTypeName: function ()
		{
			return "Color";
		},
		getComponentName: function ()
		{
			return "Rendering";
		},
		getContainerField: function ()
		{
			return "color";
		},
		isTransparent: function ()
		{
			return false;
		},
		getWhite: function ()
		{
			return white;
		},
		getVectors: function (array)
		{
			var color = this .color_ .getValue ();

			for (var i = 0, length = color .length; i < length; ++ i)
			{
				var c = color [i] .getValue ();

				array [i] = new Vector4 (c .r, c .g, c .b, 1);
			}

			array .length = length;

			return array;
		},
	});

	return Color;
});


