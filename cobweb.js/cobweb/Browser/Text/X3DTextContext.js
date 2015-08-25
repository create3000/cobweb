
define ([
	"cobweb/Components/Text/FontStyle",
],
function (FontStyle)
{
	function X3DTextContext ()
	{
		this .defaultFontStyle = new FontStyle (this);
	}

	X3DTextContext .prototype =
	{
		initialize: function ()
		{
			this .defaultFontStyle .setup ();
		},
		getDefaultFontStyle: function ()
		{
			return this .defaultFontStyle;
		},
	};

	return X3DTextContext;
});
