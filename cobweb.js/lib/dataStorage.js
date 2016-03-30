
define (function ()
{
"use strict";

	var handler =
	{
		get: function (target, key)
		{
			if (key in target)
				return target [key];
			
			if (localStorage [key] === undefined)
			   return undefined;

			return JSON .parse (localStorage [key])
		},
		set: function (target, key, value)
		{
			localStorage [key] = JSON .stringify (value);
			return true;
		},
	};

	function DataStorage ()
	{
		return new Proxy (this, handler);
	}

	DataStorage .prototype = {
		constructor: DataStorage,
		removeItem: function (key)
		{
			return localStorage .removeItem (key);
		},
		clear: function ()
		{
			return localStorage .clear ();
		},
	}

	return new DataStorage ();
});