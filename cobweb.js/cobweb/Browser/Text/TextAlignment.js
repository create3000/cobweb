
define (function ()
{
"use strict";
	
	var i = 0;

	var TextAlignment =
	{
	   BEGIN:  ++ i,
	   FIRST:  ++ i,
	   MIDDLE: ++ i,
	   END:    ++ i,
	};

	Object .preventExtensions (TextAlignment);
	Object .freeze (TextAlignment);
	Object .seal (TextAlignment);

	return TextAlignment;
});
