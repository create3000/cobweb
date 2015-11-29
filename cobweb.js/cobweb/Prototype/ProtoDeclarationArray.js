
define ([
	"jquery",
	"cobweb/Configuration/X3DInfoArray",
],
function ($, X3DInfoArray)
{
"use strict";

	function ProtoDeclarationArray (array)
	{
		return X3DInfoArray .call (this);
	}

	ProtoDeclarationArray .prototype = $.extend (Object .create (X3DInfoArray .prototype),
	{
		constructor: ProtoDeclarationArray,
	});

	return ProtoDeclarationArray;
});
