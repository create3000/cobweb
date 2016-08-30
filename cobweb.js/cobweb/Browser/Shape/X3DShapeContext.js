
define ([
	"cobweb/Components/Shape/Appearance",
],
function (Appearance)
{
"use strict";

	function X3DShapeContext ()
	{
		this .defaultAppearance = new Appearance (this);
		this .lineProperties    = null;
		this .material          = null;
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
		setLineProperties: function (value)
		{
			this .lineProperties = value;
		},
		getLineProperties: function ()
		{
			return this .lineProperties;
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
