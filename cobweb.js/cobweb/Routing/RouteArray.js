
define ([
	"jquery",
],
function ($)
{
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

	function RouteArray ()
	{
		this .array = [ ];
		
		return new Proxy (this, handler);
	}

	$.extend (RouteArray .prototype,
	{
		constructor: RouteArray,
		getValue: function ()
		{
			return this .array;
		},
	});

	return RouteArray;
});
