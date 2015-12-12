
define (function ()
{
"use strict";
	
	var i = 0;

	var TextureQuality =
	{
		LOW:    i ++,
		MEDIUM: i ++,
		HIGH:   i ++,
	};

	Object .preventExtensions (TextureQuality);
	Object .freeze (TextureQuality);
	Object .seal (TextureQuality);

	return TextureQuality;
});
