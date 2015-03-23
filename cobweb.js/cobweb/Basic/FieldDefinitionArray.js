
define ([
	"jquery",
],
function ($, X3DField, X3DConstants)
{
	var handler =
	{
		get: function (target, key)
		{
			if (key in target)
				return target [key];

			return target .value [key];
		},
		set: function (target, key, value)
		{
			return false;
		},
	};

	function FieldDefinitionArray (value)
	{
		this .value = value
		
		return new Proxy (this, handler);
	}

	$.extend (FieldDefinitionArray .prototype,
	{
		constructor: FieldDefinitionArray,
		getValue: function ()
		{
			return this .value;
		},
	});

	return FieldDefinitionArray;
});
