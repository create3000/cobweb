
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Text/X3DFontStyleNode",
	"cobweb/Browser/Text/X3DTextGeometry",
	"cobweb/Browser/Text/TextAlignment",
	"cobweb/Bits/X3DConstants",
	"cobweb/Browser/Core/PrimitiveQuality",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Geometry/Triangle2",
	"standard/Math/Algorithm",
	"lib/bezierjs/bezier.js",
	"lib/poly2tri.js/dist/poly2tri.js",
	"lib/earcut/src/earcut.js",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DFontStyleNode, 
          X3DTextGeometry,
          TextAlignment,
          X3DConstants,
          PrimitiveQuality,
          Vector3,
          Triangle2,
          Algorithm,
          Bezier,
          poly2tri,
          earcut)
{
"use strict";

	/*
	 * PolygonText
	 */
	
	var
		min = new Vector3 (0, 0, 0),
		max = new Vector3 (0, 0, 0);

	function PolygonText (text, fontStyle)
	{
		X3DTextGeometry .call (this, text, fontStyle);

		this .texCoords = [ ];
	}

	PolygonText .prototype = $.extend (Object .create (X3DTextGeometry .prototype),
	{
		constructor: PolygonText,
		build: function ()
		{
			var
				text           = this .getText (),
				fontStyle      = this .getFontStyle (),
				glyphs         = this .getGlyphs (),
				minorAlignment = this .getMinorAlignment (),
				translations   = this .getTranslations (),
				charSpacings   = this .getCharSpacings (),
				size           = fontStyle .getScale ();


			if (! fontStyle .getFont ())
				return;

			this .texCoords .length = 0;
			text .getTexCoords () .push (this .texCoords);

			this .getBBox () .getExtents (min, max);
			text .getMin () .assign (min);
			text .getMax () .assign (max);

			if (fontStyle .horizontal_ .getValue ())
			{
				for (var i = 0, length = glyphs .length; i < length; ++ i)
					this .render (glyphs [i], minorAlignment, size, translations [i], charSpacings [i]);
			}
			else
			{
				var
					primitiveQuality = this .getBrowser () .getBrowserOptions () .getPrimitiveQuality (),
					texCoords        = this .texCoords,
					normals          = text .getNormals (),
					vertices         = text .getVertices ();

				var
					leftToRight = fontStyle .leftToRight_ .getValue (),
					topToBottom = fontStyle .topToBottom_ .getValue (),
					first       = leftToRight ? 0 : text .string_ .length - 1,
					last        = leftToRight ? text .string_ .length  : -1,
					step        = leftToRight ? 1 : -1;

				for (var l = first, t = 0; l !== last; l += step)
				{
					var line = glyphs [l];

					//for (const auto & glyph : topToBottom ? line : String (line .rbegin (), line .rend ()))

					for (var g = 0, length = line .length; g < length; ++ g, ++ t)
					{
						var glyphVertices = this .getGlyphGeometry (line [g], primitiveQuality);

						for (var v = 0, vl = glyphVertices .length; v < vl; ++ v)
						{
							var
								x = glyphVertices [v] .x * size + minorAlignment .x + translations [t] .x,
								y = glyphVertices [v] .y * size + minorAlignment .y + translations [t] .y;
			
							normals   .push (0, 0, 1);
							vertices  .push (x, y, 0, 1);
							texCoords .push (x / size, y / size, 0, 1);
						}
					}
				}
			}
		},
		render: function (glyphs, minorAlignment, size, translation, charSpacing)
		{
			var
				text             = this .getText (),
				fontStyle        = this .getFontStyle (),
				font             = fontStyle .getFont (),
				offset           = 0,
				primitiveQuality = this .getBrowser () .getBrowserOptions () .getPrimitiveQuality (),
				sizeUnitsPerEm   = size / font .unitsPerEm,
				texCoords        = this .texCoords,
				normals          = text .getNormals (),
				vertices         = text .getVertices ();

			for (var g = 0, gl = glyphs .length; g < gl; ++ g)
			{
				var
					glyph         = glyphs [g],
					glyphVertices = this .getGlyphGeometry (glyph, primitiveQuality);
				
				for (var v = 0, vl = glyphVertices .length; v < vl; ++ v)
				{
					var
						x = glyphVertices [v] .x * size + minorAlignment .x + g * charSpacing + translation .x + offset,
						y = glyphVertices [v] .y * size + minorAlignment .y + translation .y;

					normals   .push (0, 0, 1);
					vertices  .push (x, y, 0, 1);
					texCoords .push (x / size, y / size, 0, 1);
				}

				// Calculate offset.

				var kerning = 0;

				if (g + 1 < glyphs .length)
					kerning = font .getKerningValue (glyph, glyphs [g + 1]);

				offset += (glyph .advanceWidth + kerning) * sizeUnitsPerEm;
			}
		},
		getGlyphExtents: function (glyph, primitiveQuality, min, max)
		{
			var extents = glyph .extents [primitiveQuality];

			if (extents)
			{
				min .assign (extents .min);
				max .assign (extents .max);
				return;
			}

			var vertices = this .getGlyphGeometry (glyph, primitiveQuality);

			if (vertices .length)
			{
				var vertex = vertices [0];

				min .assign (vertex);
				max .assign (vertex);

				for (var i = 1, length = vertices .length; i < length; ++ i)
				{
					var vertex = vertices [i];

					min .min (vertex);
					max .max (vertex);
				}
			}
			else
			{
				min .set (0, 0, 0);
				max .set (0, 0, 0);			   
			}

			var extents = glyph .extents [primitiveQuality] = { };

			extents .min = min .copy ();
			extents .max = max .copy ();
		},
		getGlyphGeometry: function (glyph, primitiveQuality)
		{
			var
				fontStyle     = this .getFontStyle (),
				font          = fontStyle .getFont (),
				geometryCache = this .getBrowser () .getFontGeometryCache ();

			var cachedFont = geometryCache [font .fontName];

			if (! cachedFont)
				geometryCache [font .fontName] = cachedFont = [[], [], []];

			var cachedGeometry = cachedFont [primitiveQuality] [glyph .index];

			if (cachedGeometry)
				return cachedGeometry;

			cachedGeometry = cachedFont [primitiveQuality] [glyph .index] = [ ];

			this .createGlyphGeometry (glyph, cachedGeometry, primitiveQuality);

		   return cachedGeometry;
		},
		createGlyphGeometry: function (glyph, vertices, primitiveQuality)
		{
			var
				fontStyle = this .getFontStyle (),
				font      = fontStyle .getFont (),
				paths     = [ ],
				points    = [ ],
				curves    = [ ],
				dimension = this .getBezierDimension (primitiveQuality),
				reverse   = font .outlinesFormat === "cff";

			paths  .length = 0;
			points .length = 0;
			curves .length = 0;
		
			if (glyph .isComposite)
			{
				for (var c = 0; c < glyph .components .length; ++ c)
				{
					var component = glyph .components [c];

					paths .push (font .glyphs .get (component .glyphIndex) .getPath (component .dx / font .unitsPerEm, component .dy / -font .unitsPerEm, 1));
				}
			}
			else
				paths .push (glyph .getPath (0, 0, 1));

			// Get curves for the current glyph.

			var
				x = 0,
				y = 0;

			for (var p = 0; p < paths .length; ++ p)
			{
				var path = paths [p];

				for (var i = 0; i < path .commands .length; ++ i)
				{
					var command = path .commands [i];
										      
					switch (command .type)
					{
						case "M":
						case "Z":
						{
							if (points .length > 2)
							{
								if (points [0] .x === points [points .length - 1] .x && points [0] .y === points [points .length - 1] .y)
									points .pop ();

								curves .push (reverse ? points .reverse () .slice () : points .slice ());
							}
								
							points .length = 0;

							if (command .type === "M")
								points .push ({ x: command .x, y: -command .y });
							
							break;
						}
						case "L":
						{
							points .push ({ x: command .x, y: -command .y });
							break;
						}
						case "C":
						{
							var
								curve = new Bezier (x, -y, command .x1, -command .y1, command .x2, -command .y2, command .x, -command .y),
								lut   = curve .getLUT (dimension);

							for (var l = 1; l < lut .length; ++ l)
								points .push (lut [l]);

							break;
						}
						case "Q":
						{
							var
								curve = new Bezier (x, -y, command .x1, -command .y1, command .x, -command .y),
								lut   = curve .getLUT (dimension);

							for (var l = 1; l < lut .length; ++ l)
								points .push (lut [l]);
							
							break;
						}
						default:
						   continue;
					}

					x = command .x;
					y = command .y;
				}
			}

			// Determine contours and holes.

			var
				contours = [ ],
				holes    = [ ];

			switch (curves .length)
			{
			   case 0:
					break;
			   case 1:
					contours = curves;
					break;
				default:
				{
					for (var i = 0; i < curves .length; ++ i)
					{
						var
							curve       = curves [i],
							orientation = this .getCurveOrientation (curve);

						if (orientation < 0)
							contours .push (curve);
					   else
							holes .push (curve);
					}

					break;
				}
			}

			/*
			if (glyph .name [0] == "O")
				console .log (glyph .name, "\n",
				              "font: ", font, "\n",
				              "glyph: ", glyph, "\n",
				              "paths: ", paths, "\n",
				              "contours: ", contours, "\n",
				              "holes: ", holes);
			*/
			   
			// Determine the holes for every contour.

			contours .map (this .removeCollinearPoints);
			holes .map (this .removeCollinearPoints);

			switch (contours .length)
			{
				case 0:
					break;
				case 1:
					contours [0] .holes = holes;
					break;
				default:
				{
					for (var c = 0; c < contours .length; ++ c)
						contours [c] .holes = [ ];

					for (var h = 0; h < holes .length; ++ h)
					{
						var hole = holes [h];

						for (var c = 0; c < contours .length; ++ c)
						{
							var contour = contours [c];

							// Copy contour, as isPointInPolygon will shuffle the points.
							if (this .isPointInPolygon (contour .slice (), hole [0]))
							{
								contour .holes .push (hole);
								break;
							}
						}
					}

				   break;
				}
			}

			// Triangulate contours.

			for (var i = 0; i < contours .length; ++ i)
				this .triangulate (contours [i], contours [i] .holes, vertices);
		},
		getBezierDimension: function (primitiveQuality)
		{
			switch (primitiveQuality)
			{
				case PrimitiveQuality .LOW:
					return 2;
				case PrimitiveQuality .HIGH:
					return 5;
				default:
					return 3;
			}
		},
		getCurveOrientation: function (curve)
		{
			// From Wikipedia:

			var
				minX     = Number .POSITIVE_INFINITY,
				minIndex = 0;

			for (var i = 0, length = curve .length; i < length; ++ i)
			{
				if (curve [i] .x < minX)
				{
					minX     = curve [i] .x;
					minIndex = i;
				}
			}

			var
				a = curve [(minIndex + length - 1) % length],
				b = curve [minIndex],
				c = curve [(minIndex + 2) % length];

		   return (b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y);
		},
		/*isPointInPolygon: function (polygon, point)
		{
			// earcut version
			// not always working!!!

			try
			{
				// Triangulate polygon.

				var coords = [ ];

				for (var p = 0; p < contour .length; ++ p)
					coords .push (contour [p] .x, contour [p] .y);

				var t = earcut (coords, holesIndices);

				for (var i = 0; i < t .length; i += 3)
				{
				   var  
						a = polygon [t [i]],
						b = polygon [t [i + 1]],
						c = polygon [t [i + 2]];
					
					if (Triangle2 .isPointInTriangle (a, b, c, point))
						return true;
				}

				return false;
			}
			catch (error)
			{
				//console .warn (error);
			}
		},*/
		isPointInPolygon: function (polygon, point)
		{
			// poly2tri version

			try
			{
				// Triangulate polygon.

				var
					context = new poly2tri .SweepContext (polygon),
					ts      = context .triangulate () .getTriangles ();

				for (var i = 0; i < ts .length; ++ i)
				{
					var  
						a = ts [i] .getPoint (0),
						b = ts [i] .getPoint (1),
						c = ts [i] .getPoint (2);
					
					if (Triangle2 .isPointInTriangle (a, b, c, point))
						return true;
				}

				return false;
			}
			catch (error)
			{
				//console .warn (error);
			}
		},
		removeCollinearPoints: function (polygon)
		{
			function isCollinear (a, b, c)
			{
				return Math .abs ((a.y - b.y) * (a.x - c.x) - (a.y - c.y) * (a.x - b.x)) < 1e-8;
			}

			for (var i = 0, k = 0; i < polygon .length; ++ i)
			{
				var
					i0 = (i - 1 + polygon .length) % polygon .length,
					i1 = (i + 1) % polygon .length;

				if (isCollinear (polygon [i0], polygon [i], polygon [i1]))
					continue;

				polygon [k ++] = polygon [i];
			}

		   polygon .length = k;
		},
		triangulate: function (polygon, holes, triangles)
		{
		   try
			{
				// Triangulate polygon.

				var
					context = new poly2tri .SweepContext (polygon) .addHoles (holes),
					ts      = context .triangulate () .getTriangles ();

				for (var i = 0; i < ts .length; ++ i)
				{
					triangles .push (ts [i] .getPoint (0));
					triangles .push (ts [i] .getPoint (1));
					triangles .push (ts [i] .getPoint (2));
				}
			}
			catch (error)
			{
				//console .warn (error);
				this .earcutTriangulate (polygon, holes, triangles);
			}
		},
		earcutTriangulate: function (polygon, holes, triangles)
		{
		   try
			{
				// Triangulate polygon.

				var
					coords       = [ ],
					holesIndices = [ ];

				for (var p = 0; p < polygon .length; ++ p)
					coords .push (polygon [p] .x, polygon [p] .y);

				for (var h = 0; h < holes .length; ++ h)
				{
					var hole = holes [h];

					for (var p = 0; p < hole .length; ++ p)
					{
						holesIndices .push (coords .length / 2);
						coords .push (hole [p] .x, hole [p] .y);
						polygon .push (hole [p]);
					}
				}

				var t = earcut (coords, holesIndices);

				for (var i = 0; i < t .length; ++ i)
					triangles .push (polygon [t [i]]);
			}
			catch (error)
			{
				//console .warn (error);
			}
		},
		draw: function ()
		{

		},
	});

	function FontStyle (executionContext)
	{
		X3DFontStyleNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .FontStyle);
	}

	FontStyle .prototype = $.extend (Object .create (X3DFontStyleNode .prototype),
	{
		constructor: FontStyle,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",    new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "language",    new Fields .SFString ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "family",      new Fields .MFString ("SERIF")),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "style",       new Fields .SFString ("PLAIN")),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "size",        new Fields .SFFloat (1)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "spacing",     new Fields .SFFloat (1)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "horizontal",  new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "leftToRight", new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "topToBottom", new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "justify",     new Fields .MFString ("BEGIN")),
		]),
		getTypeName: function ()
		{
			return "FontStyle";
		},
		getComponentName: function ()
		{
			return "Text";
		},
		getContainerField: function ()
		{
			return "fontStyle";
		},
		getTextGeometry: function (text)
		{
			return new PolygonText (text, this);
		},
		getScale: function ()
		{
			return this .size_ .getValue ();
		},
	});

	return FontStyle;
});


