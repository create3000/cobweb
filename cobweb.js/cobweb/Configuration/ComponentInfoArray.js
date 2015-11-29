
define ([
	"jquery",
	"cobweb/Configuration/X3DInfoArray",
],
function ($, X3DInfoArray)
{
"use strict";

	function ComponentInfoArray (array)
	{
		var proxy = X3DInfoArray .call (this);

		if (array)
		{
			for (var i = 0, length = array .length; i < length; ++ i)
				this .add (array [i] .name, array [i]);
		}

		return proxy;
	}

	ComponentInfoArray .prototype = $.extend (Object .create (X3DInfoArray .prototype),
	{
		constructor: ComponentInfoArray,
	});

	return ComponentInfoArray;
});
