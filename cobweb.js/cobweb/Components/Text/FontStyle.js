
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Text/X3DFontStyleNode",
	"cobweb/Bits/X3DConstants",
	"cobweb/Browser/Core/PrimitiveQuality",
	"standard/Math/Geometry/Box2",
	"standard/Math/Geometry/Box3",
	"standard/Math/Numbers/Vector2",
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
          X3DConstants,
          PrimitiveQuality,
          Box2,
          Box3,
          Vector2,
          Vector3,
          Triangle2,
          Algorithm,
          Bezier,
          poly2tri,
          earcut)
{
"use strict";

	var
		glyphCache = { },
		bbox       = new Box2 (),
		min        = new Vector2 (0, 0),
		max        = new Vector2 (0, 0),
		glyphMin   = new Vector2 (0, 0),
		glyphMax   = new Vector2 (0, 0),
		min3       = new Vector3 (0, 0, 0),
		max3       = new Vector3 (0, 0, 0),
		size       = new Vector2 (0, 0),
		center     = new Vector2 (0, 0),
		lineBound  = new Vector2 (0, 0),
		origin     = new Vector3 (0, 0, 0),
		box2       = new Box2 (),
		zero2      = new Vector2 (0, 0),
		zero3      = new Vector3 (0, 0, 0),
		FONT_SIZE  = 1; // This is the internally used font size of the cached geometry to prevent triangulation errors.

	function X3DTextGeometry (text, fontStyle)
	{
		this .text           = text;
		this .fontStyle      = fontStyle;
		this .glyphs         = [ ];
		this .minorAlignment = new Vector2 (0, 0);
		this .translations   = [ ];
		this .charSpacings   = [ ];
		this .bearing        = new Vector2 (0, 0);
		this .bbox           = new Box3 ();
	}

	X3DTextGeometry .prototype =
	{
		constructor: X3DTextGeometry,
		getBrowser: function ()
		{
			return this .text .getBrowser ();
		},
		getText: function ()
		{
			return this .text;
		},
		getFontStyle: function ()
		{
			return this .fontStyle;
		},
		getGlyphs: function ()
		{
			return this .glyphs;
		},
		getMinorAlignment: function ()
		{
			return this .minorAlignment;
		},
		getTranslations: function ()
		{
			return this .translations;
		},
		getCharSpacings: function ()
		{
			return this .charSpacings;
		},
		getBearing: function ()
		{
			return this .bearing;
		},
		update: function ()
		{
			var
				text      = this .text,
				fontStyle = this .fontStyle,
				numLines  = text .string_ .length;
			
			text .lineBounds_ .length = numLines;
			this .glyphs      .length = 0;

			this .resizeArray (this .translations, numLines);
			this .resizeArray (this .charSpacings, numLines);

			if (numLines === 0 || ! fontStyle .getFont ())
			{
				text .origin_     .setValue (zero3);
				text .textBounds_ .setValue (zero2);

				this .bbox .set ();
				return;
			}

			if (fontStyle .horizontal_ .getValue ())
				this .horizontal (text, fontStyle);
			else
				this .horizontal (text, fontStyle);
		},
		resizeArray: function (array, size)
		{
			// Resize array in grow only fashion.

			for (var i = array .length; i < size; ++ i)
				array .push (new Vector2 (0, 0));

			array .length = size;
		},
		horizontal: function (text, fontStyle)
		{
			var
				string      = text .string_ .getValue (),
				numLines    = string .length,
				topToBottom = fontStyle .topToBottom_ .getValue (),
				lineHeight  = fontStyle .spacing_ .getValue (),
				scale       = fontStyle .getScale ();
			
			bbox .set ();

			// Calculate bboxes.

			var
				first = topToBottom ? 0 : numLines - 1,
				last  = topToBottom ? numLines : -1,
				step  = topToBottom ? 1 : -1;

			for (var l = first; l !== last; l += step)
			{
				var line = string [l];

				// Get line extents.

				var glyphs = this .getLineExtents (fontStyle, line, min, max, l);

				size .assign (max) .subtract (min);

				// Calculate charSpacing and lineBounds.

				var lineNumber = topToBottom ? l : numLines - l - 1;

				var
					charSpacing = 0,
					length      = text .getLength (l);
	
				lineBound .set (size .x, lineNumber == 0 ? size .y : lineHeight) .multiply (scale);

				if (text .maxExtent_ .getValue ())
				{
					if (length)
						length = Math .min (text .maxExtent_ .getValue (), length);

					else
						length = Math .min (text .maxExtent_ .getValue (), size .x * scale);
				}

				if (length)
				{
					charSpacing  = (length - lineBound .x) / (glyphs .length - 1);
					lineBound .x = length;
					size .x      = length / scale;
				}

				this .charSpacings [l] = charSpacing 
				text .lineBounds_ [l]  = lineBound;

				// Calculate line translation.

				switch (fontStyle .getMajorAlignment ())
				{
					case X3DFontStyleNode .Alignment .BEGIN:
					case X3DFontStyleNode .Alignment .FIRST:
						this .translations [l] .set (0, -(l * lineHeight));
						break;
					case X3DFontStyleNode .Alignment .MIDDLE:
						this .translations [l] .set (-min .x - size .x / 2, -(l * lineHeight));
						break;
					case X3DFontStyleNode .Alignment .END:
						this .translations [l] .set (-min .x - size .x, -(l * lineHeight));
						break;
				}

				// Calculate center.

				center .assign (min) .add (size) .divide (2);

				// Add bbox.

				bbox .add (box2 .set (size .multiply (scale), center .add (this .translations [l]) .multiply (scale)));

				this .translations [l] .multiply (scale);
			}

			//console .log ("size", bbox .size, "center", bbox .center);

			// Get text extents.

			bbox .getExtents (min, max);

			size .assign (max) .subtract (min);

			// Calculate text position

			text .textBounds_ = size;
			this .bearing .set (0, -max .y);

			switch (fontStyle .getMinorAlignment ())
			{
				case X3DFontStyleNode .Alignment .BEGIN:
					this .minorAlignment .assign (this .bearing);
					break;
				case X3DFontStyleNode .Alignment .FIRST:
					this .minorAlignment .set (0, 0);
					break;
				case X3DFontStyleNode .Alignment .MIDDLE:
					this .minorAlignment .set (0, size .y / 2 - max .y);
					break;
				case X3DFontStyleNode .Alignment .END:
					this .minorAlignment .set (0, (numLines - 1) * lineHeight * scale);
					break;
			}

			// Translate bbox by minorAlignment.

			min .add (this .minorAlignment);
			max .add (this .minorAlignment);

			// The value of the origin field represents the upper left corner of the textBounds.

			text .origin_ .setValue (origin .set (min .x, max .y, 0));

			this .bbox .set (min3 .set (min .x, min .y, 0),
			                 max3 .set (max .x, max .y, 0),
			                 true);
		},
		vertical: function (text, fontStyle)
		{

		},
		stringToGlyphs: function (font, line, normal, lineNumber)
		{
			line = line .getValue ();

			var
				fontGlyphCache = glyphCache [font .fontName],
				glypes         = this .glyphs [lineNumber];

			if (! fontGlyphCache)
				fontGlyphCache = glyphCache [font .fontName] = { };

			if (! glypes)
				glypes = this .glyphs [lineNumber] = [ ];

			glypes .length = line .length;

			var
				first = normal ? 0 : line .length - 1,
				last  = normal ? line .length : -1,
				step  = normal ? 1 : -1;

			for (var c = first, g = 0; c !== last; c += step, ++ g)
			{
				var
					character = line [c],
					glyph     = null;
				
				if (glyph = fontGlyphCache [character])
					;
				else
				{
					glyph = font .stringToGlyphs (character) [0];

					fontGlyphCache [character] = glyph;
				}

				glypes [g] = glyph;
			}

			return glypes;
		},
		getLineExtents: function (fontStyle, line, min, max, lineNumber)
		{
			var
			   font             = fontStyle .getFont (),
				normal           = fontStyle .horizontal_ .getValue () ? fontStyle .leftToRight_ .getValue () : fontStyle .topToBottom_ .getValue (),
				glyphs           = this .stringToGlyphs (font, line, normal, lineNumber),
				primitiveQuality = this .getBrowser () .getBrowserOptions () .getPrimitiveQuality (),
				xMin             = 0,
				xMax             = 0,
				yMin             = Number .POSITIVE_INFINITY,
				yMax             = Number .NEGATIVE_INFINITY;

			for (var g = 0, length = glyphs .length; g < length; ++ g)
			{
				var
					glyph   = glyphs [g],
					kerning = g + 1 < length ? font .getKerningValue (glyph, glyphs [g + 1]) : 0;

				this .getGlyphExtents (glyph, primitiveQuality, glyphMin, glyphMax);

				xMax += glyph .advanceWidth + kerning;
				yMin  = Math .min (yMin, glyphMin .y);
				yMax  = Math .max (yMax, glyphMax .y);
			}

			if (glyphs .length)
			{
				this .getGlyphExtents (glyphs [0], primitiveQuality, glyphMin, glyphMax);

				xMin  = glyphMin .x;
			}
			else
			{
				yMin = 0;
				yMax = 0;
			}

			min .set (xMin, yMin);
			max .set (xMax / font .unitsPerEm, yMax);

			switch (fontStyle .getMajorAlignment ())
			{
				case X3DFontStyleNode .Alignment .BEGIN:
				case X3DFontStyleNode .Alignment .FIRST:
					min .x = 0;
					break;
				case X3DFontStyleNode .Alignment .MIDDLE:
				case X3DFontStyleNode .Alignment .END:
					break;
			}

			return glyphs;
		},
	};

	/*
	 * PolygonText
	 */
	
	var
		normal = new Vector3 (0, 0, 1),
		vertex = new Vector3 (0, 0, 0);

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
			var fontStyle = this .getFontStyle ();
	
			if (! fontStyle .getFont ())
				return;

			this .texCoords .length = 0;
			this .getText () .getTexCoords () .push (this .texCoords);

			if (fontStyle .horizontal_ .getValue ())
			{
				var size  = fontStyle .getScale ();

				for (var i = 0; i < this .getGlyphs () .length; ++ i)
					this .render (this .getGlyphs () [i], this .getMinorAlignment (), size, this .getTranslations () [i], this .getCharSpacings () [i]);
			}
			else
			{
				/*
				glTranslatef (getMinorAlignment () .x (), getMinorAlignment () .y (), 0);

				const double size = fontStyle -> getScale ();

				glScalef (size, size, size);

				// Render lines.

				const bool leftToRight = fontStyle -> leftToRight ();
				const bool topToBottom = fontStyle -> topToBottom ();
				const int  first       = leftToRight ? 0 : text -> string () .size () - 1;
				const int  last        = leftToRight ? text -> string () .size () : -1;
				const int  step        = leftToRight ? 1 : -1;

				for (int i = first, g = 0; i not_eq last; i += step)
				{
					const auto & line = text -> string () [i] .getValue ();

					for (const auto & glyph : topToBottom ? line : String (line .rbegin (), line .rend ()))
					{
						fontStyle -> getPolygonFont () -> Render (String (1, glyph) .c_str (),
						                                          -1,
						                                          FTPoint (getTranslations () [g] .x (), getTranslations () [g] .y (), 0),
						                                          FTPoint (),
						                                          FTGL::RENDER_ALL);
						++ g;
					}
				}
				*/
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
				fontSize         = size / FONT_SIZE,
				sizeUnitsPerEm   = size / font .unitsPerEm,
				texCoords        = this .texCoords;

			for (var g = 0, gl = glyphs .length; g < gl; ++ g)
			{
				var
					glyph    = glyphs [g],
					vertices = this .getGlyphGeometry (glyph, primitiveQuality);
				
				for (var v = 0, vl = vertices .length; v < vl; ++ v)
				{
					text .addNormal (normal);
					text .addVertex (vertex .set (vertices [v] .x * fontSize + minorAlignment .x + g * charSpacing + translation .x + offset,
					                              vertices [v] .y * fontSize + minorAlignment .y + translation .y,
					                              0));

					texCoords .push (vertex .x / fontSize, vertex .y / fontSize, 0, 1);
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

					paths .push (font .glyphs .get (component .glyphIndex) .getPath (component .dx / font .unitsPerEm, component .dy / -font .unitsPerEm, FONT_SIZE));
				}
			}
			else
				paths .push (glyph .getPath (0, 0, FONT_SIZE));

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
				minX        = Number .POSITIVE_INFINITY,
				minIndex    = 0,
				orientation = 0;

			for (var i = 0; i < curve .length; ++ i)
			{
				if (curve [i] .x < minX)
				{
					minX     = curve [i] .x;
					minIndex = i;
				}
			}

			var
				a = curve [(minIndex + curve .length - 1) % curve .length],
				b = curve [minIndex],
				c = curve [(minIndex + 2) % curve .length];

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


