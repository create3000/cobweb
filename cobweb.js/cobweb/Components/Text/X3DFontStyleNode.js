
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Components/Core/X3DNode",
	"cobweb/Components/Networking/X3DUrlObject",
	"cobweb/Browser/Text/TextAlignment",
	"cobweb/InputOutput/Loader",
	"cobweb/Bits/X3DConstants",
	"cobweb/Browser/Networking/urls",
	"standard/Networking/URI",
	"lib/opentype.js/dist/opentype.js",
],
function ($,
          Fields,
          X3DNode,
          X3DUrlObject,
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

	function X3DFontStyleNode (executionContext)
	{
		X3DNode .call (this, executionContext);

		this .addType (X3DConstants .X3DFontStyleNode);
		
		this .addChildren ("loadState", new Fields .SFInt32 (X3DConstants .NOT_STARTED_STATE));

		this .familyStack = [ ];
		this .alignments  = [ ];
		this .loader      = new Loader (this);
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

			this .requestAsyncLoad ();
		},
		setLoadState: X3DUrlObject .prototype .setLoadState,
		checkLoadState: X3DUrlObject .prototype .checkLoadState,
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
			this .setLoadState (X3DConstants .NOT_STARTED_STATE);

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
			if (this .checkLoadState () === X3DConstants .COMPLETE_STATE || this .checkLoadState () === X3DConstants .IN_PROGRESS_STATE)
				return;

			this .setLoadState (X3DConstants .IN_PROGRESS_STATE);

			// Add default font to family array.

			var family = this .family_ .copy ();

			family .push ("SERIF");

			// Build family stack.

			this .familyStack .length = 0;

			for (var i = 0, length = family .length; i < length; ++ i)
			{
			   var
			      familyName  = family [i],
			      defaultFont = this .getDefaultFont (familyName);
			   
				if (defaultFont)
				{
				   for (var d = 0; d < FontDirectories .length; ++ d)
				      this .familyStack .push (FontDirectories [d] + defaultFont);
				}
				else
					this .familyStack .push (familyName);
			}

			this .loadNext ();
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
		loadNext: function ()
		{
			try
			{
				if (this .familyStack .length === 0)
				{
					this .setLoadState (X3DConstants .FAILED_STATE);
					this .font = null;
					return;
				}

				this .family = this .familyStack .shift ();
				this .URL    = this .loader .transform (this .family);
	
				var font = this .getBrowser () .getFont (this .URL);

				if (font)
					return this .setFont (font);
	
				if (font === false)
					return this .setError ("Couldn't load font.");
	
				this .getBrowser () .addFont (this .URL, true);
	
				opentype .load (this .URL, this .addFont .bind (this));
			}
			catch (error)
			{
				this .setError (error .message);
			}
		},
		setError: function (error)
		{
			this .getBrowser () .addFont (this .URL, false);
	
			var URL = this .URL .toString ();

			if (! this .URL .isLocal ())
			{
				if (! URL .match (urls .fallbackExpression))
					this .familyStack .unshift (urls .fallbackUrl + URL);
			}

			if (this .URL .scheme !== "data")
				console .warn ("Error loading font '" + this .URL .toString () + "':", error);

			this .loadNext ();
		},
		addFont: function (error, font)
		{
			if (error)
			{
			   this .setError (error);
			}
			else
			{
				this .getBrowser () .addFont (this .URL, font);
				this .setFont (font);
			}
		},
		setFont: function (font)
		{
			if (font === true)
			{
				this .familyStack .unshift (this .family);
				setTimeout (this .loadNext .bind (this), 10);
				return;
			}

			this .font = font;

			this .setLoadState (X3DConstants .COMPLETE_STATE);
			this .addNodeEvent ();
		},
		getFont: function ()
		{
		   return this .font;
		},
	});

	return X3DFontStyleNode;
});


