
define ([
	"jquery",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DConstants)
{
	function X3DMetadataObject (browser, executionContext)
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

