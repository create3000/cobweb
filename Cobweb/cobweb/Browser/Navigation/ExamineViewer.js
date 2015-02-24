
define ([
	"jquery",
	"cobweb/Browser/Navigation/X3DViewer",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Rotation4",
	"jquery-mousewheel",
],
function ($, X3DViewer, Vector3, Rotation4)
{
	var
		MOTION_TIME       = 0.05 * 1000,
		SPIN_RELEASE_TIME = 0.01 * 1000,
		SPIN_ANGLE        = 0.006,
		SPIN_FACTOR       = 0.6,
		SCROLL_FACTOR     = 1.0 / 50.0,
		FRAME_RATE        = 60;

	function ExamineViewer (executionContext)
	{
		X3DViewer .call (this, executionContext .getBrowser (), executionContext);

		this .button            = -1;
		this .orientationOffset = new Rotation4 ();
		this .rotation          = new Rotation4 ();
		this .fromVector        = new Vector3 ();
		this .fromPoint         = new Vector3 ()
		this .pressTime         = 0;
		this .motionTime        = 0;
		this .spinId            = undefined;
	}

	ExamineViewer .prototype = $.extend (new X3DViewer (),
	{
		constructor: ExamineViewer,
		initialize: function ()
		{
			X3DViewer .prototype .initialize .call (this);

			this .getBrowser () .getCanvas () .mousedown (this .mousedown .bind (this));
			this .getBrowser () .getCanvas () .mouseup (this .mouseup .bind (this));
			this .getBrowser () .getCanvas () .mousemove (this .mousemove .bind (this));
			this .getBrowser () .getCanvas () .mousewheel (this .mousewheel .bind (this));
		},
		mousedown: function (event)
		{
			if (this .button >= 0)
				return;

			this .button    = event .button;
			this .pressTime = Date .now ();
		
			var offset = this .getBrowser () .getCanvas () .offset (); 
			var x      = event .pageX - offset .left;
			var y      = event .pageY - offset .top;

			switch (this .button)
			{
				case 0:
				{
					this .disconnect ();
					//this .getActiveViewpoint () .transitionStop ();
					//this .getBrowser () .setCursor (Gdk::FLEUR);

					this .fromVector = this .trackballProjectToSphere (x, y);
					this .rotation   = new Rotation4 ();

					this .motionTime = 0;			
					break;
				}
				case 1:
				{
					this .disconnect ();
					//this .getActiveViewpoint () .transitionStop ();
					//this .getBrowser () .setCursor (Gdk::FLEUR);

					this .fromPoint = this .getPointOnCenterPlane (x, y);
					break;
				}
			}
		},
		mouseup: function (event)
		{
			if (event .button !== this .button)
				return;

			switch (this .button)
			{
				case 0:
				{
					//this .getBrowser () .setCursor (Gdk::ARROW);

					if (Math .abs (this .rotation .angle) > SPIN_ANGLE && Date .now () - this .motionTime < SPIN_RELEASE_TIME)
					{
						this .rotation = new Rotation4 () .slerp (this .rotation, SPIN_FACTOR);
						this .addSpinning ();
					}

					break;
				}
				case 1:
				{
					//this .getBrowser () .setCursor (Gdk::ARROW);
					break;
				}
			}

			this .button = -1;
		},
		mousemove: function (event)
		{
			if (this .button < 0)
				return;

			var offset = this .getBrowser () .getCanvas () .offset (); 
			var x      = event .pageX - offset .left;
			var y      = event .pageY - offset .top;

			switch (this .button)
			{
				case 0:
				{
					var viewpoint = this .getActiveViewpoint ();
					var toVector  = this .trackballProjectToSphere (x, y);

					this .rotation = new Rotation4 (toVector, this .fromVector);

					if (Math .abs (this .rotation .angle) < SPIN_ANGLE && Date .now () - this .pressTime < MOTION_TIME)
						return false;

					viewpoint .orientationOffset_ = this .getOrientationOffset ();
					viewpoint .positionOffset_    = this .getPositionOffset ();

					this .fromVector = toVector;
					this .motionTime = Date .now ();
					break;
				}
				case 1:
				{
		         // Stop event propagation.

					event .stopPropagation ();

					if (event .originalEvent .preventDefault)
						event .originalEvent .preventDefault ();

		         event .originalEvent .returnValue = false;

		         // Move.

					var viewpoint   = this .getActiveViewpoint ();
					var toPoint     = this .getPointOnCenterPlane (x, y);
					var translation = viewpoint .getUserOrientation () .multVecRot (this .fromPoint .subtract (toPoint));

					viewpoint .positionOffset_         = viewpoint .positionOffset_         .getValue () .add (translation);
					viewpoint .centerOfRotationOffset_ = viewpoint .centerOfRotationOffset_ .getValue () .add (translation);

					this .fromPoint = toPoint;
					break;
				}
			}
		},
		mousewheel: function (event)
		{
         // Stop event propagation.

			event .stopPropagation ();

			if (event .originalEvent .preventDefault)
				event .originalEvent .preventDefault ();

         event .originalEvent .returnValue = false;

         // Determine scroll direction.

			var direction = 0;

			// IE & Opera
			if (event .originalEvent .wheelDelta)
				direction = -event .originalEvent .wheelDelta / 120;

			// Mozilla
			else if (event .originalEvent .detail)
				direction = event .originalEvent .detail / 3;

			// Change viewpoint position.

			var viewpoint = this .getActiveViewpoint ();

			//viewpoint .transitionStop ();

			var step           = this .getDistanceToCenter () .multiply (SCROLL_FACTOR);
			var positionOffset = viewpoint .getUserOrientation () .multVecRot (new Vector3 (0, 0, step .abs ()));

			if (direction > 0)
				viewpoint .positionOffset_ = viewpoint .positionOffset_ .getValue () .add (positionOffset);

			else if (direction < 0)
				viewpoint .positionOffset_ = viewpoint .positionOffset_ .getValue () .subtract (positionOffset);		
		},
		getPositionOffset: function ()
		{
			var viewpoint = this .getActiveViewpoint ();
			var distance  = this .getDistanceToCenter ();

			return (this .orientationOffset .inverse ()
			       .multRight (viewpoint .orientationOffset_ .getValue ())
			       .multVecRot (distance)
			       .subtract (distance)
			       .add (viewpoint .positionOffset_ .getValue ()));
		},
		getOrientationOffset: function ()
		{
			var viewpoint = this .getActiveViewpoint ();

			this .orientationOffset .assign (viewpoint .orientationOffset_ .getValue ());

			return viewpoint .orientation_ .getValue () .inverse () .multRight (this .rotation) .multRight (viewpoint .getUserOrientation ());
		},
		spin: function ()
		{
			var viewpoint = this .getActiveViewpoint ();

			viewpoint .orientationOffset_ = this .getOrientationOffset ();
			viewpoint .positionOffset_    = this .getPositionOffset ();
		},
		addSpinning: function ()
		{
			if (! this .spinId)
				this .spinId = setInterval (this .spin .bind (this), 1000.0 / FRAME_RATE);
		},
		disconnect: function ()
		{
			clearInterval (this .spinId);

			this .spinId = undefined;
		},
	});

	return ExamineViewer;
});
