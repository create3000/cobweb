
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DConstants)
{
	with (Fields)
	{
		function X3DUrlObject (browser, executionContext)
		{
			this .addType (X3DConstants .X3DUrlObject);
		}

		X3DUrlObject .prototype =
		{
			constructor: X3DUrlObject,
			initialize: function ()
			{
				this .addChildren ("loadState", new SFInt32 (X3DConstants .NOT_STARTED_STATE));
			},
			setLoadState: function (value)
			{
				this .loadState_ = value;
			},
			checkLoadState: function ()
			{
				return this .loadState_ .getValue ();
			},
		};

		return X3DUrlObject;
	}
});

