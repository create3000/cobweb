
define (function ()
{
	function X3DFieldDefinition (accessType, name, value, userDefined)
	{
		this .accessType  = accessType;
		this .dataType    = value .getType ();
		this .name        = name;
		this .value       = value;
		this .userDefined = userDefined;
	}

	X3DFieldDefinition .prototype .constructor = X3DFieldDefinition;

	return X3DFieldDefinition;
});
