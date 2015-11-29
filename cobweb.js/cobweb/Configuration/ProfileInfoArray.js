
define ([
	"jquery",
	"cobweb/Configuration/X3DInfoArray",
],
function ($, X3DInfoArray)
{
"use strict";

	function ProfileInfoArray ()
	{
		return X3DInfoArray .call (this);
	}

	ProfileInfoArray .prototype = $.extend (Object .create (X3DInfoArray .prototype),
	{
		constructor: ProfileInfoArray,
	});

	return ProfileInfoArray;
});
