
define ([
	"jquery",
	"cobweb/Components/Core/X3DNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DNode, 
          X3DConstants)
{
	function X3DRigidJointNode (browser, executionContext)
	{
		X3DNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DRigidJointNode);
	}

	X3DRigidJointNode .prototype = $.extend (Object .create (X3DNode .prototype),
	{
		constructor: X3DRigidJointNode,
	});

	return X3DRigidJointNode;
});

