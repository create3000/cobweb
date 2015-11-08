
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

	function FieldDefinitionArray (value)
	{
		this .array = value;

		return new Proxy (this, handler);
	}

	$.extend (FieldDefinitionArray .prototype,
	{
		constructor: FieldDefinitionArray,
		getValue: function ()
		{
			return this .array;
		},
	});

	return FieldDefinitionArray;
});
