
define ([
	"cobweb/Components/Shape/Appearance",
],
function (Appearance)
{
"use strict";

	function X3DShapeContext ()
	{
		this .defaultAppearance = new Appearance (this);
	}

	X3DShapeContext .prototype =
	{
		initialize: function ()
		{
			this .defaultAppearance .setup ();
		},
		getDefaultAppearance: function ()
		{
			return this .defaultAppearance;
		},
		setMaterial: function (value)
		{
			this .material = value;
		},
		getMaterial: function ()
		{
			return this .material;
		},
	};

	return X3DShapeContext;
});
