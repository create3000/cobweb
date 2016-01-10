
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DConstants)
{
"use strict";

	function ComponentInfo (browser, value)
	{
		this .name        = value .name;
		this .level       = value .level;
		this .title       = value .title;
		this .providerUrl = value .providerUrl;

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