
define ([
	"cobweb/Components/Text/FontStyle",
],
function (FontStyle)
{
"use strict";

	function X3DTextContext ()
	{
		this .fontCache         = { };
		this .fontGeometryCache = { }; // [fontName] [primitveQuality] [glyphIndex]
	}

	X3DTextContext .prototype =
	{
		initialize: function ()
		{
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
		getFontCache: function ()
		{
			return this .fontCache;
		},
		getFontGeometryCache: function ()
		{
		   return this .fontGeometryCache;
		},
	};

	return X3DTextContext;
});
