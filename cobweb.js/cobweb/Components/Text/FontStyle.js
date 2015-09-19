
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
	"standard/Math/Numbers/Vector3",
	"standard/Math/Geometry/Triangle2",
	"standard/Math/Algorithm",
	"bezier",
	"poly2tri",
	"earcut",
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
          Vector3,
          Triangle2,
          Algorithm,
          Bezier,
          poly2tri,
          earcut)
{
	with (Fields)
	{
		var
			min       = new Vector2 (0, 0),
			max       = new Vector2 (0, 0),
			min3      = new Vector3 (0, 0, 0),
			max3      = new Vector3 (0, 0, 0),
			size      = new Vector2 (0, 0),
			center    = new Vector2 (0, 0),
			lineBound = new Vector2 (0, 0),
			origin    = new Vector3 (0, 0, 0),
			box2      = new Box2 (),
			zero2     = new Vector2 (0, 0),
			zero3     = new Vector3 (0, 0, 0);                  // All glyphs must be scaled by this amount to get the correct size.

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
				this .glyphs .length      = 0;

				this .resizeArray (this .translations, Vector2, numLines, 0, 0);
				this .resizeArray (this .charSpacings, Vector2, numLines, 0, 0);

				if (numLines === 0 || ! fontStyle .getFont ())
				{
					text .origin_ .setValue (zero3);
					text .textBounds_ .setValue (zero2);

					this .bbox .set ();
					return;
				}

				if (fontStyle .horizontal_ .getValue ())
					this .horizontal (text, fontStyle);
				else
					this .horizontal (text, fontStyle);
			},
			resizeArray: function (array, constructor, size)
			{
			   // Resize array in grow only fashion.

			   var args = Array .prototype .slice .call (arguments, 3);

			   for (var i = array .length; i < size; ++ i)
			   {
			      var value = Object .create (constructor .prototype);

					constructor .apply (value, args);

			      array .push (value);
			   }
			},
			horizontal: function (text, fontStyle)
			{
			   var
			      bbox        = new Box2 (),
			      numLines    = text .string_ .length,
					topToBottom = fontStyle .topToBottom_ .getValue (),
					lineHeight  = fontStyle .spacing_ .getValue (),
					scale       = fontStyle .getScale ();
				
				// Calculate bboxes.

				var
					first = topToBottom ? 0 : numLines - 1,
					last  = topToBottom ? numLines : -1,
					step  = topToBottom ? 1 : -1;

				for (var l = first; l !== last; l += step)
				{
					var line = text .string_ [l];

					// Get line extents.

					var glyphs = this .getLineExtents (fontStyle, line, min, max);

					this .glyphs .push (glyphs);

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
			getLineExtents: function (fontStyle, line, min, max)
			{
				var
				   font   = fontStyle .getFont (),
					normal = fontStyle .horizontal_ .getValue () ? fontStyle .leftToRight_ .getValue () : fontStyle .topToBottom_ .getValue (),
					glyphs = font .stringToGlyphs (normal ? line : line .split ("") .reverse () .join ("")),
					xMin   = 0,
					xMax   = 0,
					yMin   = Number .POSITIVE_INFINITY,
					yMax   = Number .NEGATIVE_INFINITY;
			
				for (var g = 0, length = glyphs .length; g < length; ++ g)
				{
					var
						glyph   = glyphs [g],
						kerning = g + 1 < length ? font .getKerningValue (glyph, glyphs [g + 1]) : 0;

					xMax += glyph .advanceWidth + kerning;
					yMin  = Math .min (yMin, glyph .yMin || 0);
					yMax  = Math .max (yMax, glyph .yMax || 0);
				}

				if (glyphs .length)
				{
					xMin  = glyphs [0] .xMin || 0;
				}
				else
				{
					yMin = 0;
					yMax = 0;			   
				}

				min .set (xMin, yMin) .divide (font .unitsPerEm);
				max .set (xMax, yMax) .divide (font .unitsPerEm);

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
		}

		PolygonText .prototype = $.extend (Object .create (X3DTextGeometry .prototype),
		{
			constructor: PolygonText,
			build: function ()
			{
			   var fontStyle = this .getFontStyle ();
	
				if (! fontStyle .getFont ())
					return;
				
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
				   primitiveQuality = this .getBrowser () .getBrowserOptions () .getPrimitiveQuality ();

				for (var g = 0; g < glyphs .length; ++ g)
				{
					var
					   glyph    = glyphs [g],
					   vertices = this .getGlyphGeometry (glyph, primitiveQuality);
					
					for (var v = 0; v < vertices .length; ++ v)
					{
					   text .addNormal (normal);
					   text .addVertex (vertex .set (vertices [v] .x * size + minorAlignment .x + g * charSpacing + translation .x + offset,
					                                 vertices [v] .y * size + minorAlignment .y + translation .y,
					                                 0));
					}

					// Calculate offset.

					var kerning = 0;

					if (g + 1 < glyphs .length)
						kerning = font .getKerningValue (glyph, glyphs [g + 1]);

					offset += (glyph .advanceWidth + kerning) / font .unitsPerEm * size;
				}
			},
			getGlyphGeometry: function (glyph, primitiveQuality)
			{
				var
				   fontStyle  = this .getFontStyle (),
				   font       = fontStyle .getFont (),
				   glyphCache = this .getBrowser () .getGlyphCache ();
			   
			   var cachedFont = glyphCache [font .fontName];

			   if (! cachedFont)
			      glyphCache [font .fontName] = cachedFont = [[], [], []];
			   
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

								lut .shift ();
			
								Array .prototype .push .apply (points, lut);
								break;
							}
							case "Q":
							{
								var
									curve = new Bezier (x, -y, command .x1, -command .y1, command .x, -command .y),
									lut   = curve .getLUT (dimension);

								lut .shift ();
			
								Array .prototype .push .apply (points, lut);
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
			removeCollinearPoints: function (contour)
			{
				function isCollinear (a, b, c)
				{
					return Math .abs ((a.y - b.y) * (a.x - c.x) - (a.y - c.y) * (a.x - b.x)) < 1e-8;
				}

			   var k = 0;

			   for (var i = 0; i < contour .length; ++ i)
			   {
			      var
			         i0 = (i - 1 + contour .length) % contour .length,
			         i1 = (i + 1) % contour .length;

			      if (isCollinear (contour [i0], contour [i], contour [i1]))
						continue;

					contour [k ++] = contour [i];
			   }

			   contour .length = k;
			},
			triangulate: function (contour, holes, vertices)
			{
			   try
			   {
					// Triangulate polygon.


					var
						context = new poly2tri .SweepContext (contour) .addHoles (holes),
						ts      = context .triangulate () .getTriangles ();

					for (var i = 0; i < ts .length; ++ i)
					{
						vertices .push (ts [i] .getPoint (0));
						vertices .push (ts [i] .getPoint (1));
						vertices .push (ts [i] .getPoint (2));
					}
				}
				catch (error)
				{
					//console .warn (error);
					this .earcutTriangulate (contour, holes, vertices);
				}
			},
			earcutTriangulate: function (contour, holes, vertices)
			{
			   try
			   {
					// Triangulate polygon.

					var
						coords       = [ ],
						holesIndices = [ ];

					for (var p = 0; p < contour .length; ++ p)
					   coords .push (contour [p] .x, contour [p] .y);

					for (var h = 0; h < holes .length; ++ h)
					{
					   var hole = holes [h];

						for (var p = 0; p < hole .length; ++ p)
						{
						   holesIndices .push (coords .length / 2);
					      coords .push (hole [p] .x, hole [p] .y);
					      contour .push (hole);
					   }
					}

					var t = earcut (coords, holesIndices);

					for (var i = 0; i < t .length; ++ i)
						vertices .push (contour [t [i]]);
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
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",    new SFNode ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "language",    new SFString ("")),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "family",      new MFString ("SERIF")),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "style",       new SFString ("PLAIN")),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "size",        new SFFloat (1)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "spacing",     new SFFloat (1)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "horizontal",  new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "leftToRight", new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "topToBottom", new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "justify",     new MFString ("BEGIN")),
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
			initialize: function ()
			{
			   X3DFontStyleNode .prototype .initialize .call (this);
				
				this .getExecutionContext () .isLive () .addInterest (this, "set_live__");
				this .isLive ()                         .addInterest (this, "set_live__");

				this .set_live__ ();
			},
			getTextGeometry: function (text)
			{
			   return new PolygonText (text, this);
			},
			getScale: function ()
			{
			   return this .size_ .getValue ();
			},
			set_live__: function ()
			{
			   if (this .getExecutionContext () .isLive () .getValue () && this .isLive () .getValue ())
			   {
			      this .getBrowser () .getBrowserOptions () .PrimitiveQuality_ .addInterest (this, "addNodeEvent");

			      var primitiveQuality = this .getBrowser () .getBrowserOptions () .getPrimitiveQuality ();

			      if (this .primitiveQuality !== undefined && primitiveQuality !== this .primitiveQuality)
			         this .addNodeEvent ();
			      
					this .primitiveQuality = primitiveQuality;
			   }
			   else
			      this .getBrowser () .getBrowserOptions () .PrimitiveQuality_ .removeInterest (this, "addNodeEvent");
			},
		});

		return FontStyle;
	}
});

