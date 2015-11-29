
define ([
	"jquery",
	"cobweb/Configuration/X3DInfoArray",
],
function ($, X3DInfoArray)
{
"use strict";

	function UnitInfoArray ()
	{
		return X3DInfoArray .call (this);
	}

	UnitInfoArray .prototype = $.extend (Object .create (X3DInfoArray .prototype),
	{
		constructor: UnitInfoArray,
	});

	return UnitInfoArray;
});
