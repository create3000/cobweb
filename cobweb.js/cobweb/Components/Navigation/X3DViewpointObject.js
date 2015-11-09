
define ([
	"jquery",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DConstants)
{
"use strict";

	function X3DViewpointObject (browser, executionContext)
	{
		this .addType (X3DConstants .X3DViewpointObject);
	}

	X3DViewpointObject .prototype =
	{
		constructor: X3DViewpointObject,
		initialize: function () { },
	};

	return X3DViewpointObject;
});


