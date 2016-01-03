
define ([
	"jquery",
	"cobweb/Components/Core/X3DNode",
	"cobweb/InputOutput/Loader",
	"cobweb/Bits/X3DConstants",
	"cobweb/Browser/Networking/urls",
	"standard/Networking/URI",
	"lib/opentype.js/dist/opentype.js",
],
function ($,
          X3DNode, 
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

	//

	var i = 0;

	var Alignment =
	{
	   BEGIN:  ++ i,
	   FIRST:  ++ i,
	   MIDDLE: ++ i,
	   END:    ++ i,
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
								        : majorNormal ? Alignment .BEGIN : Alignment .END;

			var minorNormal = this .horizontal_ .getValue () ? this .topToBottom_ .getValue () : this .leftToRight_ .getValue ();

			this .alignments [1] = this .justify_ .length > 1
			                       ? this .getAlignment (1, minorNormal)
								        : minorNormal ? Alignment .FIRST : Alignment .END;
		},
		getAlignment: function (index, normal)
		{
			if (normal)
			{
				// Return for west-european normal alignment.

				switch (this .justify_ [index])
				{
					case "FIRST":  return Alignment .FIRST;
					case "BEGIN":  return Alignment .BEGIN;
					case "MIDDLE": return Alignment .MIDDLE;
					case "END":    return Alignment .END;
				}
			}
			else
			{
				// Return appropriate alignment if topToBottom or leftToRight are FALSE.

				switch (this .justify_ [index])
				{
					case "FIRST":  return Alignment .END;
					case "BEGIN":  return Alignment .END;
					case "MIDDLE": return Alignment .MIDDLE;
					case "END":    return Alignment .BEGIN;
				}
			}

			return index ? Alignment .FIRST : Alignment .BEGIN;
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
					var
						familyName = this .family [this .familyIndex],
						fontPath   = this .loader .transform (familyName);

					opentype .load (fontPath, this .setFont .bind (this));
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
		setFont: function (error, font)
		{
			if (error)
			{
			   this .setError (error);
			}
			else
			{
				//console .log ('Font loaded fine:', font .familyName, font .styleName);

				this .font     = font;
				font .fontName = font .familyName + font .styleName;
		   
		      // Workaround to initialize composite glyphs.
		      for (var i = 0; i < this .font .numGlyphs; ++ i)
					this .font .glyphs .get (i) .getPath (0, 0, 1);

				this .addNodeEvent ();
			}
		},
		getFont: function ()
		{
		   return this .font;
		},
		setError: function (error)
		{
			var
				family = this .family [this .familyIndex],
				URL   = new URI (family);

			this .font = null;
			this .familyIndex ++;

			if (! URL .isLocal ())
			{
				if (! family .toString () .match (urls .fallbackRx))
					this .family .splice (this .familyIndex, 0, urls .fallback + family);
			}

			console .warn ("Error loading font '" + family + "':", error);
			this .loadFont ();
		},
	});

	X3DFontStyleNode .Alignment = Alignment;

	return X3DFontStyleNode;
});


