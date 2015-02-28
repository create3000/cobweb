
define ([
	"jquery",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DConstants)
{
	function X3DFogObject (browser, executionContext)
	{
		this .addType (X3DConstants .X3DFogObject);
	}

	X3DFogObject .prototype =
	{
		constructor: X3DFogObject,
		initialize: function () { },
	};

	return X3DFogObject;
});

