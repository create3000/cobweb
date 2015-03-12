
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

			this .getCanvas () .mousedown (this .mousedown .bind (this));
		},
		mousedown: function (event)
		{
			event .preventDefault ();	

			this .getCanvas () .focus ();	
		},
	};

	return X3DPointingDeviceSensorContext;
});
