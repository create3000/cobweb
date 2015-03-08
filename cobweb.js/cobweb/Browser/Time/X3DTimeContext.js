
define ([
	"standard/Math/Numbers/Vector3",
],
function (Vector3)
{
	function X3DTimeContext ()
	{
		this .currentPosition = new Vector3 ();
	}

	X3DTimeContext .prototype =
	{
		initialize: function ()
		{
			this .advance ();
		},
		getCurrentTime: function ()
		{
			return this .currentTime;
		},
		advance: function ()
		{
			var lastTime = this .currentTime;

			this .currentTime      = Date .now () / 1000;
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
