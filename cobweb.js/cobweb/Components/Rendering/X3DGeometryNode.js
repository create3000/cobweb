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


define ("cobweb/Components/Rendering/X3DGeometryNode",
[
	"jquery",
	"cobweb/Fields",
	"cobweb/Components/Core/X3DNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Color3",
	"standard/Math/Numbers/Vector2",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Matrix3",
	"standard/Math/Numbers/Matrix4",
	"standard/Math/Geometry/Box3",
	"standard/Math/Geometry/Plane3",
	"standard/Math/Geometry/Triangle3",
	"standard/Math/Algorithm",
],
function ($,
          Fields,
          X3DNode,
          X3DConstants,
          Color3,
          Vector2,
          Vector3,
          Matrix3,
          Matrix4,
          Box3,
          Plane3,
          Triangle3,
          Algorithm)
{
"use strict";

	var modelViewMatrix = new Matrix4 ();

	// Box normals for bbox / line intersection.
	var boxNormals = [
		new Vector3 (0,  0,  1), // front
		new Vector3 (0,  0, -1), // back
		new Vector3 (0,  1,  0), // top
		new Vector3 (0, -1,  0), // bottom
		new Vector3 (1,  0,  0)  // right
		// left: We do not have to test for left.
	];

	function X3DGeometryNode (executionContext)
	{
		X3DNode .call (this, executionContext);

		this .addType (X3DConstants .X3DGeometryNode);
			
		this .addChildren ("transparent",  new Fields .SFBool ());
		this .addChildren ("bbox_changed", new Fields .SFTime ());

		this .geometryType        = 3;
		this .currentTexCoordNode = this .getBrowser () .getDefaultTextureCoordinate ();
	}

	X3DGeometryNode .prototype = $.extend (Object .create (X3DNode .prototype),
	{
		constructor: X3DGeometryNode,
		intersection: new Vector3 (0, 0, 0),
		uvt: { u: 0, v: 0, t: 0 },
		v0: new Vector3 (0, 0, 0),
		v1: new Vector3 (0, 0, 0),
		v2: new Vector3 (0, 0, 0),
		normal: new Vector3 (0, 0, 0),
		setup: function ()
		{
			this .setTainted (true);
		
			X3DNode .prototype .setup .call (this);

			this .addInterest (this, "eventsProcessed");
			this .eventsProcessed ();

			this .setTainted (false);
		},
		initialize: function ()
		{
			X3DNode .prototype .initialize .call (this);

			this .getExecutionContext () .isLive () .addInterest (this, "set_live__");
			this .isLive () .addInterest (this, "set_live__");

			var gl = this .getBrowser () .getContext ();

			this .min              = new Vector3 (0, 0, 0);
			this .max              = new Vector3 (0, 0, 0);
			this .bbox             = new Box3 (this .min, this .max, true);
			this .solid            = true;
			this .flatShading      = undefined;
			this .colors           = [ ];
			this .texCoords        = [ ];
			this .defaultTexCoords = [ ];
			this .texCoordParams   = { min: new Vector3 (0, 0, 0) };
			this .normals          = [ ];
			this .flatNormals      = [ ];
			this .vertices         = [ ];
			this .vertexCount      = 0;

			this .primitiveMode   = gl .TRIANGLES;
			this .frontFace       = gl .CCW;
			this .colorBuffer     = gl .createBuffer ();
			this .texCoordBuffers = [ ];
			this .normalBuffer    = gl .createBuffer ();
			this .vertexBuffer    = gl .createBuffer ();
			this .colorArray      = new Float32Array ();
			this .texCoordArray   = [ ];
			this .vertexArray     = new Float32Array ();
			this .planes          = [ ];

			if (this .geometryType > 1)
			{
				for (var i = 0; i < 5; ++ i)
					this .planes [i] = new Plane3 (Vector3 .Zero, boxNormals [0]);
			}

			this .set_live__ ();
		},
		getExtendedEventHandling: function ()
		{
			return false;
		},
		setGeometryType: function (value)
		{
			this .geometryType = value;
		},
		getGeometryType: function ()
		{
			return this .geometryType;
		},
		getBBox: function ()
		{
			// With screen matrix applied.
			return this .bbox;
		},
		getMin: function ()
		{
			// With screen matrix applied.
			return this .min;
		},
		getMax: function ()
		{
			// With screen matrix applied.
			return this .max;
		},
		getMatrix: function ()
		{
			return Matrix4 .Identity;
		},
		setPrimitiveMode: function (value)
		{
			this .primitiveMode = value;
		},
		getPrimitiveMode: function ()
		{
			return this .primitiveMode;
		},
		setSolid: function (value)
		{
			this .solid = value;
		},
		setCCW: function (value)
		{
			this .frontFace = value ? this .getBrowser () .getContext () .CCW : this .getBrowser () .getContext () .CW;
		},
		addColor: function (color)
		{
			this .colors .push (color .r, color .g, color .b, color .length === 3 ? 1 : color .a);
		},
		setColors: function (value)
		{
			var colors = this .colors;

			for (var i = 0, length = value .length; i < length; ++ i)
				colors [i] = value [i];

			colors .length = length;
		},
		getColors: function ()
		{
			return this .colors;
		},
		setTexCoords: function (value)
		{
			var texCoords = this .texCoords;

			for (var i = 0, length = value .length; i < length; ++ i)
				texCoords [i] = value [i];

			texCoords .length = length;
		},
		getTexCoords: function ()
		{
			return this .texCoords;
		},
		setCurrentTexCoord: function (value)
		{
			this .currentTexCoordNode = value || this .getBrowser () .getDefaultTextureCoordinate ();
		},
		addNormal: function (normal)
		{
			this .normals .push (normal .x, normal .y, normal .z);
		},
		setNormals: function (value)
		{
			var normals = this .normals;

			for (var i = 0, length = value .length; i < length; ++ i)
				normals [i] = value [i];

			normals .length = length;
		},
		getNormals: function ()
		{
			return this .normals;
		},
		addVertex: function (vertex)
		{
			this .min .min (vertex);
			this .max .max (vertex);

			this .vertices .push (vertex .x, vertex .y, vertex .z, 1);
		},
		setVertices: function (value)
		{
			var vertices = this .vertices;

			for (var i = 0, length = value .length; i < length; ++ i)
				vertices [i] = value [i];

			vertices .length = length;
		},
		getVertices: function ()
		{
			return this .vertices;
		},
		buildTexCoords: function ()
		{
			var
				p         = this .getTexCoordParams (),
				min       = p .min,
				Sindex    = p .Sindex,
				Tindex    = p .Tindex,
				Ssize     = p .Ssize,
				S         = min [Sindex],
				T         = min [Tindex],
				texCoords = this .defaultTexCoords,
				vertices  = this .vertices;

			texCoords .length = 0;
			this .texCoords .push (texCoords);

			for (var i = 0, length = vertices .length; i < length; i += 4)
			{
				texCoords .push ((vertices [i + Sindex] - S) / Ssize,
				                 (vertices [i + Tindex] - T) / Ssize,
				                 0,
				                 1);
			}
		},
		getTexCoordParams: function ()
		{
			var
				p     = this .texCoordParams,
				bbox  = this .getBBox (),
				size  = bbox .size,
				Xsize = size .x,
				Ysize = size .y,
				Zsize = size .z;

			p .min .assign (bbox .center) .subtract (size .divide (2));

			if ((Xsize >= Ysize) && (Xsize >= Zsize))
			{
				// X size largest
				p .Ssize = Xsize; p .Sindex = 0;

				if (Ysize >= Zsize)
					p .Tindex = 1;
				else
					p .Tindex = 2;
			}
			else if ((Ysize >= Xsize) && (Ysize >= Zsize))
			{
				// Y size largest
				p .Ssize = Ysize; p .Sindex = 1;

				if (Xsize >= Zsize)
					p .Tindex = 0;
				else
					p .Tindex = 2;
			}
			else
			{
				// Z is the largest
				p .Ssize = Zsize; p .Sindex = 2;

				if (Xsize >= Ysize)
					p .Tindex = 0;
				else
					p .Tindex = 1;
			}

			return p;
		},
		refineNormals: function (normalIndex, normals, creaseAngle)
		{
			if (creaseAngle === 0)
				return normals;

			var
				cosCreaseAngle = Math .cos (Algorithm .clamp (creaseAngle, 0, Math .PI)),
				normals_       = [ ];

			for (var i in normalIndex) // Don't use forEach
			{
				var vertex = normalIndex [i];

				for (var p = 0, length = vertex .length; p < length; ++ p)
				{
					var
						P = vertex [p],
						m = normals [P],
						n = new Vector3 (0, 0, 0);

					for (var q = 0; q < length; ++ q)
					{
						var Q = normals [vertex [q]];
	
						if (Q .dot (m) >= cosCreaseAngle)
							n .add (Q);
					}

					normals_ [P] = n .normalize ();
				}
			}

			return normals_;
		},
		set_live__: function ()
		{
			var live = this .getExecutionContext () .isLive () .getValue () && this .isLive () .getValue ();

			if (live)
				this .getBrowser () .getBrowserOptions () .Shading_ .addInterest (this, "set_shading__");
			else
				this .getBrowser () .getBrowserOptions () .Shading_ .removeInterest (this, "set_shading__");
		},
		set_shading__: function (shading)
		{
			if (this .geometryType < 2)
				return;
			
			var flatShading = shading .getValue () === "FLAT";

			if (flatShading === this .flatShading)
				return;
		   
		   this .flatShading = flatShading;

		   // Generate flat normals if needed.

			var gl = this .getBrowser () .getContext ();

			if (flatShading)
			{
				if (! this .flatNormals .length)
				{
					var
						cw          = this .frontFace === gl .CW,
						flatNormals = this .flatNormals,
						vertices    = this .vertices,
						v0          = this .v0,
						v1          = this .v1,
						v2          = this .v2,
						normal      = this .normal;

					for (var i = 0, length = vertices .length; i < length; i += 12)
					{
					   Triangle3 .normal (v0 .set (vertices [i + 0], vertices [i + 1], vertices [i + 2]),
					                      v1 .set (vertices [i + 4], vertices [i + 5], vertices [i + 6]),
					                      v2 .set (vertices [i + 8], vertices [i + 9], vertices [i + 10]),
					                      normal);
					   
						if (cw)
							normal .negate ();

						flatNormals .push (normal .x, normal .y, normal .z,
						                   normal .x, normal .y, normal .z,
						                   normal .x, normal .y, normal .z);
					}
				}
			}

			// Transfer normals.

			gl .bindBuffer (gl .ARRAY_BUFFER, this .normalBuffer);
			gl .bufferData (gl .ARRAY_BUFFER, new Float32Array (flatShading ? this .flatNormals : this .normals), gl .STATIC_DRAW);
		},
		eventsProcessed: function ()
		{
			X3DNode .prototype .eventsProcessed .call (this);

			this .clear ();
			this .build ();

			if (this .vertices .length)
				this .bbox .setExtents (this .min, this .max);
			else
				this .bbox .setExtents (this .min .set (0, 0, 0), this .max .set (0, 0, 0));

			this .bbox_changed_ .addEvent ();

			if (this .geometryType > 1)
			{
				var
					min = this .min,
					max = this .max;

				for (var i = 0; i < 5; ++ i)
					this .planes [i] .set (i % 2 ? min : max, boxNormals [i]);

				if (this .texCoords .length === 0)
					this .buildTexCoords ();
			}

			this .set_shading__ (this .getBrowser () .getBrowserOptions () .Shading_);
			this .transfer ();
		},
		clear: function ()
		{
			this .min .set (Number .POSITIVE_INFINITY, Number .POSITIVE_INFINITY, Number .POSITIVE_INFINITY);
			this .max .set (Number .NEGATIVE_INFINITY, Number .NEGATIVE_INFINITY, Number .NEGATIVE_INFINITY);

			this .flatShading = undefined;
			this .colors      .length = 0;
			this .texCoords   .length = 0;
			this .normals     .length = 0;
			this .flatNormals .length = 0;
			this .vertices    .length = 0;
		},
		transfer: function ()
		{
			var
				gl    = this .getBrowser () .getContext (),
				count = this .vertices .length / 4;

			// Transfer colors.
	
			if (this .colorArray .length !== this .colors .length)
				this .colorArray = new Float32Array (this .colors);
			else
				this .colorArray .set (this .colors);

			gl .bindBuffer (gl .ARRAY_BUFFER, this .colorBuffer);
			gl .bufferData (gl .ARRAY_BUFFER, this .colorArray, gl .STATIC_DRAW);

			// Transfer texCoords.

			for (var i = this .texCoordBuffers .length, length = this .texCoords .length; i < length; ++ i)
			{
				this .texCoordBuffers .push (gl .createBuffer ());
				this .texCoordArray   .push (new Float32Array ());
			}

			this .texCoordBuffers .length = this .texCoords .length;
			
			for (var i = 0, length = this .texCoords .length; i < length; ++ i)
			{
				if (this .texCoordArray [i] .length !== this .texCoords [i] .length)
					this .texCoordArray [i] = new Float32Array (this .texCoords [i]);
				else
					this .texCoordArray [i] .set (this .texCoords [i]);

				gl .bindBuffer (gl .ARRAY_BUFFER, this .texCoordBuffers [i]);
				gl .bufferData (gl .ARRAY_BUFFER, this .texCoordArray [i], gl .STATIC_DRAW);
			}

			// Transfer vertices.

			if (this .vertexArray .length !== this .vertices .length)
				this .vertexArray = new Float32Array (this .vertices);
			else
				this .vertexArray .set (this .vertices);

			gl .bindBuffer (gl .ARRAY_BUFFER, this .vertexBuffer);
			gl .bufferData (gl .ARRAY_BUFFER, this .vertexArray, gl .STATIC_DRAW);
			this .vertexCount = count;
	  	},
		traverse: function (type)
		{ },
		display: function (context)
		{
			var
				browser = this .getBrowser (),
				gl      = browser .getContext (),
				shader  = browser .getShader ();

			if (shader .vertex < 0 || this .vertexCount === 0)
				return;

			// Setup shader.

			context .geometryType  = this .geometryType;
			context .colorMaterial = this .colors .length;
			shader .setLocalUniforms (context);

			// Setup vertex attributes.

			if (this .colors .length && shader .color >= 0)
			{
				gl .enableVertexAttribArray (shader .color);
				gl .bindBuffer (gl .ARRAY_BUFFER, this .colorBuffer);
				gl .vertexAttribPointer (shader .color, 4, gl .FLOAT, false, 0, 0);
			}

			if (shader .texCoord >= 0)
			{
				gl .enableVertexAttribArray (shader .texCoord);
				gl .bindBuffer (gl .ARRAY_BUFFER, this .texCoordBuffers [0]);
				gl .vertexAttribPointer (shader .texCoord, 4, gl .FLOAT, false, 0, 0);
			}

			if (shader .normal >= 0)
			{
				gl .enableVertexAttribArray (shader .normal);
				gl .bindBuffer (gl .ARRAY_BUFFER, this .normalBuffer);
				gl .vertexAttribPointer (shader .normal, 3, gl .FLOAT, false, 0, 0);
			}

			gl .enableVertexAttribArray (shader .vertex);
			gl .bindBuffer (gl .ARRAY_BUFFER, this .vertexBuffer);
			gl .vertexAttribPointer (shader .vertex, 4, gl .FLOAT, false, 0, 0);

			// Draw depending on wireframe, solid and transparent.

			if (shader .wireframe)
			{
				// Wireframes are always solid so only one drawing call is needed.

				for (var i = 0, length = this .vertexCount; i < length; i += 3)
					gl .drawArrays (shader .primitiveMode, i, 3);
			}
			else
			{
				var positiveScale = Matrix4 .prototype .determinant3 .call (context .modelViewMatrix) > 0;

				gl .frontFace (positiveScale ? this .frontFace : (this .frontFace === gl .CCW ? gl .CW : gl .CCW));

				if (context .transparent && ! this .solid)
				{
					gl .enable (gl .CULL_FACE);
					gl .cullFace (gl .FRONT);
					gl .drawArrays (shader .primitiveMode, 0, this .vertexCount);		

					gl .cullFace (gl .BACK);
					gl .drawArrays (shader .primitiveMode, 0, this .vertexCount);		
				}
				else
				{
					if (this .solid)
						gl .enable (gl .CULL_FACE);
					else
						gl .disable (gl .CULL_FACE);

					gl .drawArrays (shader .primitiveMode, 0, this .vertexCount);
				}
			}

			if (shader .color    >= 0) gl .disableVertexAttribArray (shader .color);
			if (shader .texCoord >= 0) gl .disableVertexAttribArray (shader .texCoord);
			if (shader .normal   >= 0) gl .disableVertexAttribArray (shader .normal);
			gl .disableVertexAttribArray (shader .vertex);
		},
		displayParticles: function (context, particles, numParticles)
		{
			var
				browser = this .getBrowser (),
				gl      = browser .getContext (),
				shader  = browser .getShader ();

			if (shader .vertex < 0 || this .vertexCount === 0)
				return;

			// Setup shader.

			context .geometryType  = this .geometryType;
			context .colorMaterial = this .colors .length;
			shader .setLocalUniforms (context);

			// Setup vertex attributes.

			if (this .colors .length && shader .color >= 0)
			{
				gl .enableVertexAttribArray (shader .color);
				gl .bindBuffer (gl .ARRAY_BUFFER, this .colorBuffer);
				gl .vertexAttribPointer (shader .color, 4, gl .FLOAT, false, 0, 0);
			}

			if (shader .texCoord >= 0)
			{
				gl .enableVertexAttribArray (shader .texCoord);
				gl .bindBuffer (gl .ARRAY_BUFFER, this .texCoordBuffers [0]);
				gl .vertexAttribPointer (shader .texCoord, 4, gl .FLOAT, false, 0, 0);
			}

			if (shader .normal >= 0)
			{
				gl .enableVertexAttribArray (shader .normal);
				gl .bindBuffer (gl .ARRAY_BUFFER, this .normalBuffer);
				gl .vertexAttribPointer (shader .normal, 3, gl .FLOAT, false, 0, 0);
			}

			gl .enableVertexAttribArray (shader .vertex);
			gl .bindBuffer (gl .ARRAY_BUFFER, this .vertexBuffer);
			gl .vertexAttribPointer (shader .vertex, 4, gl .FLOAT, false, 0, 0);

			// Draw depending on wireframe, solid and transparent.

			var
				materialNode    = browser .getMaterial (),
				lighting        = materialNode || shader .getCustom (),
				normalMatrix    = shader .normalMatrixArray,
				modelViewMatrix = context .modelViewMatrix,
				x               = modelViewMatrix [12],
				y               = modelViewMatrix [13],
				z               = modelViewMatrix [14];

			if (shader .wireframe)
			{
				// Wireframes are always solid so only one drawing call is needed.

				for (var p = 0; p < numParticles; ++ p)
				{
					modelViewMatrix [12] = x;
					modelViewMatrix [13] = y;
					modelViewMatrix [14] = z;
	
					Matrix4 .prototype .translate .call (modelViewMatrix, particles [p] .position);
	
					if (lighting)
					{
						// Set normal matrix.
						normalMatrix [0] = modelViewMatrix [0]; normalMatrix [1] = modelViewMatrix [4]; normalMatrix [2] = modelViewMatrix [ 8];
						normalMatrix [3] = modelViewMatrix [1]; normalMatrix [4] = modelViewMatrix [5]; normalMatrix [5] = modelViewMatrix [ 9];
						normalMatrix [6] = modelViewMatrix [2]; normalMatrix [7] = modelViewMatrix [6]; normalMatrix [8] = modelViewMatrix [10];
						Matrix3 .prototype .inverse .call (normalMatrix);
						gl .uniformMatrix3fv (shader .normalMatrix, false, normalMatrix);
					}
	
					gl .uniformMatrix4fv (shader .modelViewMatrix, false, modelViewMatrix);
	
					for (var i = 0, length = this .vertexCount; i < length; i += 3)
						gl .drawArrays (shader .primitiveMode, i, 3);
				}
			}
			else
			{
				var positiveScale = Matrix4 .prototype .determinant3 .call (context .modelViewMatrix) > 0;

				gl .frontFace (positiveScale ? this .frontFace : (this .frontFace === gl .CCW ? gl .CW : gl .CCW));

				if (context .transparent && ! this .solid)
				{
					for (var p = 0; p < numParticles; ++ p)
					{
						modelViewMatrix [12] = x;
						modelViewMatrix [13] = y;
						modelViewMatrix [14] = z;

						Matrix4 .prototype .translate .call (modelViewMatrix, particles [p] .position);

						if (lighting)
						{
							// Set normal matrix.
							normalMatrix [0] = modelViewMatrix [0]; normalMatrix [1] = modelViewMatrix [4]; normalMatrix [2] = modelViewMatrix [ 8];
							normalMatrix [3] = modelViewMatrix [1]; normalMatrix [4] = modelViewMatrix [5]; normalMatrix [5] = modelViewMatrix [ 9];
							normalMatrix [6] = modelViewMatrix [2]; normalMatrix [7] = modelViewMatrix [6]; normalMatrix [8] = modelViewMatrix [10];
							Matrix3 .prototype .inverse .call (normalMatrix);
							gl .uniformMatrix3fv (shader .normalMatrix, false, normalMatrix);
						}

						gl .uniformMatrix4fv (shader .modelViewMatrix, false, modelViewMatrix);

						gl .enable (gl .CULL_FACE);
						gl .cullFace (gl .FRONT);
						gl .drawArrays (shader .primitiveMode, 0, this .vertexCount);
	
						gl .cullFace (gl .BACK);
						gl .drawArrays (shader .primitiveMode, 0, this .vertexCount);
					}	
				}
				else
				{
					if (this .solid)
						gl .enable (gl .CULL_FACE);
					else
						gl .disable (gl .CULL_FACE);

					for (var p = 0; p < numParticles; ++ p)
					{
						modelViewMatrix [12] = x;
						modelViewMatrix [13] = y;
						modelViewMatrix [14] = z;

						Matrix4 .prototype .translate .call (modelViewMatrix, particles [p] .position);

						if (materialNode || shader .getCustom ())
						{
							// Set normal matrix.
							normalMatrix [0] = modelViewMatrix [0]; normalMatrix [1] = modelViewMatrix [4]; normalMatrix [2] = modelViewMatrix [ 8];
							normalMatrix [3] = modelViewMatrix [1]; normalMatrix [4] = modelViewMatrix [5]; normalMatrix [5] = modelViewMatrix [ 9];
							normalMatrix [6] = modelViewMatrix [2]; normalMatrix [7] = modelViewMatrix [6]; normalMatrix [8] = modelViewMatrix [10];
							Matrix3 .prototype .inverse .call (normalMatrix);
							gl .uniformMatrix3fv (shader .normalMatrix, false, normalMatrix);
						}

						gl .uniformMatrix4fv (shader .modelViewMatrix, false, modelViewMatrix);

						gl .drawArrays (shader .primitiveMode, 0, this .vertexCount);
					}
				}
			}

			if (shader .color    >= 0) gl .disableVertexAttribArray (shader .color);
			if (shader .texCoord >= 0) gl .disableVertexAttribArray (shader .texCoord);
			if (shader .normal   >= 0) gl .disableVertexAttribArray (shader .normal);
			gl .disableVertexAttribArray (shader .vertex);
		},
		collision: function (shader)
		{
			var
				browser = this .getBrowser (),
				gl      = browser .getContext ();

			// Setup vertex attributes.

			gl .enableVertexAttribArray (shader .vertex);
			gl .bindBuffer (gl .ARRAY_BUFFER, this .vertexBuffer);
			gl .vertexAttribPointer (shader .vertex, 4, gl .FLOAT, false, 0, 0);

			gl .drawArrays (this .primitiveMode, 0, this .vertexCount);

			gl .disableVertexAttribArray (shader .vertex);
		},
		intersectsLine: function (line, intersections, invModelViewMatrix)
		{
			try
			{
				var intersected = false;

				if (this .intersectsBBox (line))
				{
				   this .transformLine (line); // Apply screen transformations.

					var
						texCoords = this .texCoords [0],
						normals   = this .normals,
						vertices  = this .vertices,
						uvt       = this .uvt,
						v0        = this .v0,
						v1        = this .v1,
						v2        = this .v2;

					for (var i = 0, length = this .vertexCount; i < length; i += 3)
					{
						var i4 = i * 4;

						v0 .x = vertices [i4 + 0]; v0 .y = vertices [i4 + 1]; v0 .z = vertices [i4 +  2];
						v1 .x = vertices [i4 + 4]; v1 .y = vertices [i4 + 5]; v1 .z = vertices [i4 +  6];
						v2 .x = vertices [i4 + 8]; v2 .y = vertices [i4 + 9]; v2 .z = vertices [i4 + 10];

						if (line .intersectsTriangle (v0, v1, v2, uvt))
						{
							// Get barycentric coordinates.

							var
								u = uvt .u,
								v = uvt .v,
								t = 1 - u - v;

							// Determine vectors for X3DPointingDeviceSensors.

							var point = new Vector3 (t * vertices [i4 + 0] + u * vertices [i4 + 4] + v * vertices [i4 +  8],
							                         t * vertices [i4 + 1] + u * vertices [i4 + 5] + v * vertices [i4 +  9],
							                         t * vertices [i4 + 2] + u * vertices [i4 + 6] + v * vertices [i4 + 10]);

							if (this .isClipped (point, invModelViewMatrix))
								continue;

							var texCoord = new Vector2 (t * texCoords [i4 + 0] + u * texCoords [i4 + 4] + v * texCoords [i4 + 8],
							                            t * texCoords [i4 + 1] + u * texCoords [i4 + 5] + v * texCoords [i4 + 9]);

							var i3 = i * 3;

							var normal = new Vector3 (t * normals [i3 + 0] + u * normals [i3 + 3] + v * normals [i3 + 6],
							                          t * normals [i3 + 1] + u * normals [i3 + 4] + v * normals [i3 + 7],
							                          t * normals [i3 + 2] + u * normals [i3 + 5] + v * normals [i3 + 8]);

							intersections .push ({ texCoord: texCoord, normal: normal, point: this .getMatrix () .multVecMatrix (point) });
							intersected = true;
						}
					}
				}

				return intersected;
			}
			catch (error)
			{
				console .log (error);
				return false;
			}
		},
		intersectsBBox: function (line)
		{
			var
				planes       = this .planes,
				min          = this .min,
				max          = this .max,
				minX         = min .x,
				maxX         = max .x,
				maxZ         = max .x,
				minY         = min .y,
				maxY         = max .y,
				minZ         = min .z,
				maxZ         = max .z,
				intersection = this .intersection;

		   // front
			if (planes [0] .intersectsLine (line, intersection))
			{
				if (intersection .x >= minX && intersection .x <= maxX &&
				    intersection .y >= minY && intersection .y <= maxY)
					return true;
			}

			// back
			if (planes [1] .intersectsLine (line, intersection))
			{
				if (intersection .x >= minX && intersection .x <= maxX &&
				    intersection .y >= minY && intersection .y <= maxY)
					return true;
			}

			// top
			if (planes [2] .intersectsLine (line, intersection))
			{
				if (intersection .x >= minX && intersection .x <= maxX &&
				    intersection .z >= minZ && intersection .z <= maxZ)
					return true;
			}

			// bottom
			if (planes [3] .intersectsLine (line, intersection))
			{
				if (intersection .x >= minX && intersection .x <= maxX &&
				    intersection .z >= minZ && intersection .z <= maxZ)
					return true;
			}

			// right
			if (planes [4] .intersectsLine (line, intersection))
			{
				if (intersection .y >= minY && intersection .y <= maxY &&
				    intersection .z >= minZ && intersection .z <= maxZ)
					return true;
			}

			return false;
		},
		getMatrix: function ()
		{
			return Matrix4 .Identity;
		},
		transformLine: function (line)
		{
			// Apply sceen nodes transformation in place here.
		},
		isClipped: function (point, invModelViewMatrix)
		{
			return ! this .getCurrentLayer () .getClipPlanes () .every (function (clipPlane)
			{
				return ! clipPlane .isClipped (point, invModelViewMatrix);
			});
		},
		intersectsSphere: function (sphere)
		{
			var
				vertices = this .vertices,
				v0       = this .v0,
				v1       = this .v1,
				v2       = this .v2;

			for (var i = 0, length = this .vertexCount; i < length; i += 3)
			{
				var i4 = i * 4;

				v0 .x = vertices [i4 + 0]; v0 .y = vertices [i4 + 1]; v0 .z = vertices [i4 +  2];
				v1 .x = vertices [i4 + 4]; v1 .y = vertices [i4 + 5]; v1 .z = vertices [i4 +  6];
				v2 .x = vertices [i4 + 8]; v2 .y = vertices [i4 + 9]; v2 .z = vertices [i4 + 10];

				if (sphere .intersectsTriangle (v0, v1, v2))
				   return true;
		   }

		   return false;
		},
	});

	return X3DGeometryNode;
});

