
define (function ()
{
	function X3DFieldDefinition (accessType, name, value)
	{
		this .accessType = accessType;
		this .dataType   = value .getType ();
		this .name       = name;
		this .value      = value;
	}
	
	X3DFieldDefinition .prototype .constructor = X3DFieldDefinition;

	return X3DFieldDefinition;
});
