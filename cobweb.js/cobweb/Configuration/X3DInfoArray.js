
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

			if (key in target .array)
				return target .array [key];

			return target .index [key];
		},
		set: function (target, key, value)
		{
			return false;
		},
		has: function (target, key)
		{
			return key in target .array || key in target .index;
		},
		enumerate: function (target)
		{
			return Object .keys (target .array) [Symbol.iterator] ();
		},
	};

	function X3DInfoArray ()
	{
		this .array = [ ];
		this .index = { };

		return new Proxy (this, handler);
	}

	$.extend (X3DInfoArray .prototype,
	{
		constructor: X3DInfoArray,
		add: function (key, value)
		{
			this .array .push (value);
			this .index [key] = value;
		},
		get: function (key)
		{
			return this .index [key];
		},
	});

	return X3DInfoArray;
});
