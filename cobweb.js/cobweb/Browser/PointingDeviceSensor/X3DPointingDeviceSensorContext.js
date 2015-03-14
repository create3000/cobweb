
define ([
],
function ()
{
	function X3DPointingDeviceSensorContext ()
	{
	}

	X3DPointingDeviceSensorContext .prototype =
	{
		initialize: function ()
		{
			this .getCanvas () .attr ("tabindex", 8803068);
			this .getCanvas () .bind ("mousedown.X3DPointingDeviceSensorContext", this .mousedown .bind (this));

			this .setCursor ("DEFAULT");
		},
		setCursor: function (type)
		{
			switch (type)
			{
				case "HAND":
					this .getCanvas () .css ("cursor", "pointer");
					break;
				case "MOVE":
					this .getCanvas () .css ("cursor", "move");
					break;
				case "CROSSHAIR":
					this .getCanvas () .css ("cursor", "crosshair");
					break;
				default:
					this .getCanvas () .css ("cursor", "default");
					break;
			}
		},
		mousedown: function (event)
		{
			event .preventDefault ();
			//event .stopImmediatePropagation (); // Keeps the rest of the handlers from being executed

			this .getCanvas () .focus ();	
		},
	};

	return X3DPointingDeviceSensorContext;
});
