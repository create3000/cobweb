
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Execution/X3DExecutionContext",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DExecutionContext,
          X3DConstants)
{
"use strict";

	function X3DScene (browser, executionContext)
	{
		X3DExecutionContext .call (this, browser, executionContext);

		this .getRootNodes () .setAccessType (X3DConstants .inputOutput);
	}

	X3DScene .prototype = $.extend (Object .create (X3DExecutionContext .prototype),
	{
		constructor: X3DScene,
		isRootContext: function ()
		{
			return true;
		},
		setRootNodes: function (value)
		{
			this .getRootNodes () .setValue (value);
		},
	});

	return X3DScene;
});
