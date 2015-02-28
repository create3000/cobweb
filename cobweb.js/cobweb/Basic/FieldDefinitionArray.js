
define (function ($, X3DField, X3DConstants)
{
	var handler =
	{
		get: function (target, key)
		{
			return target .array [key];
		},
		set: function (target, key, value)
		{
			return false;
		},
	};

	function FieldDefinitionArray (array)
	{
		this .array = array
		
		return new Proxy (this, handler);
	}

	FieldDefinitionArray .prototype .constructor = FieldDefinitionArray;

	return FieldDefinitionArray;
});
