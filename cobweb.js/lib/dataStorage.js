
define (function ()
{
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
		   if (value === undefined)
		      localStorage .removeItem (key);
		   else
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
		clear: function ()
		{
			return localStorage .clear ();
		},
	}

	return new DataStorage ();
});