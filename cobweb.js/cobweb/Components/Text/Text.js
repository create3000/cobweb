
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Rendering/X3DGeometryNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Geometry/Triangle3",
	"opentype",
	"bezier",
	"poly2tri",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DGeometryNode, 
          X3DConstants,
          Vector3,
          Triangle3,
          opentype,
          Bezier,
          poly2tri)
{
	with (Fields)
	{
		function Text (executionContext)
		{
			X3DGeometryNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .Text);
		}

		Text .prototype = $.extend (Object .create (X3DGeometryNode .prototype),
		{
			constructor: Text,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",   new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "string",     new MFString ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "length",     new MFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "maxExtent",  new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "solid",      new SFBool (false)),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "origin",     new SFVec3f ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "textBounds", new SFVec2f ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "lineBounds", new MFVec2f ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "fontStyle",  new SFNode ()),
			]),
			getTypeName: function ()
			{
				return "Text";
			},
			getComponentName: function ()
			{
				return "Text";
			},
			getContainerField: function ()
			{
				return "geometry";
			},
			initialize: function ()
			{
			   X3DGeometryNode .prototype .initialize .call (this);

				this .font = null;

			   this .requestAsyncLoad ();
			},
			requestAsyncLoad: function ()
			{
				try
				{
					opentype .load ('fonts/Ubuntu-R.ttf', this .setFont .bind (this));
				}
				catch (error)
				{
					this .setError (error .message);
				}
			},
			setFont: function (error, font)
			{
				if (error)
				{
				   this .setError (error);
				}
				else
				{
					console .log ('Font loaded fine.');

					this .font = font;
			   
			      // Workaround to initialize composite glyphs.
			      for (var i = 0; i < this .font .numGlyphs; ++ i)
						this .font .glyphs .get (i) .getPath (0, 0, 1);

					this .update ();
					this .getBrowser () .addBrowserEvent ();
				}
			},
			setError: function (error)
			{
				this .font = null;

				console .warn ('Font could not be loaded: ' + error);			   
			},
			build: function ()
			{
			   if (! this .font)
			      return;

			   console .log ("numGlyphs", this .font .numGlyphs)
					
				var
					glyphs = this .font .stringToGlyphs ('Hello Wörld! OÖ &% ABCDEFGHIJKLMNOPQRSTUVW abcdefghijklmnopqrstuvw ÄÖÜäöüß 0123456789 ^°!"§$%&/()=?+*~\'#-_.:,; ÁÓÚáóú ′¹²³¼½¬{[]}\\@ł€¶ŧ←↓→øþſðđŋħł|»«¢„“”µ·…–'),
					offset = 0;

				for (var g = 0; g < glyphs .length; ++ g)
				{
					var
					   glyph     = glyphs [g],
						path      = glyph .getPath (0, 0, 1),
						dimension = 3,
						points    = [{ x: 0, y: 0, z: 0 }],
						curves    = [ ],
						x         = 0,
						y         = 0;

					console .log (glyph .name, glyph, path);

					// Get curves for the current glyph.

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
						      points .push ({ x: command .x + offset, y: -command .y, z: 0 });
								break;
							}
							case 'L':
							{
								points .push ({ x: command .x + offset, y: -command .y, z: 0 });
								break;
							}
							case 'C':
							{
								//ctx.bezierCurveTo(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
								break;
							}
							case 'Q':
							{
								//ctx.quadraticCurveTo(cmd.x1, cmd.y1, cmd.x, cmd.y);

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
						         points .push ({ x: 0, y: 0, z: 0 });
						      }
								
								continue;
							}
							default:
							   continue;
						}

						x = command .x;
						y = command .y;
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
							console .log (contours [0] [0] .x, contours [0] [0] .y, contours [0] [0] .z);
							break;
						default:
						{
							console .log (contours [0] [0] .x, contours [0] [0] .y, contours [0] [0] .z);
					      
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

							console .log (contours [0] [0] .x, contours [0] [0] .y, contours [0] [0] .z);
						   break;
						}
					}

					// Triangulate contours.

					for (var i = 0; i < contours .length; ++ i)
					   this .triangulate (contours [i], contours [i] .holes);
					
					// Calculate offset.

					var kerning = 0;

					if (g + 1 < glyphs .length)
						kerning = this .font .getKerningValue (glyph, glyphs [g + 1]);

					offset += (glyph .advanceWidth + kerning) / 1000;
				}

				this .setSolid (this .solid_ .getValue ());
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
					//console .log (error);
				}
			},
			triangulate: function (contour, holes)
			{
				console .log ("contour, holes", contour, holes);

			   try
			   {
					// Triangulate polygon.

					var
						context = new poly2tri .SweepContext (contour) .addHoles (holes),
						ts      = context .triangulate () .getTriangles (),
						normal  = new Vector3 (0, 0, 1);

					for (var i = 0; i < ts .length; ++ i)
					{
						this .addNormal (normal);
						this .addNormal (normal);
						this .addNormal (normal);

						this .addVertex (ts [i] .getPoint (0));
						this .addVertex (ts [i] .getPoint (1));
						this .addVertex (ts [i] .getPoint (2));
					}
				}
				catch (error)
				{
					//console .log (error);
				}
			},
		});

		return Text;
	}
});

