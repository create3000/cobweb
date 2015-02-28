
define ([
	"jquery",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DConstants)
{
	function X3DUrlObject (browser, executionContext)
	{
		this .loadState = X3DConstants .NOT_STARTED_STATE;

		this .addType (X3DConstants .X3DUrlObject);
	}

	X3DUrlObject .prototype =
	{
		constructor: X3DUrlObject,
		initialize: function () { },
		setLoadState: function (value)
		{
			this .loadState = value;
		},
		checkLoadState: function ()
		{
			return this .loadState;
		},
	};

	return X3DUrlObject;
});

