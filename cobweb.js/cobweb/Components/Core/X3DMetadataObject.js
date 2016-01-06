
define ([
	"jquery",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DConstants)
{
"use strict";

	function X3DMetadataObject (executionContext)
	{
		this .addType (X3DConstants .X3DMetadataObject);
	}

	X3DMetadataObject .prototype =
	{
		constructor: X3DMetadataObject,
		initialize: function () { },
	};

	return X3DMetadataObject;
});


