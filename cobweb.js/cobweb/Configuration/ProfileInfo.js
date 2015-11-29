
define ([
	"jquery",
],
function ($)
{
"use strict";

	function ProfileInfo (name, title, providerUrl, components)
	{
		this .name        = name;
		this .title       = title;
		this .providerUrl = providerUrl;
		this .components  = components;

		Object .preventExtensions (this);
		Object .freeze (this);
		Object .seal (this);
	}

	$.extend (ProfileInfo .prototype,
	{
		constructor: ProfileInfo,
	});

	return ProfileInfo;
});