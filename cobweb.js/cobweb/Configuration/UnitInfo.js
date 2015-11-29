
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

		Object .preventExtensions (this);
		Object .freeze (this);
		Object .seal (this);
	}

	$.extend (UnitInfo .prototype,
	{
		constructor: UnitInfo,
	});

	return UnitInfo;
});