
define ([
	"jquery",
	"cobweb/Configuration/X3DInfoArray",
	"cobweb/Configuration/ComponentInfo",
],
function ($, X3DInfoArray, ComponentInfo)
{
"use strict";

	function ComponentInfoArray (browser, array)
	{
		this .browser = browser;

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
		addComponentInfo: function (value)
		{
			this .add (value .name, new ComponentInfo (this .browser, value));
		}
	});

	return ComponentInfoArray;
});
