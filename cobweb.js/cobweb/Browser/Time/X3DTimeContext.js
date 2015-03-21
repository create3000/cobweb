
define ([
	"standard/Math/Numbers/Vector3",
],
function (Vector3)
{
	function X3DTimeContext ()
	{
		this .currentPosition = new Vector3 (0, 0, 0);
	}

	X3DTimeContext .prototype =
	{
		initialize: function ()
		{
			this .advanceTime (performance .now ());
		},
		getCurrentTime: function ()
		{
			return this .currentTime;
		},
		advanceTime: function (time)
		{
			time += performance .timing .navigationStart;

			var lastTime = this .currentTime;

			this .currentTime      = time / 1000;
			this .currentFrameRate = 1 / (this .currentTime - lastTime);

			if (this .getWorld () && this .getWorld () .getActiveLayer ())
			{
				var lastPosition = this .currentPosition;

				this .currentPosition = this .getWorld () .getActiveLayer () .getValue () .getViewpoint () .getCameraSpaceMatrix () .origin;
				this .currentSpeed    = Vector3 .subtract (this .currentPosition, lastPosition) .abs () * this .currentFrameRate;
			}
			else
				this .currentSpeed = 0;
		},
	};

	return X3DTimeContext;
});
