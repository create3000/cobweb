
define ([
	"jquery",
	"cobweb/Components/Core/X3DChildNode",
	"cobweb/Bits/TraverseType",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DChildNode,
          TraverseType,
          X3DConstants)
{
	function X3DLightNode (browser, executionContext)
	{
		X3DChildNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DLightNode);
	}

	X3DLightNode .prototype = $.extend (Object .create (X3DChildNode .prototype),
	{
		constructor: X3DLightNode,
		traverse: function (type)
		{
			if (type !== TraverseType .DISPLAY)
				return;

			if (this .on_ .getValue ())
			{
				if (this .global_ .getValue ())
					this .getBrowser () .getGlobalLights () .push (this .getContainer ());

				//else
				//	this .getCurrentLayer () .getLocalObjects () .push (new DirectionalLightContainer (this));
			}
		},
	});

	return X3DLightNode;
});

