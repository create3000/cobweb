
define ([
	"jquery",
	"cobweb/Components/PointingDeviceSensor/X3DPointingDeviceSensorNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DPointingDeviceSensorNode, 
          X3DConstants)
{
	function X3DTouchSensorNode (browser, executionContext)
	{
		X3DPointingDeviceSensorNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DTouchSensorNode);
	}

	X3DTouchSensorNode .prototype = $.extend (new X3DPointingDeviceSensorNode (),
	{
		constructor: X3DTouchSensorNode,
	});

	return X3DTouchSensorNode;
});

