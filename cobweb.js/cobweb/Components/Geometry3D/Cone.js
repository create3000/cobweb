
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Rendering/X3DGeometryNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Complex",
	"standard/Math/Numbers/Vector2",
	"standard/Math/Numbers/Vector3",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DGeometryNode, 
          X3DConstants,
          Complex,
          Vector2,
          Vector3)
{
	with (Fields)
	{
		function Cone (executionContext)
		{
			X3DGeometryNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .Cone);
		}

		Cone .prototype = $.extend (new X3DGeometryNode (),
		{
			constructor: Cone,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",     new SFNode ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "side",         new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bottom",       new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "height",       new SFFloat (2)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bottomRadius", new SFFloat (1)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "solid",        new SFBool (true)),
			]),
			getTypeName: function ()
			{
				return "Cone";
			},
			getComponentName: function ()
			{
				return "Geometry3D";
			},
			getContainerField: function ()
			{
				return "geometry";
			},
			build: function ()
			{
				var
					options      = this .getBrowser () .getConeOptions (),
					vDimension   = options .vDimension_ .getValue (),
					height       = this .height_ .getValue (),
					bottomRadius = this .bottomRadius_ .getValue (),
					texCoords    = [ ],
					normals      = [ ],
					vertices     = [ ];

				this .getTexCoords () .push (texCoords);

				var
					y1 = height / 2,
					y2 = -y1,
					nz = Complex .Polar (1, -Math .PI / 2 + Math .atan (bottomRadius / height));

				if (this .side_ .getValue ())
				{
					for (var i = 0; i < vDimension; ++ i)
					{
						var
							u1     = (i + 0.5) / vDimension,
							theta1 = 2 * Math .PI * u1,
							n1     = Complex .Polar (nz .imag, theta1);

						var
							u2     = i / vDimension,
							theta2 = 2 * Math .PI * u2,
							p2     = Complex .Polar (-bottomRadius, theta2),
							n2     = Complex .Polar (nz .imag, theta2);

						var
							u3     = (i + 1) / vDimension,
							theta3 = 2 * Math .PI * u3,
							p3     = Complex .Polar (-bottomRadius, theta3),
							n3     = Complex .Polar (nz .imag, theta3);

						/*    p1
						 *   /  \
						 *  /    \
						 * p2 -- p3
						 */

						// p1
						texCoords .push (u1, 1, 0, 1);
						normals .push (n1 .imag, nz .real, n1 .real);
						vertices .push (0, y1, 0, 1);

						// p2
						texCoords .push (u2, 0, 0, 1);
						normals .push (n2 .imag, nz .real, n2 .real);
						vertices .push (p2 .imag, y2, p2 .real, 1);

						// p3
						texCoords .push (u3, 0, 0, 1);
						normals .push (n3 .imag , nz .real, n3 .real);
						vertices .push (p3 .imag, y2, p3 .real, 1);
					}
				}

				if (this .bottom_ .getValue ())
				{
					var
						texCoord = [ ],
						points   = [ ];

					for (var i = vDimension - 1; i > -1; -- i)
					{
						var
							u     = i / vDimension,
							theta = 2 * Math .PI * u,
							t     = Complex .Polar (-1, theta),
							p     = Complex .multiply (t, bottomRadius);

						texCoord .push (new Vector2 ((t .imag + 1) / 2, (t .real + 1) / 2));
						points .push (new Vector3 (p .imag, y2, p .real));
					}

					var
						t0 = texCoord [0],
						p0 = points [0];

					for (var i = 1, length = points .length - 1; i < length; ++ i)
					{
						var
							t1 = texCoord [i],
							t2 = texCoord [i + 1],
							p1 = points [i],
							p2 = points [i + 1];

						texCoords .push (t0 .x, t0 .y, 0, 1);
						normals .push (0, -1, 0);
						vertices .push (p0 .x, p0 .y, p0 .z, 1);

						texCoords .push (t1 .x, t1 .y, 0, 1);
						normals .push (0, -1, 0);
						vertices .push (p1 .x, p1 .y, p1 .z, 1);

						texCoords .push (t2 .x, t2 .y, 0, 1);
						normals .push (0, -1, 0);
						vertices .push (p2 .x, p2 .y, p2 .z, 1);
					}
				}

				this .setSolid (this .solid_ .getValue ());
				this .setCurrentTexCoord (null);
				this .setNormals (normals);
				this .setVertices (vertices);
				this .setExtents (this .createExtents ());
			},
			createExtents: function ()
			{
				var
					bottomRadius = this .bottomRadius_ .getValue (),
					y1           = this .height_ .getValue () / 2,
					y2           = -y1;

				if (! this .side_ .getValue () && ! this .bottom_ .getValue ())
					return [new Vector3 (0, 0, 0), new Vector3 (0, 0, 0)];

				else if (! this .side_ .getValue ())
					return [new Vector3 (-bottomRadius, y2, -bottomRadius), new Vector3 (bottomRadius, y2, bottomRadius)];

				else
					return [new Vector3 (-bottomRadius, y2, -bottomRadius), new Vector3 (bottomRadius, y1, bottomRadius)];
			},
		});

		return Cone;
	}
});

