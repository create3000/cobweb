
define ([
	"jquery",
	"cobweb/Browser/Navigation/X3DViewer",
	"cobweb/Components/Navigation/Viewpoint",
	"cobweb/Components/Geospatial/GeoViewpoint",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Rotation4",
	"lib/gettext",
	"jquery-mousewheel",
],
function ($, X3DViewer, Viewpoint, GeoViewpoint, Vector3, Rotation4, _)
{
"use strict";
	
	var SCROLL_FACTOR = 0.05;

	function PlaneViewer (executionContext)
	{
		X3DViewer .call (this, executionContext .getBrowser (), executionContext);

		this .button = -1;
		this .fromPoint = new Vector3 (0, 0, 0);
	}

	PlaneViewer .prototype = $.extend (Object .create (X3DViewer .prototype),
	{
		constructor: PlaneViewer,
		initialize: function ()
		{
			X3DViewer .prototype .initialize .call (this);

			var
			   browser = this .getBrowser (),
			   canvas  = browser .getCanvas ();

			canvas .bind ("mousedown.PlaneViewer",  this .mousedown  .bind (this));
			canvas .bind ("mouseup.PlaneViewer",    this .mouseup    .bind (this));
			canvas .bind ("mousemove.PlaneViewer",  this .mousemove  .bind (this));
			canvas .bind ("mousewheel.PlaneViewer", this .mousewheel .bind (this));
		},
		mousedown: function (event)
		{
			if (this .button >= 0)
				return;
		
			this .pressTime = performance .now ();

			var
				offset = this .getBrowser () .getCanvas () .offset (),
				x      = event .pageX - offset .left,
				y      = event .pageY - offset .top;

			switch (event .button)
			{
				case 1:
				{
					this .button = event .button;
					
					this .getBrowser () .getCanvas () .unbind ("mousemove.PlaneViewer");
					$(document) .bind ("mouseup.PlaneViewer"   + this .getId (), this .mouseup .bind (this));
					$(document) .bind ("mousemove.PlaneViewer" + this .getId (), this .mousemove .bind (this));
		
					event .preventDefault ();
					this .getActiveViewpoint () .transitionStop ();
					this .getBrowser () .setCursor ("MOVE");

					this .fromPoint = this .getPointOnCenterPlane (x, y);
					break;
				}
			}
		},
		mouseup: function (event)
		{
			if (event .button !== this .button)
				return;
			
			this .button = -1;
		
			$(document) .unbind (".PlaneViewer" + this .getId ());
			this .getBrowser () .getCanvas () .bind ("mousemove.PlaneViewer", this .mousemove .bind (this));

			this .getBrowser () .setCursor ("DEFAULT");
		},
		mousemove: function (event)
		{
			var
				offset = this .getBrowser () .getCanvas () .offset (),
				x      = event .pageX - offset .left,
				y      = event .pageY - offset .top;

			switch (this .button)
			{
				case 1:
				{
					// Stop event propagation.

					event .preventDefault ();

					// Move.

					var
						viewpoint   = this .getActiveViewpoint (),
						toPoint     = this .getPointOnCenterPlane (x, y),
						translation = viewpoint .getUserOrientation () .multVecRot (Vector3 .subtract (this .fromPoint, toPoint));

					viewpoint .positionOffset_         = Vector3 .add (viewpoint .positionOffset_         .getValue (), translation);
					viewpoint .centerOfRotationOffset_ = Vector3 .add (viewpoint .centerOfRotationOffset_ .getValue (), translation);

					this .fromPoint = toPoint;
					break;
				}
			}
		},
		mousewheel: function (event)
		{
			// Stop event propagation.
			event .preventDefault ();

			var
				offset = this .getBrowser () .getCanvas () .offset (),
				x      = event .pageX - offset .left,
				y      = event .pageY - offset .top;

			// Determine scroll direction.

			var direction = 0;

			// IE & Opera
			if (event .originalEvent .wheelDelta)
				direction = -event .originalEvent .wheelDelta / 120;

			// Mozilla
			else if (event .originalEvent .detail)
				direction = event .originalEvent .detail / 3;

			// Change viewpoint position.

			var
				viewpoint = this .getActiveViewpoint (),
				fromPoint = this .getPointOnCenterPlane (x, y);

			viewpoint .transitionStop ();

			if (direction < 0)      // Move backwards.
				viewpoint .fieldOfViewScale_ = Math .max (0.00001, viewpoint .fieldOfViewScale_ .getValue () * (1 - SCROLL_FACTOR));

			else if (direction > 0) // Move forwards.
			{
				viewpoint .fieldOfViewScale_ = viewpoint .fieldOfViewScale_ .getValue () * (1 + SCROLL_FACTOR);

				this .constrainFieldOfViewScale ();
			}
					
			var
				toPoint     = this .getPointOnCenterPlane (x, y),
				translation = viewpoint .getUserOrientation () .multVecRot (Vector3 .subtract (fromPoint, toPoint));

			viewpoint .positionOffset_         = Vector3 .add (viewpoint .positionOffset_         .getValue (), translation);
			viewpoint .centerOfRotationOffset_ = Vector3 .add (viewpoint .centerOfRotationOffset_ .getValue (), translation);
		},
		constrainFieldOfViewScale: function ()
		{
			var viewpoint = this .getActiveViewpoint ();

			if (viewpoint instanceof Viewpoint || viewpoint instanceof GeoViewpoint)
			{
				if (viewpoint .fieldOfView_ .getValue () * viewpoint .fieldOfViewScale_ .getValue () >= Math .PI)
					viewpoint .fieldOfViewScale_ = (Math .PI - 0.001) / viewpoint .fieldOfView_ .getValue ();
			}
		},
		dispose: function ()
		{
			this .getBrowser () .getCanvas () .unbind (".PlaneViewer");
			$(document) .unbind (".PlaneViewer" + this .getId ());
		},
	});

	return PlaneViewer;
});
