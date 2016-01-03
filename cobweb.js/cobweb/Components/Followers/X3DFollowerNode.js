
define ([
	"jquery",
	"cobweb/Components/Core/X3DChildNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DChildNode, 
          X3DConstants)
{
"use strict";

	function X3DFollowerNode (browser, executionContext)
	{
		X3DChildNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DFollowerNode);
	}

	X3DFollowerNode .prototype = $.extend (Object .create (X3DChildNode .prototype),
	{
		constructor: X3DFollowerNode,
		set_active: function (value)
		{
			if (value !== this .isActive_ .getValue ())
			{
				this .isActive_ = value;
		
				if (this .isActive_ .getValue ())
				{
					this .getBrowser () .prepareEvents () .addInterest (this, "prepareEvents");
					this .getBrowser () .addBrowserEvent ();
				}
				else
					getBrowser () .prepareEvents () .removeInterest (this, "prepareEvents");
			}
		},
	});

	return X3DFollowerNode;
});


