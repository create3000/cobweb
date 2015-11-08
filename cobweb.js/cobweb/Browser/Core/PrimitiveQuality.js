
define (function ()
{
"use strict";
	
	var i = 0;

	var PrimitiveQuality =
	{
		LOW:    i ++,
		MEDIUM: i ++,
		HIGH:   i ++,
	};

	Object .preventExtensions (PrimitiveQuality);
	Object .freeze (PrimitiveQuality);
	Object .seal (PrimitiveQuality);

	return PrimitiveQuality;
});
