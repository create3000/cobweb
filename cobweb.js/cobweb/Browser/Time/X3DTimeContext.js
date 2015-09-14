
define ([
	"standard/Math/Numbers/Vector3",
],
function (Vector3)
{
	var lastPosition = new Vector3 (0, 0, 0);

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

			if (this .getWorld () && this .getActiveLayer ())
			{
				var cameraSpaceMatrix = this .getActiveLayer () .getViewpoint () .getCameraSpaceMatrix ();

				lastPosition .assign (this .currentPosition);
				this .currentPosition .set (cameraSpaceMatrix [12], cameraSpaceMatrix [13], cameraSpaceMatrix [14]);

				this .currentSpeed = lastPosition .subtract (this .currentPosition) .abs () * this .currentFrameRate;
			}
			else
				this .currentSpeed = 0;
		},
	};

	return X3DTimeContext;
});
