
define ([
	"jquery",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DConstants)
{
"use strict";

	function X3DPickableObject (executionContext)
	{
		this .addType (X3DConstants .X3DPickableObject);
	}

	X3DPickableObject .prototype =
	{
		constructor: X3DPickableObject,
		initialize: function () { },
	};

	return X3DPickableObject;
});


