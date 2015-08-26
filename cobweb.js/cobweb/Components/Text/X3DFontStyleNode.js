
define ([
	"jquery",
	"cobweb/Components/Core/X3DNode",
	"cobweb/InputOutput/Loader",
	"cobweb/Bits/X3DConstants",
	"opentype",
],
function ($,
          X3DNode, 
          Loader,
          X3DConstants,
          opentype)
{
   /*
    * Font paths for default SERIF, SANS and TYPWRITER families.
    */

	var FontDirectory = "https://cdn.rawgit.com/holger-seelig/cobweb/master/cobweb.js/fonts/";

	var Fonts =
	{
	   SERIF: {
	      PLAIN:      FontDirectory + "DroidSerif-Regular.ttf",
	      ITALIC:     FontDirectory + "DroidSerif-Italic.ttf",
	      BOLD:       FontDirectory + "DroidSerif-Bold.ttf",
	      BOLDITALIC: FontDirectory + "DroidSerif-BoldItalic.ttf",
	   },
	   SANS: {
	      PLAIN:      FontDirectory + "Ubuntu-R.ttf",
	      ITALIC:     FontDirectory + "Ubuntu-RI.ttf",
	      BOLD:       FontDirectory + "Ubuntu-B.ttf",
	      BOLDITALIC: FontDirectory + "Ubuntu-BI.ttf",
	   },
	   TYPEWRITER: {
	      PLAIN:      FontDirectory + "UbuntuMono-R.ttf",
	      ITALIC:     FontDirectory + "UbuntuMono-RI.ttf",
	      BOLD:       FontDirectory + "UbuntuMono-B.ttf",
	      BOLDITALIC: FontDirectory + "UbuntuMono-BI.ttf",
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

		this .alignments = [ ];
		this .loader     = new Loader (this);
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
			this .familyIndex = 0;

			this .loadFont ();
		},
		loadFont: function ()
		{
			try
			{
			   if (this .familyIndex < this .family_ .length)
			   {
					var
						familyName = this .family_ [this .familyIndex],
						fontPath   = this .getDefaultFont (familyName) || this .loader .transform (familyName);

					opentype .load (fontPath, this .setFont .bind (this));
				}
				else if (this .familyIndex === this .family_ .length)
				   opentype .load (this .getDefaultFont ("SERIF"), this .setFont .bind (this));
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
				console .log ('Font loaded fine:', font .familyName, font .styleName);

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
			this .font = null;
			this .familyIndex ++;

			console .warn ('Font could not be loaded: ' + error);

			this .loadFont ();
		},
	});

	X3DFontStyleNode .Alignment = Alignment;

	return X3DFontStyleNode;
});

