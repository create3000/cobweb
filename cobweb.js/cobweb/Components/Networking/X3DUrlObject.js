
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
			
			this .addChildren ("loadState", new SFInt32 (X3DConstants .NOT_STARTED_STATE));
		}

		X3DUrlObject .prototype =
		{
			constructor: X3DUrlObject,
			initialize: function ()
			{
			},
			setLoadState: function (value, notify)
			{
				switch (value)
				{
					case X3DConstants .NOT_STARTED_STATE:
					{
						if (notify !== false)
						{
							if (this .loadState_ .getValue () === X3DConstants .IN_PROGRESS_STATE)
						      this .getBrowser () .removeLoadCount (this);
						}

						break;
					}
					case X3DConstants .IN_PROGRESS_STATE:
					{
						if (notify !== false)
							this .getBrowser () .addLoadCount (this);
						break;
					}
					case X3DConstants .COMPLETE_STATE:
					case X3DConstants .FAILED_STATE:
					{
						if (notify !== false)
							this .getBrowser () .removeLoadCount (this);
						break;
					}
				}

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

