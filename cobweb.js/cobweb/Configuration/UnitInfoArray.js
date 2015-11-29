
define ([
	"jquery",
],
function ($)
{
"use strict";

	var handler =
	{
		get: function (target, key)
		{
			if (key in target)
				return target [key];

			return target .array [key];
		},
		set: function (target, key, value)
		{
			return false;
		},
	};

	function UnitInfoArray (units)
	{
		var array = [ ];

		for (var category in units)
			array .push (units [category]);

		this .array = array;

		return new Proxy (this, handler);
	}

	$.extend (UnitInfoArray .prototype,
	{
		constructor: UnitInfoArray,
		getValue: function ()
		{
			return this .array;
		},
	});

	Object .defineProperty (UnitInfoArray .prototype, "length",
	{
		get: function () { return this .array .length; },
		enumerable: false,
		configurable: false
	});

	return UnitInfoArray;
});
