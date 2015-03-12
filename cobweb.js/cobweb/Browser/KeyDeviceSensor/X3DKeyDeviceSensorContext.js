
define ([
	"jquery",
],
function ($)
{
	function X3DKeyDeviceSensorContext ()
	{
	}

	X3DKeyDeviceSensorContext .prototype =
	{
		initialize: function ()
		{
			this .getCanvas () .keydown (this .keydown .bind (this));
		},
		keydown: function (event)
		{
			event .preventDefault ();

			//console .log (event .which);

			switch (event .which)
			{
				case 36: // Pos 1
				{
					this .firstViewpoint ();
					break;
				}
				case 35: // End
				{
					this .lastViewpoint ();
					break;
				}
				case 33: // Page Up
				{
					this .previousViewpoint ();
					break;
				}
				case 34: // Page Down
				{
					this .nextViewpoint ();
					break;
				}
			}
		},
	};

	return X3DKeyDeviceSensorContext;
});
