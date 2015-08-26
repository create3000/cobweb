
define ([
	"cobweb/Components/Text/FontStyle",
],
function (FontStyle)
{
	function X3DTextContext ()
	{
		this .glyphCache = { }; // [fontName] [primitveQuality] [glyphIndex]
	}

	X3DTextContext .prototype =
	{
		initialize: function ()
		{
		   this .getBrowser () .shutdown () .addInterest (this, "set_shutdown_TextContext");
		},
		getDefaultFontStyle: function ()
		{
			if (! this .defaultFontStyle)
			{
				this .defaultFontStyle = new FontStyle (this);
				this .defaultFontStyle .setup ();
			}

			return this .defaultFontStyle;
		},
		getGlyphCache: function ()
		{
		   return this .glyphCache;
		},
		set_shutdown_TextContext: function ()
		{
		   this .glyphCache = { };
		},
	};

	return X3DTextContext;
});
