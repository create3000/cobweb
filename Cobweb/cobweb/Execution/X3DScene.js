
define ([
	"jquery",
	"cobweb/Execution/X3DExecutionContext",
],
function ($, X3DExecutionContext)
{
	function X3DScene (browser, executionContext)
	{
		X3DExecutionContext .call (this, browser, executionContext);
	}

	X3DScene .prototype = $.extend (new X3DExecutionContext (),
	{
		constructor: X3DScene,
		setRootNodes: function (value)
		{
			this .getRootNodes () .setValue (value);
		},
	});

	return X3DScene;
});
