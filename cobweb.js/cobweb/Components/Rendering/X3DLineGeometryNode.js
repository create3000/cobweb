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
	"cobweb/Components/Rendering/X3DGeometryNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Matrix4",
],
function ($,
          X3DGeometryNode,
          X3DConstants,
          Matrix4)
{
"use strict";

	function X3DLineGeometryNode (executionContext)
	{
		X3DGeometryNode .call (this, executionContext);

		//this .addType (X3DConstants .X3DLineGeometryNode);

		this .shaderNode = this .getBrowser () .getLineShader ();
	}

	X3DLineGeometryNode .prototype = $.extend (Object .create (X3DGeometryNode .prototype),
	{
		constructor: X3DLineGeometryNode,
		setShader: function (value)
		{
			this .shaderNode = value;
		},
		depth: function (shaderNode)
		{ },
		display: function (context)
		{
			var
				browser    = this .getBrowser (),
				gl         = browser .getContext (),
				shaderNode = context .shaderNode;

			if (shaderNode === browser .getDefaultShader ())
				shaderNode = this .shaderNode;

			if (shaderNode .x3d_Vertex < 0)
				return;

			// Setup shader.

			context .geometryType  = this .getGeometryType ();
			context .colorMaterial = this .getColors () .length;
			shaderNode .setLocalUniforms (gl, context);

			// Setup vertex attributes.

			if (this .colors .length && shaderNode .x3d_Color >= 0)
			{
				gl .enableVertexAttribArray (shaderNode .x3d_Color);
				gl .bindBuffer (gl .ARRAY_BUFFER, this .colorBuffer);
				gl .vertexAttribPointer (shaderNode .x3d_Color, 4, gl .FLOAT, false, 0, 0);
			}

			gl .enableVertexAttribArray (shaderNode .x3d_Vertex);
			gl .bindBuffer (gl .ARRAY_BUFFER, this .vertexBuffer);
			gl .vertexAttribPointer (shaderNode .x3d_Vertex, 4, gl .FLOAT, false, 0, 0);

			// Wireframes are always solid so only one drawing call is needed.

			gl .drawArrays (shaderNode .primitiveMode === gl .POINTS ? gl .POINTS : this .primitiveMode, 0, this .vertexCount);

			if (shaderNode .x3d_Color >= 0) gl .disableVertexAttribArray (shaderNode .x3d_Color);
		},
		displayParticles: function (context, particles, numParticles)
		{
			var
				browser    = this .getBrowser (),
				gl         = browser .getContext (),
				shaderNode = context .shaderNode;

			if (shaderNode === browser .getDefaultShader ())
				shaderNode = this .shaderNode;

			if (shaderNode .x3d_Vertex < 0)
				return;

			// Setup shader.

			context .geometryType  = this .getGeometryType ();
			context .colorMaterial = this .colors .length;
			shaderNode .setLocalUniforms (gl, context);

			// Setup vertex attributes.

			if (this .colors .length && shaderNode .x3d_Color >= 0)
			{
				gl .enableVertexAttribArray (shaderNode .x3d_Color);
				gl .bindBuffer (gl .ARRAY_BUFFER, this .colorBuffer);
				gl .vertexAttribPointer (shaderNode .x3d_Color, 4, gl .FLOAT, false, 0, 0);
			}

			gl .enableVertexAttribArray (shaderNode .x3d_Vertex);
			gl .bindBuffer (gl .ARRAY_BUFFER, this .vertexBuffer);
			gl .vertexAttribPointer (shaderNode .x3d_Vertex, 4, gl .FLOAT, false, 0, 0);

			// Wireframes are always solid so only one drawing call is needed.

			var
				modelViewMatrix = context .modelViewMatrix,
				x               = modelViewMatrix [12],
				y               = modelViewMatrix [13],
				z               = modelViewMatrix [14],
				primitiveMode   = shaderNode .primitiveMode === gl .POINTS ? gl .POINTS : this .primitiveMode;

			for (var p = 0; p < numParticles; ++ p)
			{
				modelViewMatrix [12] = x;
				modelViewMatrix [13] = y;
				modelViewMatrix [14] = z;

				Matrix4 .prototype .translate .call (modelViewMatrix, particles [p] .position);

				gl .uniformMatrix4fv (shaderNode .x3d_ModelViewMatrix, false, modelViewMatrix);
	
				gl .drawArrays (primitiveMode, 0, this .vertexCount);
			}

			if (shaderNode .x3d_Color >= 0) gl .disableVertexAttribArray (shaderNode .x3d_Color);
		},
	});

	return X3DLineGeometryNode;
});


