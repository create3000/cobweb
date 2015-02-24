
define ([
	"jquery",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DConstants)
{
	function X3DBoundedObject (browser, executionContext)
	{
		this .addType (X3DConstants .X3DBoundedObject);
	}

	X3DBoundedObject .prototype =
	{
		constructor: X3DBoundedObject,
		initialize: function () { },
	};

	return X3DBoundedObject;
});

