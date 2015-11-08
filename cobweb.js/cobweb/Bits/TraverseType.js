
define (function ()
{
"use strict";

	var i = 0;

	var TraverseType =
	{
		POINTER:   i ++,
		CAMERA:    i ++,
		COLLISION: i ++,
		DISPLAY:   i ++,
	};

	Object .preventExtensions (TraverseType);
	Object .freeze (TraverseType);
	Object .seal (TraverseType);

	return TraverseType;
});
