
define (function ()
{
"use strict";

	function X3DLayoutContext ()
	{
		this .layouts = [ ];
	}

	X3DLayoutContext .prototype =
	{
		initialize: function () { },
		getLayouts: function ()
		{
			return this .layouts;
		},
		getParentLayout: function ()
		{
			return this .layouts .length ? this .layouts [this .layouts .length - 1] : null;
		},
	};

	return X3DLayoutContext;
});
