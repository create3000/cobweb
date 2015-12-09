
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

	return UnitInfo;
});