
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
"use strict";
	
	var far = new Vector3 (0, 0, 0);

	function X3DViewer (executionContext)
	{
		X3DBaseNode .call (this, executionContext);
	}

	X3DViewer .prototype = $.extend (Object .create (X3DBaseNode .prototype),
	{
		constructor: X3DViewer,
		initialize: function ()
		{
		},
		getActiveLayer: function ()
		{
			return this .getBrowser () .getActiveLayer ();
		},
		getViewport: function ()
		{
			return this .getBrowser () .getActiveLayer () .getViewport ();
		},
		getNavigationInfo: function ()
		{
			return this .getBrowser () .getActiveLayer () .getNavigationInfo ();
		},
		getActiveViewpoint: function ()
		{
			return this .getBrowser () .getActiveLayer () .getViewpoint ();
		},
		getWindowRelativeOffset: function (parentWindow, element)
		{
			var
				offset      = element .offset (),
				childWindow = window;

			console .log ("");

			while (childWindow !== parentWindow)
			{
			   var
			      frame          = $(childWindow .frameElement),
					relativeOffset = frame .offset (),
					borderLeft     = parseFloat (frame .css ("border-left-width")),
					borderTop      = parseFloat (frame .css ("border-top-width")),
					paddingLeft    = parseFloat (frame .css ("padding-left")),
					paddingTop     = parseFloat (frame .css ("padding-top"));

				offset.left += relativeOffset .left + borderLeft + paddingLeft;
				offset.top  += relativeOffset .top  + borderTop  + paddingTop;
				childWindow  = childWindow.parent;
			}

			return offset;
		},
		getPointOnCenterPlane: function (x, y)
		{
			try
			{
				var
					viewport       = this .getViewport () .getRectangle (),
					navigationInfo = this .getNavigationInfo (),
					viewpoint      = this .getActiveViewpoint (),
					projection     = viewpoint .getProjectionMatrix (navigationInfo .getNearPlane (), navigationInfo .getFarPlane (viewpoint), viewport),
					modelview      = new Matrix4 (); // Use identity

				// Far plane point
				ViewVolume .unProjectPoint (x, this .getBrowser () .getViewport () [3] - y, 0.9, modelview, projection, viewport, far);

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
		dispose: function () { },
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
