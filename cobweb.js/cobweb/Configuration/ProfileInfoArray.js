
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

	function ProfileInfoArray (array)
	{
		this .array = array || [ ];

		return new Proxy (this, handler);
	}

	$.extend (ProfileInfoArray .prototype,
	{
		constructor: ProfileInfoArray,
		getValue: function ()
		{
			return this .array;
		},
	});

	Object .defineProperty (ProfileInfoArray .prototype, "length",
	{
		get: function () { return this .array .length; },
		enumerable: false,
		configurable: false
	});

	return ProfileInfoArray;
});
