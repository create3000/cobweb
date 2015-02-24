
define ([
	"jquery",
	"cobweb/Components/Core/X3DSensorNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DSensorNode, 
          X3DConstants)
{
	function X3DEnvironmentalSensorNode (browser, executionContext)
	{
		X3DSensorNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DEnvironmentalSensorNode);
	}

	X3DEnvironmentalSensorNode .prototype = $.extend (new X3DSensorNode (),
	{
		constructor: X3DEnvironmentalSensorNode,
	});

	return X3DEnvironmentalSensorNode;
});

