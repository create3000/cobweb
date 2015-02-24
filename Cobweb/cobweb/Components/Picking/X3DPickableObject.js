
define ([
	"jquery",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DConstants)
{
	function X3DPickableObject (browser, executionContext)
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

