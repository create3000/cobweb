
define ([
	"jquery",
	"cobweb/Components/PointingDeviceSensor/X3DPointingDeviceSensorNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DPointingDeviceSensorNode, 
          X3DConstants)
{
"use strict";

	function X3DTouchSensorNode (executionContext)
	{
		X3DPointingDeviceSensorNode .call (this, executionContext);

		this .addType (X3DConstants .X3DTouchSensorNode);
	}

	X3DTouchSensorNode .prototype = $.extend (Object .create (X3DPointingDeviceSensorNode .prototype),
	{
		constructor: X3DTouchSensorNode,
		set_active__: function (hit, value)
		{
			X3DPointingDeviceSensorNode .prototype .set_active__ .call (this, hit, value);

			if (this .enabled_ .getValue () && this .isOver_ .getValue () && ! value)
				this .touchTime_ = this .getBrowser () .getCurrentTime ();
		},
	});

	return X3DTouchSensorNode;
});


