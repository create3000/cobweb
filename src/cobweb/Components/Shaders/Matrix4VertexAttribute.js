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
	"cobweb/Components/Shaders/X3DVertexAttributeNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DVertexAttributeNode, 
          X3DConstants)
{
"use strict";

	function Matrix4VertexAttribute (executionContext)
	{
		X3DVertexAttributeNode .call (this, executionContext);

		this .addType (X3DConstants .Matrix4VertexAttribute);
	}

	Matrix4VertexAttribute .prototype = $.extend (Object .create (X3DVertexAttributeNode .prototype),
	{
		constructor: Matrix4VertexAttribute,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata", new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "name",     new Fields .SFString ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "value",    new Fields .MFMatrix4f ()),
		]),
		getTypeName: function ()
		{
			return "Matrix4VertexAttribute";
		},
		getComponentName: function ()
		{
			return "Shaders";
		},
		getContainerField: function ()
		{
			return "attrib";
		},
		addValue: function (array, index)
		{
			if (index < this .value_ .length)
			{
				var mat4 = this .value_ [index] .getValue ();

				for (var i = 0; i < 16; ++ i)
					array .push (mat4 [i]);
			}
			else
			{
				var mat4 = Matrix4 .Identity;

				for (var i = 0; i < 16; ++ i)
					array .push (mat4 [i]);
			}
		},
		enable: function (gl, shaderNode, buffer)
		{
			shaderNode .enableMatrix4Attrib (gl, this .name_ .getValue (), buffer);
		},
		disable: function (gl, shaderNode)
		{
			shaderNode .disableMatrix4Attrib (gl, this .name_ .getValue ());
		},
	});

	return Matrix4VertexAttribute;
});


