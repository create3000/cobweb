
define ([
	"jquery",
	"cobweb/Components/Core/X3DNode",
	"cobweb/Browser/Text/TextAlignment",
	"cobweb/InputOutput/Loader",
	"cobweb/Bits/X3DConstants",
	"cobweb/Browser/Networking/urls",
	"standard/Networking/URI",
	"lib/opentype.js/dist/opentype.js",
],
function ($,
          X3DNode,
          TextAlignment,
          Loader,
          X3DConstants,
          urls,
          URI,
          opentype)
{
"use strict";

   /*
    * Font paths for default SERIF, SANS and TYPWRITER families.
    */

	var FontDirectories = [
		"https://cdn.rawgit.com/create3000/cobweb/master/cobweb.js/fonts/",
		"http://cdn.rawgit.com/create3000/cobweb/master/cobweb.js/fonts/",
		"https://rawgit.com/create3000/cobweb/master/cobweb.js/fonts/",
		"http://rawgit.com/create3000/cobweb/master/cobweb.js/fonts/",
		"http://titania.create3000.de/fileadmin/cobweb/fonts/",
	];

	var Fonts =
	{
	   SERIF: {
	      PLAIN:      "DroidSerif-Regular.ttf",
	      ITALIC:     "DroidSerif-Italic.ttf",
	      BOLD:       "DroidSerif-Bold.ttf",
	      BOLDITALIC: "DroidSerif-BoldItalic.ttf",
	   },
	   SANS: {
	      PLAIN:      "Ubuntu-R.ttf",
	      ITALIC:     "Ubuntu-RI.ttf",
	      BOLD:       "Ubuntu-B.ttf",
	      BOLDITALIC: "Ubuntu-BI.ttf",
	   },
	   TYPEWRITER: {
	      PLAIN:      "UbuntuMono-R.ttf",
	      ITALIC:     "UbuntuMono-RI.ttf",
	      BOLD:       "UbuntuMono-B.ttf",
	      BOLDITALIC: "UbuntuMono-BI.ttf",
	   },
	};

	function X3DFontStyleNode (browser, executionContext)
	{
		X3DNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DFontStyleNode);

		this .family     = [ ];
		this .alignments = [ ];
		this .loader     = new Loader (this, true);
	}

	X3DFontStyleNode .prototype = $.extend (Object .create (X3DNode .prototype),
	{
		constructor: X3DFontStyleNode,
		initialize: function ()
		{
		   X3DNode .prototype .initialize .call (this);

		   this .style_   .addInterest (this, "set_style__");
		   this .justify_ .addInterest (this, "set_justify__");

			this .font        = null;
			this .familyIndex = 0;

		   this .set_justify__ ();
		   this .set_style__ ();
		},
		getMajorAlignment: function ()
		{
			return this .alignments [0];
		},
		getMinorAlignment: function ()
		{
			return this .alignments [1];
		},
		set_style__: function ()
		{
		   //var style = this .style_ .getValue ();

			//this .italic = (style == "ITALIC" || style == "BOLDITALIC");
			//this .bold   = (style == "BOLD"   || style == "BOLDITALIC");
		  
		   this .requestAsyncLoad ();
		},
		set_justify__: function ()
		{
			var majorNormal = this .horizontal_ .getValue () ? this .leftToRight_ .getValue () : this .topToBottom_ .getValue ();

			this .alignments [0] = this .justify_ .length > 0
			                       ? this .getAlignment (0, majorNormal)
								        : majorNormal ? TextAlignment .BEGIN : TextAlignment .END;

			var minorNormal = this .horizontal_ .getValue () ? this .topToBottom_ .getValue () : this .leftToRight_ .getValue ();

			this .alignments [1] = this .justify_ .length > 1
			                       ? this .getAlignment (1, minorNormal)
								        : minorNormal ? TextAlignment .FIRST : TextAlignment .END;
		},
		getAlignment: function (index, normal)
		{
			if (normal)
			{
				// Return for west-european normal alignment.

				switch (this .justify_ [index])
				{
					case "FIRST":  return TextAlignment .FIRST;
					case "BEGIN":  return TextAlignment .BEGIN;
					case "MIDDLE": return TextAlignment .MIDDLE;
					case "END":    return TextAlignment .END;
				}
			}
			else
			{
				// Return appropriate alignment if topToBottom or leftToRight are FALSE.

				switch (this .justify_ [index])
				{
					case "FIRST":  return TextAlignment .END;
					case "BEGIN":  return TextAlignment .END;
					case "MIDDLE": return TextAlignment .MIDDLE;
					case "END":    return TextAlignment .BEGIN;
				}
			}

			return index ? TextAlignment .FIRST : TextAlignment .BEGIN;
		},
		requestAsyncLoad: function ()
		{
			this .familyIndex    = 0;
			this .family .length = 0;

			var family = this .family_ .copy ();

			family .push ("SERIF");

			for (var i = 0; i < family .length; ++ i)
			{
			   var
			      familyName  = family [i],
			      defaultFont = this .getDefaultFont (familyName);
			   
				if (defaultFont)
				{
				   for (var d = 0; d < FontDirectories .length; ++ d)
				      this .family .push (FontDirectories [d] + defaultFont);
				}
				else
					this .family .push (familyName);
			}

			this .loadFont ();
		},
		loadFont: function ()
		{
			try
			{
			   if (this .familyIndex < this .family .length)
			   {
					var familyName = this .family [this .familyIndex];

					this .URL = this .loader .transform (familyName);

					if (this .URL .query .length === 0)
					{
						var font = this .getBrowser () .getFontCache () [this .URL .filename];

						console .log (this .URL .filename .toString (), font);

						if (font)
							return this .setFont (font);

						this .getBrowser () .getFontCache () [this .URL .filename] = true;
					}

					opentype .load (this .URL, this .addFont .bind (this));
				}
			}
			catch (error)
			{
				this .setError (error .message);
			}
		},
		getDefaultFont: function (familyName)
		{
		   var family = Fonts [familyName];

		   if (family)
		   {
		      var style = family [this .style_ .getValue ()];

		      if (style)
		         return style;

		      return family .PLAIN;
		   }

		   return;
		},
		addFont: function (error, font)
		{
			if (error)
			{
			   this .setError (error);
			}
			else
			{
				//console .log ('Font loaded fine:', font .familyName, font .styleName);

				if (this .URL .query .length === 0)
					this .getBrowser () .getFontCache () [this .URL .filename] = font;

				this .setFont (font);
			}
		},
		setFont: function (font)
		{
			if (font === true)
				return setTimeout (this .loadFont .bind (this), 100);

			this .font     = font;
			font .fontName = font .familyName + font .styleName;

			// Workaround to initialize composite glyphs.
			for (var i = 0; i < this .font .numGlyphs; ++ i)
				this .font .glyphs .get (i) .getPath (0, 0, 1);

			this .addNodeEvent ();
		},
		getFont: function ()
		{
		   return this .font;
		},
		setError: function (error)
		{
			if (this .URL .query .length === 0)
				delete this .getBrowser () .getFontCache () [this .URL .filename];

			var family = this .family [this .familyIndex];

			this .font = null;
			this .familyIndex ++;

			if (! this .URL .isLocal ())
			{
				if (! family .toString () .match (urls .fallbackRx))
					this .family .splice (this .familyIndex, 0, urls .fallback + family);
			}

			console .warn ("Error loading font '" + family + "':", error);
			this .loadFont ();
		},
	});

	return X3DFontStyleNode;
});


