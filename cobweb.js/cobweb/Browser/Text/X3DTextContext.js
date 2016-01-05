
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
		addFont: function (URL, font)
		{
			if (URL .query .length === 0)
				this .fontCache [URL] = font;
		},
		getFont: function (URL)
		{
			if (URL .query .length === 0)
				return this .fontCache [URL .filename];

			return null;
		},
		getFontGeometryCache: function ()
		{
		   return this .fontGeometryCache;
		},
	};

	return X3DTextContext;
});
