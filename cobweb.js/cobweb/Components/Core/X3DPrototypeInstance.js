
define ([
	"jquery",
	"cobweb/Components/Core/X3DNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DNode, 
          X3DConstants)
{
	function X3DPrototypeInstance (browser, executionContext)
	{
		X3DNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DPrototypeInstance);

		this .setExtendedEventHandling (false);
	}

	X3DPrototypeInstance .prototype = $.extend (new X3DNode (),
	{
		constructor: X3DPrototypeInstance,
	});

	return X3DPrototypeInstance;
});

