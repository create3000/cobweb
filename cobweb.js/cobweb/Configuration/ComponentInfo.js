
define ([
	"cobweb/Fields",
],
function (Fields)
{
"use strict";

	function url (browser, name)
	{
		return new Fields .MFString (
			"https://cdn.rawgit.com/create3000/cobweb/master/stable/%s/%s/Components/%s.js"
		);
	}

	function ComponentInfo (browser, name, level, title, providerUrl)
	{
console .log (name, browser);

		this .browser     = browser;
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