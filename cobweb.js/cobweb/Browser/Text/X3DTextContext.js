
define ([
	"cobweb/Components/Text/FontStyle",
],
function (FontStyle)
{
"use strict";

	function X3DTextContext ()
	{
		this .fontGeometryCache = { }; // [fontName] [primitveQuality] [glyphIndex]
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
				this .defaultFontStyle = new FontStyle (this .getPrivateScene ());
				this .defaultFontStyle .setup ();
			}

			return this .defaultFontStyle;
		},
		getFontGeometryCache: function ()
		{
		   return this .fontGeometryCache;
		},
		set_shutdown_TextContext: function ()
		{
		   this .fontGeometryCache = { };
		},
	};

	return X3DTextContext;
});
