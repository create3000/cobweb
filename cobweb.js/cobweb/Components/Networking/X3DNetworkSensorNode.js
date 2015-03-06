
define ([
	"jquery",
	"cobweb/Components/Core/X3DSensorNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DSensorNode, 
          X3DConstants)
{
	function X3DNetworkSensorNode (browser, executionContext)
	{
		X3DSensorNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DNetworkSensorNode);
	}

	X3DNetworkSensorNode .prototype = $.extend (new X3DSensorNode (),
	{
		constructor: X3DNetworkSensorNode,
	});

	return X3DNetworkSensorNode;
});
