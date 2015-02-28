
// https://github.com/r3mi/poly2tri.js

define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Rendering/X3DComposedGeometryNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector3",
	"poly2tri",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DComposedGeometryNode, 
          X3DConstants,
          Vector3,
          poly2tri)
{
	with (Fields)
	{
		function IndexedFaceSet (executionContext)
		{
			X3DComposedGeometryNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .IndexedFaceSet);
		}

		IndexedFaceSet .prototype = $.extend (new X3DComposedGeometryNode (),
		{
			constructor: IndexedFaceSet,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",        new SFNode ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "solid",           new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "ccw",             new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "convex",          new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "creaseAngle",     new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "colorPerVertex",  new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "normalPerVertex", new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "texCoordIndex",   new MFInt32 ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "colorIndex",      new MFInt32 ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "normalIndex",     new MFInt32 ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "coordIndex",      new MFInt32 ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "attrib",          new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "fogCoord",        new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "color",           new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "texCoord",        new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "normal",          new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "coord",           new SFNode ()),
			]),
			getTypeName: function ()
			{
				return "IndexedFaceSet";
			},
			getComponentName: function ()
			{
				return "Geometry3D";
			},
			getContainerField: function ()
			{
				return "geometry";
			},
			getTexCoordPerVertexIndex: function (index)
			{
				if (index < this .texCoordIndex_ .length)
					return this .texCoordIndex_ [index];

				return this .coordIndex_ [index];
			},
			getColorPerVertexIndex: function (index)
			{
				if (index < this .colorIndex_ .length)
					return this .colorIndex_ [index];

				return this .coordIndex_ [index];
			},
			getColorIndex: function (index)
			{
				if (index < this .colorIndex_ .length)
					return this .colorIndex_ [index];

				return index;
			},
			getNormalPerVertexIndex: function (index)
			{
				if (index < this .normalIndex_ .length)
					return this .normalIndex_ [index];

				return this .coordIndex_ [index];
			},
			getNormalIndex: function (index)
			{
				if (index < this .normalIndex_ .length)
					return this .normalIndex_ [index];

				return index;
			},
			build: function ()
			{
				// Triangulate
				var polygons = this .triangulate ();

				// Build arrays

				if (polygons .length === 0)
					return;

				// Fill GeometryNode

				var face = 0;

				for (var p = 0; p < polygons .length; ++ p)
				{
					var polygon = polygons [p];

					for (var t = 0; t < polygon .triangles .length; ++ t)
					{
						var triangle = polygon .triangles [t];

						for (var v = 0; v < triangle .length; ++ v)
						{
							var i     = triangle [v];
							var index = this .coordIndex_ [i];

/*
							if (getTexCoord ())
								getTexCoord () -> addTexCoord (getTexCoords (), getTexCoordIndex (i));

							if (getColor ())
							{
								if (colorPerVertex ())
									getColor () -> addColor (getColors (), getColorIndex (i, true));

								else
									getColor () -> addColor (getColors (), getColorIndex (face));
							}
*/
							if (this .getNormal ())
							{
								if (this .normalPerVertex_)
									this .addNormal (this .getNormal () .getVector (this .getNormalPerVertexIndex (i)));

								else
									this .addNormal (this .getNormal () .getVector (this .getNormalIndex (face)));
							}

							this .addTriangle (this .getCoord () .getPoint (index));
						}
					}

					++ face;
				}

				// Autogenerate normal if not specified.

				if (! this .getNormal ())
					this .buildNormals (polygons);

				this .setSolid (this .solid_ .getValue ());
				this .setCCW (this .ccw_ .getValue ());
			},
			triangulate: function ()
			{
				var polygons = [ ];

				if (! this .getCoord ())
					return polygons;

				if (this .coordIndex_ .length)
				{
					// Add -1 (polygon end marker) to coordIndex if not present.
					if (this .coordIndex_ [this .coordIndex_ .length - 1] > -1)
						this .coordIndex_ .push (-1);

					// Construct triangle array and determine the number of used points.
					var i = 0;

					polygons .push ({ vertices: [ ], triangles: [ ] });

					for (var c = 0; c < this .coordIndex_ .length; ++ c)
					{
						var index    = this .coordIndex_ [c];
						var vertices = polygons [polygons .length - 1] .vertices;
	
						if (index > -1)
						{
							// Add vertex index.
							vertices .push (i);
						}
						else
						{
							// Negativ index.

							if (vertices .length)
							{
								// Closed polygon.
								if (vertices [0] === vertices [vertices .length - 1])
									vertices .pop ();

								switch (vertices .length)
								{
									case 0:
									case 1:
									case 2:
									{
										vertices .length = 0;
										break;
									}
									case 3:
									{
										// Add polygon with one triangle.
					
										polygons [polygons .length - 1] .triangles .push (vertices);
										polygons .push ({ vertices: [ ], triangles: [ ] });
										break;
									}
									default:
									{
										// Triangulate polygons.

										this .triangulatePolygon (polygons [polygons .length - 1]);

										if (polygons [polygons .length - 1] .triangles .length)
											polygons .push ({ vertices: [ ], triangles: [ ] });
										else
											vertices .length = 0;

										break;
									}
								}
							}
						}

						++ i;
					}

					if (polygons [polygons .length - 1] .triangles .length === 0)
						polygons .pop ();
				}

				return polygons;
			},
			triangulatePolygon: function (polygon)
			{
				var vertices  = polygon .vertices;
				var triangles = polygon .triangles;

				for (var i = 1, size = vertices .length - 1; i < size; ++ i)
					triangles .push ([ vertices [0], vertices [i], vertices [i + 1] ]);
			},
			buildNormals: function (polygons)
			{
				var normals = this .createNormals (polygons);

				for (var p = 0; p < polygons .length; ++ p)
				{
					var triangles = polygons [p] .triangles;
				
					for (var t = 0; t < triangles .length; ++ t)
					{
						var triangle = triangles [t];
					
						for (var v = 0; v < triangle .length; ++ v)
						{
							this .addNormal (normals [triangle [v]]);
						}
					}
				}
			},
			createNormals: function (polygons)
			{
				var normals     = [ ];
				var normalIndex = [ ];
				var normal      = null;

				for (var p = 0; p < polygons .length; ++ p)
				{
					var polygon  = polygons [p]
					var vertices = polygon .vertices;

					switch (vertices .length)
					{
						case 3:
						{
							normal = this .getCoord () .getNormal (this .coordIndex_ [vertices [0]],
							                                       this .coordIndex_ [vertices [1]],
							                                       this .coordIndex_ [vertices [2]]);
							break;
						}
						case 4:
						{
							normal = this .getCoord () .getQuadNormal (this .coordIndex_ [vertices [0]],
							                                           this .coordIndex_ [vertices [1]],
							                                           this .coordIndex_ [vertices [2]],
							                                           this .coordIndex_ [vertices [3]]);
							break;
						}
						default:
						{
							// Determine polygon normal.
							// Or use Newell's method https://www.opengl.org/wiki/Calculating_a_Surface_Normal

							normal = new Vector3 ();

							for (var v = 0, length = vertices .length; v < length; ++ v)
							{
								var n = this .getCoord () .getNormal (this .coordIndex_ [vertices [i]],
									                                   this .coordIndex_ [vertices [(i + 1) % length]],
									                                   this .coordIndex_ [vertices [(i + 2) % length]]);

								normal = normal .add (n);
							}

							normal = normal .normalize ();
						}
					}

					// Add a normal index for each point.
					for (var i = 0, length = vertices .length; i < length; ++ i)
					{
						var index = this .coordIndex_ [vertices [i]];
						
						if (! normalIndex [index])
							normalIndex [index] = [ ];

						normalIndex [index] .push (normals .length + i);
					}

					// Add this normal for each vertex and for -1.
					
					for (var i = 0, length = vertices .length + 1; i < length; ++ i)
						normals .push (normal);
				}

				return this .refineNormals (normalIndex, normals, this .creaseAngle_ .getValue (), this .ccw_ .getValue ());
			},
		});

		return IndexedFaceSet;
	}
});

