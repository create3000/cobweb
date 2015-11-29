
define ([
	"jquery",
	"cobweb/Configuration/X3DInfoArray",
],
function ($, X3DInfoArray)
{
"use strict";

	function ExternProtoDeclarationArray (array)
	{
		return X3DInfoArray .call (this);
	}

	ExternProtoDeclarationArray .prototype = $.extend (Object .create (X3DInfoArray .prototype),
	{
		constructor: ExternProtoDeclarationArray,
	});

	return ExternProtoDeclarationArray;
});
