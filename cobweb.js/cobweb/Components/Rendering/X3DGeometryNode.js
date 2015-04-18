
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Components/Core/X3DNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Color3",
	"standard/Math/Numbers/Vector2",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Matrix4",
	"standard/Math/Geometry/Box3",
	"standard/Math/Geometry/Plane3",
],
function ($,
          Fields,
          X3DNode,
          X3DConstants,
          Color3,
          Vector2,
          Vector3,
          Matrix4,
          Box3,
          Plane3)
{
	with (Fields)
	{
		// Box normals for bbox / line intersection.
		var boxNormals = [
			new Vector3 (0,  0,  1), // front
			new Vector3 (0,  0, -1), // back
			new Vector3 (0,  1,  0), // top
			new Vector3 (0, -1,  0), // bottom
			new Vector3 (1,  0,  0)  // right
			// left: We do not have to test for left.
		];

		function X3DGeometryNode (browser, executionContext)
		{
			X3DNode .call (this, browser, executionContext);

			this .addType (X3DConstants .X3DGeometryNode);
		}

		X3DGeometryNode .prototype = $.extend (new X3DNode (),
		{
			constructor: X3DGeometryNode,
			intersection: new Vector3 (0, 0, 0),
			uvt: new Vector3 (0, 0, 0),
			v0: new Vector3 (0, 0, 0),
			v1: new Vector3 (0, 0, 0),
			v2: new Vector3 (0, 0, 0),
			setup: function ()
			{
				this .setTainted (true);
			
				X3DNode .prototype .setup .call (this);

				this .addInterest (this, "update");
				this .update ();

				this .setTainted (false);
			},
			initialize: function ()
			{
				X3DNode .prototype .initialize .call (this);

				this .addChildren ("transparent", new SFBool (false));

				var gl = this .getBrowser () .getContext ();
		
				this .min       = new Vector3 (0, 0, 0);
				this .max       = new Vector3 (0, 0, 0);
				this .bbox      = new Box3 (this .min, this .max, true);
				this .solid     = true;
				this .frontFace = 0;
				this .colors    = [ ];
				this .texCoords = [ ];
				this .normals   = [ ];
				this .vertices  = [ ];
				this .count     = 0;

				this .frontFace       = gl .CCW;
				this .colorBuffer     = gl .createBuffer ();
				this .texCoordBuffers = [ ];
				this .normalBuffer    = gl .createBuffer ();
				this .vertexBuffer    = gl .createBuffer ();
				this .planes          = [ ];
			},
			isTransparent: function ()
			{
				return false;
			},
			isLineGeometry: function ()
			{
				return false;
			},
			getBBox: function ()
			{
				return this .bbox;
			},
			setExtents: function (extents)
			{
				this .min .assign (extents [0]);
				this .max .assign (extents [1]);
			},
			getExtents: function ()
			{
				return [this .min, this .max];
			},
			getMatrix: function ()
			{
				return Matrix4 .Identity;
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
				this .colors = value;
			},
			getColors: function ()
			{
				return this .colors;
			},
			setTexCoords: function (value)
			{
				this .texCoords = value;
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
				this .normals = value;
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
				this .vertices = value;
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
					texCoords = [ ],
					vertices  = this .vertices;

				this .texCoords .push (texCoords);

				for (var i = 0; i < this .vertices .length; i += 4)
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
					p     = { },
					bbox  = this .getBBox (),
					size  = bbox .size,
					Xsize = size .x,
					Ysize = size .y,
					Zsize = size .z;

				p .min = bbox .center .subtract (size .divide (2));

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
					cosCreaseAngle = Math .cos (creaseAngle),
					normals_       = [ ];

				for (var i in normalIndex) // Don't use forEach
				{
					var vertex = normalIndex [i];

					for (var p = 0; p < vertex .length; ++ p)
					{
						var
							P = vertex [p],
							m = normals [P],
							n = new Vector3 (0, 0, 0);

						for (var q = 0; q < vertex .length; ++ q)
						{
							var Q = vertex [q];
		
							if (normals [Q] .dot (m) >= cosCreaseAngle)
								n .add (normals [Q]);
						}

						normals_ [P] = n .normalize ();
					}
				}

				return normals_;
			},
			update: function ()
			{
				this .clear ();
				this .build ();

				if (this .vertices .length)
					this .bbox .setExtents (this .min, this .max);
				else
					this .bbox .setExtents (this .min .set (0, 0, 0), this .max .set (0, 0, 0));

				if (! this .isLineGeometry ())
				{
					for (var i = 0; i < 5; ++ i)
						this .planes [i] = new Plane3 (i % 2 ? this .min : this .max, boxNormals [i]);

					if (this .texCoords .length === 0)
						this .buildTexCoords ();
				}

				this .transfer ();
			},
			clear: function ()
			{
				this .min .set (Number .POSITIVE_INFINITY, Number .POSITIVE_INFINITY, Number .POSITIVE_INFINITY);
				this .max .set (Number .NEGATIVE_INFINITY, Number .NEGATIVE_INFINITY, Number .NEGATIVE_INFINITY);

				this .colors    .length = 0;
				this .texCoords .length = 0;
				this .normals   .length = 0;
				this .vertices  .length = 0;
			},
			transfer: function ()
			{
				var gl    = this .getBrowser () .getContext ();
				var count = this .vertices .length / 4;

				// Transfer colors.

				if (this .colors .length)
				{
					gl .bindBuffer (gl .ARRAY_BUFFER, this .colorBuffer);
					gl .bufferData (gl .ARRAY_BUFFER, new Float32Array (this .colors), gl .STATIC_DRAW);
					this .currentColorBuffer = this .colorBuffer;
				}
				else
				{
					this .getBrowser () .setDefaultColorBuffer (count * 4);
					this .currentColorBuffer = this .getBrowser () .getDefaultColorBuffer ();
				}

				// Transfer texCoords.

				for (var i = this .texCoordBuffers .length; i < this .texCoords .length; ++ i)
					this .texCoordBuffers .push (gl .createBuffer ());

				this .texCoordBuffers .length = this .texCoords .length;
				
				for (var i = 0; i < this .texCoords .length; ++ i)
				{
					gl .bindBuffer (gl .ARRAY_BUFFER, this .texCoordBuffers [i]);
					gl .bufferData (gl .ARRAY_BUFFER, new Float32Array (this .texCoords [i]), gl .STATIC_DRAW);
				}

				// Transfer normals.

				gl .bindBuffer (gl .ARRAY_BUFFER, this .normalBuffer);
				gl .bufferData (gl .ARRAY_BUFFER, new Float32Array (this .normals), gl .STATIC_DRAW);

				// Transfer vertices.

				gl .bindBuffer (gl .ARRAY_BUFFER, this .vertexBuffer);
				gl .bufferData (gl .ARRAY_BUFFER, new Float32Array (this .vertices), gl .STATIC_DRAW);
				this .count = count;
	  		},
			traverse: function (context)
			{
				context .colorMaterial = this .colors .length;

				var
					browser = this .getBrowser (),
					gl      = browser .getContext (),
					shader  = browser .getShader ();

				// Shader

				shader .setLocalUniforms (context);

				//

				if (shader .color >= 0)
				{
					gl .enableVertexAttribArray (shader .color);
					gl .bindBuffer (gl .ARRAY_BUFFER, this .currentColorBuffer);
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

				if (shader .position >= 0)
				{
					gl .enableVertexAttribArray (shader .position);
					gl .bindBuffer (gl .ARRAY_BUFFER, this .vertexBuffer);
					gl .vertexAttribPointer (shader .position, 4, gl .FLOAT, false, 0, 0);

					if (shader .wireframe || this .isLineGeometry ())
					{
						if (this .isLineGeometry ())
							gl .drawArrays (shader .primitiveMode, 0, this .count);

						else
						{
							for (var i = 0; i < this .count; i += 3)
								gl .drawArrays (shader .primitiveMode, i, 3);
						}
					}
					else
					{
						var positiveScale = Matrix4 .prototype .determinant3 .call (context .modelViewMatrix) > 0;

						gl .frontFace (positiveScale ? this .frontFace : (this .frontFace === gl .CCW ? gl .CW : gl .CCW));

						if (context .transparent && ! this .solid)
						{
							gl .enable (gl .CULL_FACE);

							gl .cullFace (gl .FRONT);
							gl .drawArrays (shader .primitiveMode, 0, this .count);		

							gl .cullFace (gl .BACK);
							gl .drawArrays (shader .primitiveMode, 0, this .count);		
						}
						else
						{
							if (this .solid)
								gl .enable (gl .CULL_FACE);
							else
								gl .disable (gl .CULL_FACE);

							gl .drawArrays (shader .primitiveMode, 0, this .count);
						}
					}
				}

				gl .disableVertexAttribArray (shader .color);
				gl .disableVertexAttribArray (shader .texCoord);
				gl .disableVertexAttribArray (shader .normal);
				gl .disableVertexAttribArray (shader .position);
			},
			intersectsLine: function (line, intersections)
			{
				try
				{
					var intersected = false;

					this .transformLine (line); // Transform line with matrix from screen nodes.

					if (this .intersectsBBox (line))
					{
						//var modelViewMatrix = Matrix4 .multRight (this .getMatrix (), this .getBrowser () .getModelViewMatrix () .get ()) // This matrix is for clipping only.

						var
							texCoords = this .texCoords [0],
							normals   = this .normals,
							vertices  = this .vertices,
							uvt       = this .uvt,
							v0        = this .v0,
							v1        = this .v1,
							v2        = this .v2;

						for (var i = 0, length = this .count; i < length; i += 3)
						{
							var i4 = i * 4;

							v0 .x = vertices [i4 + 0]; v0 .y = vertices [i4 + 1]; v0 .z = vertices [i4 +  2];
							v1 .x = vertices [i4 + 4]; v1 .y = vertices [i4 + 5]; v1 .z = vertices [i4 +  6];
							v2 .x = vertices [i4 + 8]; v2 .y = vertices [i4 + 9]; v2 .z = vertices [i4 + 10];

							if (line .intersectsTriangle (v0, v1, v2, uvt))
							{
								// Get barycentric coordinates.

								var
									u = uvt .x,
									v = uvt .y,
									t = 1 - u - v;

								// Determine vectors for X3DPointingDeviceSensors.

								var point = new Vector3 (t * vertices [i4 + 0] + u * vertices [i4 + 4] + v * vertices [i4 +  8],
							                            t * vertices [i4 + 1] + u * vertices [i4 + 5] + v * vertices [i4 +  9],
							                            t * vertices [i4 + 2] + u * vertices [i4 + 6] + v * vertices [i4 + 10]);

								//if (this .isClipped (point, modelViewMatrix))
								//	return continue;

								var texCoord = new Vector2 (t * texCoords [i4 + 0] + u * texCoords [i4 + 4] + v * texCoords [i4 + 8],
								                            t * texCoords [i4 + 1] + u * texCoords [i4 + 5] + v * texCoords [i4 + 9]);

								var i3 = i * 3;

								var normal = new Vector3 (t * normals [i3 + 0] + u * normals [i3 + 3] + v * normals [i3 + 6],
								                          t * normals [i3 + 1] + u * normals [i3 + 4] + v * normals [i3 + 7],
								                          t * normals [i3 + 2] + u * normals [i3 + 5] + v * normals [i3 + 8]);

								intersections .push ({ texCoord: texCoord, normal: normal, point: point });
								intersected = true;
							}
						}
					}

					return intersected;
				}
				catch (error)
				{
					//console .log (error);
					return false;
				}
			},
			intersectsBBox: function (line)
			{
				var
					planes       = this .planes,
					min          = this .min,
					max          = this .max,
					intersection = this .intersection;

				if (planes [0] .intersectsLine (line, intersection))
				{
					if (intersection .x >= min .x && intersection .x <= max .x &&
					    intersection .y >= min .y && intersection .y <= max .y)
						return true;
				}

				if (planes [1] .intersectsLine (line, intersection))
				{
					if (intersection .x >= min .x && intersection .x <= max .x &&
					    intersection .y >= min .y && intersection .y <= max .y)
						return true;
				}

				if (planes [2] .intersectsLine (line, intersection))
				{
					if (intersection .x >= min .x && intersection .x <= max .x &&
					    intersection .z >= min .z && intersection .z <= max .z)
						return true;
				}

				if (planes [3] .intersectsLine (line, intersection))
				{
					if (intersection .x >= min .x && intersection .x <= max .x &&
					    intersection .z >= min .z && intersection .z <= max .z)
						return true;
				}

				if (planes [4] .intersectsLine (line, intersection))
				{
					if (intersection .y >= min .y && intersection .y <= max .y &&
					    intersection .z >= min .z && intersection .z <= max .z)
						return true;
				}

				return false;
			},
			transformLine: function (line)
			{
				//line .multLineMatrix (Matrix4 .inverse (this .getMatrix ()));
			},
		});

		return X3DGeometryNode;
	}
});
