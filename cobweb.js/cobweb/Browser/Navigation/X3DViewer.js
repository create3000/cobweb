
define ([
	"jquery",
	"cobweb/Basic/X3DBaseNode",
	"cobweb/Components/Navigation/OrthoViewpoint",
	"standard/Math/Geometry/ViewVolume",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Matrix4",
],
function ($, X3DBaseNode, OrthoViewpoint, ViewVolume, Vector3, Matrix4)
{
	function X3DViewer (browser, executionContext)
	{
		X3DBaseNode .call (this, browser, executionContext);
	}

	X3DViewer .prototype = $.extend (Object .create (X3DBaseNode .prototype),
	{
		constructor: X3DViewer,
		initialize: function ()
		{
		},
		getViewport: function ()
		{
			return this .getBrowser () .getWorld () .getActiveLayer () .getValue () .getViewport ();
		},
		getNavigationInfo: function ()
		{
			return this .getBrowser () .getWorld () .getActiveLayer () .getValue () .getNavigationInfo ();
		},
		getActiveViewpoint: function ()
		{
			return this .getBrowser () .getWorld () .getActiveLayer () .getValue () .getViewpoint ();
		},
		getPointOnCenterPlane: function (x, y)
		{
			try
			{
				var viewport       = this .getViewport () .getRectangle ();
				var navigationInfo = this .getNavigationInfo ();
				var viewpoint      = this .getActiveViewpoint ();
				var projection     = viewpoint .getProjectionMatrix (navigationInfo .getNearPlane (), navigationInfo .getFarPlane (viewpoint), viewport);
				var modelview      = new Matrix4 (); // Use identity

				// Far plane point
				var far = ViewVolume .unProjectPoint (x, this .getBrowser () .getViewport () [3] - y, 0.9, modelview, projection, viewport);

				if (viewpoint instanceof OrthoViewpoint)
					return new Vector3 (far .x, far .y, -this .getDistanceToCenter () .abs ());

				var direction = far .normalize ();

				return Vector3 .multiply (direction, this .getDistanceToCenter () .abs () / direction .dot (new Vector3 (0, 0, -1)));
			}
			catch (error)
			{
				console .log (error);
				return new Vector3 (0, 0, 0);
			}
		},
		getDistanceToCenter: function ()
		{
			var viewpoint = this .getActiveViewpoint ();

			return Vector3 .subtract (viewpoint .getUserPosition (), viewpoint .getUserCenterOfRotation ());
		},
		trackballProjectToSphere: function (x, y)
		{
			x =  x / this .getBrowser () .getViewport () [2] - 0.5;
			y = -y / this .getBrowser () .getViewport () [3] + 0.5;

			return new Vector3 (x, y, tbProjectToSphere (0.5, x, y));
		},
	});

	function tbProjectToSphere (r, x, y)
	{
		var d = Math .sqrt (x * x + y * y);

		if (d < r * Math .sqrt (0.5)) // Inside sphere
		{
			return Math .sqrt (r * r - d * d);
		}

		// On hyperbola

		var t = r / Math .sqrt (2);
		return t * t / d;
	}

	return X3DViewer;
});
