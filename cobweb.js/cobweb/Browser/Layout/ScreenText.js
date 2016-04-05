
define ([
	"jquery",
	"cobweb/Browser/Text/X3DTextGeometry",
	"cobweb/Browser/Text/TextAlignment",
	"cobweb/Components/Texturing/PixelTexture",
	"cobweb/Components/Texturing/TextureProperties",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Rotation4",
	"standard/Math/Numbers/Matrix4",
	"standard/Math/Algorithm",
],
function ($,
          X3DTextGeometry,
          TextAlignment,
          PixelTexture,
          TextureProperties,
          Vector3,
          Rotation4,
          Matrix4,
          Algorithm)
{
"use strict";

	var
		paths       = [ ],
		min         = new Vector3 (0, 0, 0),
		max         = new Vector3 (1, 1, 0),
		translation = new Vector3 (0, 0, 0),
		rotation    = new Rotation4 (0, 0, 1, 0),
		scale       = new Vector3 (1, 1, 1),
		origin      = new Vector3 (0, 0, 0);

	function ScreenText (text, fontStyle)
	{
		X3DTextGeometry .call (this, text, fontStyle);

		this .texture           = new PixelTexture (text .getExecutionContext ());
		this .textureProperties = new TextureProperties (text .getExecutionContext ());
		this .texCoords         = [0, 0, 0, 1,  1, 0, 0, 1,  1, 1, 0, 1,    0, 0, 0, 1,  1, 1, 0, 1,  0, 1, 0, 1];
		this .canvas            = $("<canvas>");
		this .context           = this .canvas [0] .getContext ("2d");
		this .screenMatrix      = new Matrix4 ();
		this .matrix            = new Matrix4 ();

		this .textureProperties .boundaryModeS_       = "CLAMP_TO_EDGE";
		this .textureProperties .boundaryModeT_       = "CLAMP_TO_EDGE";
		this .textureProperties .boundaryModeR_       = "CLAMP_TO_EDGE";
		this .textureProperties .minificationFilter_  = "NEAREST_PIXEL";
		this .textureProperties .magnificationFilter_ = "NEAREST_PIXEL";

		this .texture .textureProperties_ = this .textureProperties;

		this .textureProperties .setup ();
		this .texture           .setup ();
	}

	ScreenText .prototype = $.extend (Object .create (X3DTextGeometry .prototype),
	{
		constructor: ScreenText,
		update: function ()
		{
			X3DTextGeometry .prototype .update .call (this);
	
			var
				fontStyle = this .getFontStyle (),
				text      = this .getText ();

			text .textBounds_ .x = Math .ceil (text .textBounds_ .x);
			text .textBounds_ .y = Math .ceil (text .textBounds_ .y);

			this .getBBox () .getExtents (min, max);

			switch (fontStyle .getMajorAlignment ())
			{
				case TextAlignment .BEGIN:
				case TextAlignment .FIRST:
					min .x = Math .floor (min .x);
					max .x = min .x + text .textBounds_ .x;
					break;
				case TextAlignment .MIDDLE:
					min .x = Math .round (min .x);
					max .x = min .x + text .textBounds_ .x;
					break;
				case TextAlignment .END:
					max .x = Math .ceil (max .x);
					min .x = max .x - text .textBounds_ .x;
					break;
			}

			switch (fontStyle .getMinorAlignment ())
			{
				case TextAlignment .BEGIN:
				case TextAlignment .FIRST:
					max .y = Math .ceil (max .y);
					min .y = max .y - text .textBounds_ .y;
					break;
				case TextAlignment .MIDDLE:
					max .y = Math .round (max .y);
					min .y = max .y - text .textBounds_ .y;
					break;
				case TextAlignment .END:
					min .y = Math .floor (min .y);
					max .y = min .y + text .textBounds_ .y;
					break;
			}

			text .origin_ .x = min .x;
			text .origin_ .y = max .y;

			this .getBBox () .setExtents (min, max);
		},
		build: function ()
		{
			var
				fontStyle = this .getFontStyle (),
				font      = fontStyle .getFont ();

			if (! font)
				return;

			var
				text           = this .getText (),
				glyphs         = this .getGlyphs (),
				minorAlignment = this .getMinorAlignment (),
				translations   = this .getTranslations (),
				charSpacings   = this .getCharSpacings (),
				size           = fontStyle .getScale (), // in pixel
				sizeUnitsPerEm = size / font .unitsPerEm,
				normals        = text .getNormals (),
				vertices       = text .getVertices (),
				canvas         = this .canvas [0],
				cx             = this .context;

			text .getTexCoords () .push (this .texCoords);

			this .getBBox () .getExtents (min, max);
			text .getMin () .assign (min);
			text .getMax () .assign (max);
	
	      // Triangle one and two.

			normals  .push (0, 0, 1,
			                0, 0, 1,
			                0, 0, 1,
			                0, 0, 1,
			                0, 0, 1,
			                0, 0, 1);

			vertices .push (min .x, min .y, 0, 1,
			                max .x, min .y, 0, 1,
			                max .x, max .y, 0, 1,
			                min .x, min .y, 0, 1,
			                max .x, max .y, 0, 1,
			                min .x, max .y, 0, 1);

			// Generate texture.

			var
			   width  = max .x - min .x,
			   height = max .y - min .y,
			   scaleX = 1,
			   scaleY = 1;

			// Scale canvas.
	
			if (! Algorithm .isPowerOfTwo (width) || ! Algorithm .isPowerOfTwo (height))
			{
				var
					width2  = Algorithm .nextPowerOfTwo (width),
					height2 = Algorithm .nextPowerOfTwo (height);

				scaleX = width2 / width;
				scaleY = height2 / height;

				width  = width2;
				height = height2;
			}
	
			canvas .width  = width;
			canvas .height = height

			cx .resetTransform ();
			cx .scale (scaleX, scaleY);

			// Setup canvas.

			cx .fillStyle = "rgba(255,255,255,1)";
			cx .clearRect (0, 0, width, height);

			// Draw glyphs.

			if (fontStyle .horizontal_ .getValue ())
			{
				for (var l = 0, length = glyphs .length; l < length; ++ l)
				{
					var
						line         = glyphs [l],
						charSpacing  = charSpacings [l],
						translation  = translations [l],
						advanceWidth = 0;

					for (var g = 0, gl = line .length; g < gl; ++ g)
					{
						var
							glyph = line [g],
							x     = minorAlignment .x + translation .x + advanceWidth + g * charSpacing,
							y     = minorAlignment .y + translation .y;

						this .drawGlyph (cx, font, glyph, x, y, size);

						// Calculate advanceWidth.
		
						var kerning = 0;
		
						if (g + 1 < line .length)
							kerning = font .getKerningValue (glyph, line [g + 1]);
		
						advanceWidth += (glyph .advanceWidth + kerning) * sizeUnitsPerEm;
					}
				}
			}

			// Transfer texture data.

			var data = cx .getImageData (0, 0, width, height) .data;

			console .log (data);

			this .texture .setTexture (width, height, true, new Uint8Array (data), true);
		},
		drawGlyph: function (cx, font, glyph, x, y, size)
		{
			var
				components = glyph .components,
				reverse    = font .outlinesFormat === "cff";

			paths  .length = 0;
		
			if (glyph .isComposite)
			{
				for (var c = 0, cl = components .length; c < cl; ++ c)
				{
					var component = components [c];

					paths .push (glyph .getPath (component .dx / font .unitsPerEm * size + x, component .dy / font .unitsPerEm * size - y, size));
				}
			}
			else
				paths .push (glyph .getPath (x, -y, size));

			// Get curves for the current glyph.

			for (var p = 0, pl = paths .length; p < pl; ++ p)
			{
				var commands = paths [p] .commands;

				for (var i = 0, cl = commands .length; i < cl; ++ i)
				{
					var command = commands [i];

					switch (command .type)
					{
						case "M": // Start
						{
							cx .moveTo (command .x, command .y);
							continue;
						}
						case "Z": // End
						{
							cx .fill ("evenodd");
							continue;
						}
						case "L": // Linear
						{
							cx .lineTo (command .x, command .y);
							continue;
						}
						case "C": // Bezier
						{
							cx .bezierCurveTo (command .x1, command .y1, command .x2, command .y2, command .x, command .y);
							continue;
						}
						case "Q": // Cubíc
						{
						   cx .quadraticCurveTo (command .x1, command .y1, command .x, command .y);
							continue;
						}
					}
				}
			}
		},
		getGlyphExtents: function (glyph, primitiveQuality, min, max)
		{
			var
				fontStyle  = this .getFontStyle (),
				font       = fontStyle .getFont (),
				unitsPerEm = font .unitsPerEm;

			min .set (glyph .xMin / unitsPerEm, glyph .yMin / unitsPerEm, 0);
			max .set (glyph .xMax / unitsPerEm, glyph .yMax / unitsPerEm, 0);
		},
		scale: function (modelViewMatrix)
		{
			//try
			{
				// Same as in ScreenGroup

				this .screenMatrix .assign (modelViewMatrix);
				this .screenMatrix .get (translation, rotation, scale);

				var
					fontStyle   = this .getFontStyle (),
					viewport    = fontStyle .getCurrentLayer () .getViewVolume () .getViewport (),
					screenScale = fontStyle .getCurrentViewpoint () .getScreenScale (origin .set (modelViewMatrix [12], modelViewMatrix [13], modelViewMatrix [14]), viewport);
			
				this .screenMatrix .set (translation, rotation, scale .set (screenScale .x * (Algorithm .signum (scale .x) < 0 ? -1 : 1),
			                                                               screenScale .y * (Algorithm .signum (scale .y) < 0 ? -1 : 1),
			                                                               screenScale .z * (Algorithm .signum (scale .z) < 0 ? -1 : 1)));

				Matrix4 .prototype .assign .call (modelViewMatrix, this .screenMatrix);

				this .matrix .assign (modelViewMatrix) .inverse () .multLeft (this .screenMatrix);
			}
			//catch (error)
			//{ }
		},
		traverse: function (context)
		{
		   this .scale (context .modelViewMatrix);
		   this .getBrowser () .setTexture (this .texture);
		},
	});

	return ScreenText;
});
