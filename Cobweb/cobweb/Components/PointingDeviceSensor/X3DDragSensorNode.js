
define ([
	"jquery",
	"cobweb/Components/PointingDeviceSensor/X3DPointingDeviceSensorNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DPointingDeviceSensorNode, 
          X3DConstants)
{
	function X3DDragSensorNode (browser, executionContext)
	{
		X3DPointingDeviceSensorNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DDragSensorNode);
	}

	X3DDragSensorNode .prototype = $.extend (new X3DPointingDeviceSensorNode (),
	{
		constructor: X3DDragSensorNode,
	});

	return X3DDragSensorNode;
});

