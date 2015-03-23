
define (function ()
{
	var i = 0;

	var TraverseType =
	{
		POINTER:    i ++,
		CAMERA:     i ++,
		NAVIGATION: i ++,
		COLLISION:  i ++,
		POINTER:    i ++,
		DISPLAY:    i ++,
	};

	Object .preventExtensions (TraverseType);
	Object .freeze (TraverseType);
	Object .seal (TraverseType);

	return TraverseType;
});
