
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
	"standard/Math/Geometry/Triangle3",
	"bezier",
	"poly2tri",
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
          Triangle3,
          Bezier,
          poly2tri)
{
	with (Fields)
	{
		var
			min = new Vector2 (0, 0),
			max = new Vector2 (0, 0);

	   function X3DTextGeometry (text, fontStyle)
		{
			this .text           = text;
			this .fontStyle      = fontStyle;
			this .glyphs         = [ ];
			this .minorAlignment = new Vector2 (0, 0);
			this .translations   = [ ];
			this .charSpacings   = [ ];
			this .bearing        = new Vector2 (0, 0);

			this .update ();
		}

		X3DTextGeometry .prototype =
		{
			constructor: X3DTextGeometry,
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
				
				text .lineBounds_ .length  = numLines;
				this .glyphs .length       = 0;
				this .charSpacings .length = numLines;
				this .translations .length = numLines;

				if (numLines === 0 || ! fontStyle .getFont ())
				{
					text .origin_ .setValue (0, 0, 0);
					text .textBounds_ .setValue (0, 0);

					this .bbox = new Box3 ();
					return;
				}

				if (fontStyle .horizontal_ .getValue ())
					this .horizontal (text, fontStyle);
				else
					this .vertical (text, fontStyle);
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

					var size = Vector2 .subtract (max, min);

					// Calculate charSpacing and lineBounds.

					var lineNumber = topToBottom ? l : numLines - l - 1;

					var
						charSpacing = 0,
						lineBound   = new Vector2 (size .x, lineNumber == 0 ? size .y : lineHeight) .multiply (scale),
						length      = text .getLength (l);

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

					this .charSpacings [l] = charSpacing;
					text .lineBounds_ [l]  = lineBound;

					// Calculate line translation.

					switch (fontStyle .getMajorAlignment ())
					{
						case X3DFontStyleNode .Alignment .BEGIN:
						case X3DFontStyleNode .Alignment .FIRST:
							this .translations [l] = new Vector2 (0, -(lineNumber * lineHeight));
							break;
						case X3DFontStyleNode .Alignment .MIDDLE:
							this .translations [l] = new Vector2 (-min .x - size .x / 2, -(lineNumber * lineHeight));
							break;
						case X3DFontStyleNode .Alignment .END:
							this .translations [l] = new Vector2 (-min .x - size .x, -(lineNumber * lineHeight));
							break;
					}

					this .translations [l] .multiply (scale);

					// Calculate center.

					var center = Vector2 .add (min, size) .divide (2);

					// Add bbox.

					bbox .add (new Box2 (size .multiply (scale), center .add (this .translations [l]) .multiply (scale)));
				}

				// Get text extents.

				bbox .getExtents (min, max);

				var size = Vector2 .subtract (max, min);

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

				text .origin_ .setValue (min .x, max .y, 0);

				this .bbox = new Box3 (new Vector3 (min .x, min .y, 0),
				                       new Vector3 (max .x, max .y, 0),
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
			
				for (var g = 0, length = glyphs .length - 1; g < length; ++ g)
				{
					var
						glyph   = glyphs [g],
						kerning = font .getKerningValue (glyph, glyphs [g + 1]);

					xMax += (glyph .advanceWidth + kerning);
					yMin  = Math .min (yMin, glyph .yMin || 0);
					yMax  = Math .max (yMax, glyph .yMax || 0);
				}

				if (glyphs .length)
				{
					xMin  = glyphs [0] .xMin || 0;
					xMax += glyphs [glyphs .length - 1] .xMax || 0;
					xMax  = Math .max (xMax, xMin);
				}
				else
				{
					yMin = 0;
					yMax = 0;			   
				}

				min .set (xMin, yMin) .divide (1000);
				max .set (xMax, yMax) .divide (1000);

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

					// Render lines.
					var
						topToBottom = fontStyle .topToBottom_ .getValue (),
						first       = topToBottom ? 0 : this .getGlyphs () .length - 1,
						last        = topToBottom ? this .getGlyphs () .length : -1,
						step        = topToBottom ? 1 : -1;

					for (var i = first; i !== last; i += step)
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
				   text      = this .getText (),
				   fontStyle = this .getFontStyle (),
				   font      = fontStyle .getFont (),
					offset    = 0
					paths     = [ ],
					points    = [ ],
					curves    = [ ]
					zero      = { x: 0, y: 0, z: 0 };
					   
				for (var g = 0; g < glyphs .length; ++ g)
				{
					var
					   glyph     = glyphs [g],
						dimension = 0,
						x         = 0,
						y         = 0;

					switch (text .getBrowser () .getBrowserOptions () .getPrimitiveQuality ())
					{
					   case PrimitiveQuality .LOW:
					      dimension = 2;
					      break;
					   case PrimitiveQuality .HIGH:
					      dimension = 5;
					      break;
					   default:
							dimension = 3;
							break;
					}

					paths  .length = 0;
					points .length = 0;
					curves .length = 0;

					points .push (zero);
				
					if (glyph .isComposite)
					{
					   for (var c = 0; c < glyph .components .length; ++ c)
					   {
					      var component = glyph .components [c];

					      paths .push (font .glyphs .get (component .glyphIndex) .getPath (component .dx /  1000 * size + minorAlignment .x + g * charSpacing + translation .x,
					                                                                       component .dy / -1000 * size - minorAlignment .y - translation .y,
					                                                                       size));
					   }
					}
					else
					   paths .push (glyph .getPath (minorAlignment .x + g * charSpacing + translation .x,
					                                -minorAlignment .y - translation .y,
					                                size));

					// Get curves for the current glyph.

					for (var p = 0; p < paths .length; ++ p)
					{
					   var path = paths [p];

						for (var i = 0; i < path .commands .length; ++ i)
						{
							var command = path .commands [i];
							      
							switch (command .type)
							{
							   case 'M':
							   {
									if (points [0] .x === points [points .length - 1] .x && points [0] .y === points [points .length - 1] .y)
										points .pop ();

									if (points .length > 2)
										curves .push (points .slice ());

							      points .length = 0;
							      points .push ({ x: (command .x + offset), 
							                      y: (-command .y ),
							                      z: 0 });
									break;
								}
								case 'L':
								{
									points .push ({ x: (command .x + offset),
									                y: (-command .y),
									                z: 0 });
									break;
								}
								case 'C':
								{
									//ctx .bezierCurveTo (cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
	
									var
										curve = new Bezier (x, y, command .x1, command .y1, command .x2, command .y2, command .x, command .y),
										lut   = curve .getLUT (dimension);

									lut .shift ();
									lut .map (function (point)
									{
									   point .x += offset;
										point .y  = -point .y;
										point .z  = 0;
									});
				
									Array .prototype .push .apply (points, lut);
									break;
								}
								case 'Q':
								{
									var
										curve = new Bezier (x, y, command .x1, command .y1, command .x, command .y),
										lut   = curve .getLUT (dimension);

									lut .shift ();
									lut .map (function (point)
									{
									   point .x += offset;
										point .y  = -point .y;
										point .z  = 0;
									});
				
									Array .prototype .push .apply (points, lut);
									break;
								}
								case 'Z':
								{
							      if (points .length > 2)
							      {
										if (points [0] .x === points [points .length - 1] .x && points [0] .y === points [points .length - 1] .y)
											points .pop ();

										if (points .length > 2)
											curves .push (points .slice ());
							   
							         points .length = 0;
							         points .push (zero);
							      }
									
									continue;
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
					   this .triangulate (contours [i], contours [i] .holes);
					
					// Calculate offset.

					var kerning = 0;

					if (g + 1 < glyphs .length)
						kerning = font .getKerningValue (glyph, glyphs [g + 1]);

					offset += (glyph .advanceWidth + kerning) / 1000 * size;
				}
			},
			getCurveOrientation: function (curve)
			{
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
			isPointInPolygon: function (polygon, point)
			{
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
						
						if (Triangle3 .isPointInTriangle (a, b, c, point))
						   return true;
					}

					return false;
				}
				catch (error)
				{
					//console .warn (error);
				}
			},
			triangulate: function (contour, holes)
			{
			   try
			   {
					// Triangulate polygon.

					var
					   text    = this .getText (),
						context = new poly2tri .SweepContext (contour) .addHoles (holes),
						ts      = context .triangulate () .getTriangles (),
						normal  = new Vector3 (0, 0, 1);

					for (var i = 0; i < ts .length; ++ i)
					{
						text .addNormal (normal);
						text .addNormal (normal);
						text .addNormal (normal);

						text .addVertex (ts [i] .getPoint (0));
						text .addVertex (ts [i] .getPoint (1));
						text .addVertex (ts [i] .getPoint (2));
					}
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

