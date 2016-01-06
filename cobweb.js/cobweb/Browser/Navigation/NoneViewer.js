
define ([
	"jquery",
	"cobweb/Browser/Navigation/X3DViewer",
	"lib/gettext",
],
function ($, X3DViewer, _)
{
"use strict";
	
	function NoneViewer (executionContext)
	{
		X3DViewer .call (this, executionContext);
	}

	NoneViewer .prototype = $.extend (Object .create (X3DViewer .prototype),
	{
		constructor: NoneViewer,
	});

	return NoneViewer;
});
