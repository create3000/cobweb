
define ([
	"jquery",
],
function ($)
{
"use strict";

	function UnitInfo (category, name, conversionFactor)
	{
		this .category         = category;
		this .name             = name;
		this .conversionFactor = conversionFactor;
	}

	$.extend (UnitInfo .prototype,
	{
		constructor: UnitInfo,
	});

	Object .defineProperty (UnitInfo .prototype, "conversion_factor",
	{
		get: function () { return this .conversionFactor; },
		enumerable: true,
		configurable: false
	});

	return UnitInfo;
});