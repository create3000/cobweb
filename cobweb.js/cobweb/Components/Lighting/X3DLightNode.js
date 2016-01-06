
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
"use strict";

	function X3DLightNode (executionContext)
	{
		X3DChildNode .call (this, executionContext);

		this .addType (X3DConstants .X3DLightNode);
	}

	X3DLightNode .prototype = $.extend (Object .create (X3DChildNode .prototype),
	{
		constructor: X3DLightNode,
		push: function ()
		{
			if (this .on_ .getValue ())
			{
				if (this .global_ .getValue ())
					this .getBrowser () .getGlobalLights () .push (this .getLights () .pop (this));

				else
					this .getCurrentLayer () .getLocalLights () .push (this .getLights () .pop (this));
			}
		},
		pop: function ()
		{
			if (this .on_ .getValue ())
			{
				if (this .global_ .getValue ())
				   return;

				this .getBrowser () .getLocalLights () .push (this .getCurrentLayer () .getLocalLights () .pop ());
			}
		},
	});

	return X3DLightNode;
});


