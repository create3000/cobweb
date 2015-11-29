
define ([
	"jquery",
],
function ($)
{
"use strict";

	function ComponentInfo (name, level, title, providerUrl)
	{
		this .name        = name;
		this .level       = level;
		this .title       = title;
		this .providerUrl = providerUrl;

		Object .preventExtensions (this);
		Object .freeze (this);
		Object .seal (this);
	}

	$.extend (ComponentInfo .prototype,
	{
		constructor: ComponentInfo,
	});

	return ComponentInfo;
});