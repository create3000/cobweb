
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Components/Core/X3DNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Color3",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Matrix4",
	"standard/Math/Geometry/Box3",
],
function ($, Fields, X3DNode, X3DConstants, Color3, Vector3, Matrix4, Box3)
{
	with (Fields)
	{
		function X3DGeometryNode (browser, executionContext)
		{
			X3DNode .call (this, browser, executionContext);

			this .min       = new Vector3 (0, 0, 0);
			this .max       = new Vector3 (0, 0, 0);
			this .bbox      = new Box3 ();
			this .solid     = true;
			this .frontFace = 0;
			this .colors    = [ ];
			this .texCoords = [ ];
			this .normals   = [ ];
			this .vertices  = [ ];
			this .count     = 0;

			this .addType (X3DConstants .X3DGeometryNode);
		}

		X3DGeometryNode .prototype = $.extend (new X3DNode (),
		{
			constructor: X3DGeometryNode,
			setup: function ()
			{
				X3DNode .prototype .setup .call (this);
		
				this .addInterest (this, "update");

				this .update ();
			},
			initialize: function ()
			{
				X3DNode .prototype .initialize .call (this);

				this .addChildren ("transparent", new SFBool (false));

				var gl = this .getBrowser () .getContext ();

				this .frontFace       = gl .CCW;
				this .colorBuffer     = gl .createBuffer ();
				this .texCoordBuffers = [ ];
				this .normalBuffer    = gl .createBuffer ();
				this .vertexBuffer    = gl .createBuffer ();
				this .primitiveMode   = gl .TRIANGLES;
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
			setPrimitiveMode: function (value)
			{
				this .primitiveMode = this .getBrowser () .getContext () [value];
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

				this .bbox = this .vertices .length ? new Box3 (this .min, this .max, true) : new Box3 ();

				if (! this .isLineGeometry ())
				{
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

				shader .setDefaultUniforms (context);

				//

				var vertexAttribIndex = 0;

				if (shader .color >= 0)
				{
					gl .enableVertexAttribArray (vertexAttribIndex ++);
					gl .bindBuffer (gl .ARRAY_BUFFER, this .currentColorBuffer);
					gl .vertexAttribPointer (shader .color, 4, gl .FLOAT, false, 0, 0);
				}

				if (shader .texCoord >= 0)
				{
					gl .enableVertexAttribArray (vertexAttribIndex ++);
					gl .bindBuffer (gl .ARRAY_BUFFER, this .texCoordBuffers [0]);
					gl .vertexAttribPointer (shader .texCoord, 4, gl .FLOAT, false, 0, 0);
				}

				if (shader .normal >= 0)
				{
					gl .enableVertexAttribArray (vertexAttribIndex ++);
					gl .bindBuffer (gl .ARRAY_BUFFER, this .normalBuffer);
					gl .vertexAttribPointer (shader .normal, 3, gl .FLOAT, false, 0, 0);
				}

				if (shader .position >= 0)
				{
					gl .enableVertexAttribArray (vertexAttribIndex ++);
					gl .bindBuffer (gl .ARRAY_BUFFER, this .vertexBuffer);
					gl .vertexAttribPointer (shader .position, 4, gl .FLOAT, false, 0, 0);
				}

				if (vertexAttribIndex)
				{
					var positiveScale = Matrix4 .prototype .determinant3 .call (context .modelViewMatrix) > 0;

					gl .frontFace (positiveScale ? this .frontFace : (this .frontFace === gl .CCW ? gl .CW : gl .CCW));

					if (context .transparent && ! this .solid)
					{
						gl .enable (gl .CULL_FACE);

						gl .cullFace (gl .FRONT);
						gl .drawArrays (this .primitiveMode, 0, this .count);		

						gl .cullFace (gl .BACK);
						gl .drawArrays (this .primitiveMode, 0, this .count);		
					}
					else
					{
						if (this .solid)
							gl .enable (gl .CULL_FACE);
						else
							gl .disable (gl .CULL_FACE);

						gl .drawArrays (this .primitiveMode, 0, this .count);
					}

					for (var i = 0; i < vertexAttribIndex; ++ i)
						gl .disableVertexAttribArray (i);
				}
			},
		});

		return X3DGeometryNode;
	}
});
