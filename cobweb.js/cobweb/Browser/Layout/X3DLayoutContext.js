
define ([
	"jquery",
	"cobweb/Components/Texturing/TextureProperties",
],
function ($, TextureProperties)
{
"use strict";

	function X3DLayoutContext ()
	{
		this .layouts = [ ];

		this .screenTextureProperties = new TextureProperties (this);
	}

	X3DLayoutContext .prototype =
	{
		initialize: function ()
		{
			this .screenTextureProperties .boundaryModeS_       = "CLAMP_TO_EDGE";
			this .screenTextureProperties .boundaryModeT_       = "CLAMP_TO_EDGE";
			this .screenTextureProperties .boundaryModeR_       = "CLAMP_TO_EDGE";
			this .screenTextureProperties .minificationFilter_  = "NEAREST_PIXEL";
			this .screenTextureProperties .magnificationFilter_ = "NEAREST_PIXEL";

			this .screenTextureProperties .setup ();

			var div = $("<div>");
			this .pointSize = div .appendTo ($("body")) .css ("height", "1in") .height () / 72;
			div .remove ();
		},
		getLayouts: function ()
		{
			return this .layouts;
		},
		getParentLayout: function ()
		{
			return this .layouts .length ? this .layouts [this .layouts .length - 1] : null;
		},
		getScreenTextureProperties: function ()
		{
		   return this .screenTextureProperties;
		},
		getPointSize: function ()
		{
		   return this .pointSize;
		},
	};

	return X3DLayoutContext;
});
