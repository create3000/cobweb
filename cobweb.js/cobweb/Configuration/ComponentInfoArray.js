
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

	function ComponentInfoArray (array)
	{
		this .array = array || [ ];

		return new Proxy (this, handler);
	}

	$.extend (ComponentInfoArray .prototype,
	{
		constructor: ComponentInfoArray,
		getValue: function ()
		{
			return this .array;
		},
	});

	Object .defineProperty (ComponentInfoArray .prototype, "length",
	{
		get: function () { return this .array .length; },
		enumerable: false,
		configurable: false
	});

	return ComponentInfoArray;
});
