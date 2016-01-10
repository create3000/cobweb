
define (function ()
{
"use strict";

	function X3DFieldDefinition (accessType, name, value)
	{
		this .accessType  = accessType;
		this .dataType    = value .getType ();
		this .name        = name;
		this .value       = value;

		Object .preventExtensions (this);
		Object .freeze (this);
		Object .seal (this);
	}

	X3DFieldDefinition .prototype .constructor = X3DFieldDefinition;

	return X3DFieldDefinition;
});
