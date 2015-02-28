
define ([
	"jquery",
	"cobweb/Components/Core/X3DSensorNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DSensorNode, 
          X3DConstants)
{
	function X3DPointingDeviceSensorNode (browser, executionContext)
	{
		X3DSensorNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DPointingDeviceSensorNode);
	}

	X3DPointingDeviceSensorNode .prototype = $.extend (new X3DSensorNode (),
	{
		constructor: X3DPointingDeviceSensorNode,
	});

	return X3DPointingDeviceSensorNode;
});

