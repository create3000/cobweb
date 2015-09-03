
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
		SPEED_FACTOR           = 0.007,
		SHIFT_SPEED_FACTOR     = 4 * SPEED_FACTOR,
		ROTATION_SPEED_FACTOR  = 1.4,
		ROTATION_LIMIT         = 40,
		PAN_SPEED_FACTOR       = SPEED_FACTOR,
		PAN_SHIFT_SPEED_FACTOR = 1.4 * PAN_SPEED_FACTOR,
		ROLL_ANGLE             = Math .PI / 32,
		ROLL_TIME              = 0.2,
		FRAME_RATE             = 60;

	var
		yAxis = new Vector3 (0, 1, 0),
		zAxis = new Vector3 (0, 0, 1);

	function X3DFlyViewer (executionContext)
	{
		console .log ("X3DFlyViewer");

		X3DViewer .call (this, executionContext .getBrowser (), executionContext);

		this .fromVector          = new Vector3 (0, 0, 0);
		this .toVector            = new Vector3 (0, 0, 0);
		this .direction           = new Vector3 (0, 0, 0);
		this .sourceRotation      = new Rotation4 (0, 0, 1, 0);
		this .destinationRotation = new Rotation4 (0, 0, 1, 0);
		this .startTime           = 0;
		this .button              = -1;
	}

	X3DFlyViewer .prototype = $.extend (Object .create (X3DViewer .prototype),
	{
		constructor: X3DFlyViewer,
		initialize: function ()
		{
			X3DViewer .prototype .initialize .call (this);

			this .getBrowser () .getCanvas () .bind ("mousedown.X3DFlyViewer",  this .mousedown .bind (this));
			this .getBrowser () .getCanvas () .bind ("mouseup.X3DFlyViewer",    this .mouseup .bind (this));
			this .getBrowser () .getCanvas () .bind ("mousemove.X3DFlyViewer",  this .mousemove .bind (this));
			this .getBrowser () .getCanvas () .bind ("mousewheel.X3DFlyViewer", this .mousewheel .bind (this));
		},
		mousedown: function (event)
		{
			this .button = event .button;

			this .getBrowser () .addBrowserEvent ();

			var
				offset = this .getBrowser () .getCanvas () .offset (),
				x      = event .pageX - offset .left,
				y      = event .pageY - offset .top;
			
			switch (this .button)
			{
				case 0:
				{
					event .preventDefault ();
					this .disconnect ();
					this .getActiveViewpoint () .transitionStop ();
					this .getBrowser () .setCursor ("MOVE");
		
					if (this .getBrowser () .hasCtrlKey ())
					{
						// Look around.

						this .fromVector = this .trackballProjectToSphere (x, y);
					}
					else
					{
						// Move.

						this .fromVector .set (x, 0, y);
						this .toVector   .assign (this .fromVector);
						this .direction  .set (0, 0, 0);

						if (this .getBrowser () .getBrowserOption ("Rubberband"))
							this .getBrowser () .finished () .addInterest (this, "display");
					}

					break;
				}
				case 1:
				{
					event .preventDefault ();
					this .disconnect ();
					this .getActiveViewpoint () .transitionStop ();
					this .getBrowser () .setCursor ("MOVE");

					this .fromVector .set (x, -y, 0);
					this .toVector   .assign (this .fromVector);
					break;
				}
			}
		},
		mouseup: function (event)
		{
			this .disconnect ();
			this .getBrowser () .setCursor ("DEFAULT");

			this .button = -1;
		},
		mousemove: function (event)
		{
			this .getBrowser () .addBrowserEvent ();

			var
				offset = this .getBrowser () .getCanvas () .offset (),
				x      = event .pageX - offset .left,
				y      = event .pageY - offset .top;
			
			switch (this .button)
			{
				case 0:
				{
					if (this .getBrowser () .hasCtrlKey ())
					{
						// Look around

						var
							viewpoint   = this .getActiveViewpoint (),
							orientation = viewpoint .getUserOrientation (),
							toVector    = this .trackballProjectToSphere (x, y);

						orientation = new Rotation4 (toVector, this .fromVector) .multRight (orientation);
						orientation .multRight (viewpoint .straightenHorizon (orientation));

						viewpoint .orientationOffset_ = Rotation4 .inverse (viewpoint .orientation_ .getValue ()) .multRight (orientation);

						this .fromVector .assign (toVector);
					}
					else
					{
						// Fly

						this .toVector  .set (x, 0, y);
						this .direction .assign (this .toVector) .subtract (this .fromVector);

						this .addFly ();
					}
				
					break;
				}
				case 1:
				{
					// Pan
					event .preventDefault ();

					this .toVector  .set (x, -y, 0);
					this .direction .assign (this .toVector) .subtract (this .fromVector);

					this .addPan ();
					break;
				}
			}
		},
		mousewheel: function (event)
		{
			console .log ("mousewheel");
		},
		fly: function ()
		{
			var
				now = performance .now (),
				dt  = (now - this .startTime) / 1000;

			var
				navigationInfo = this .getNavigationInfo (),
				viewpoint      = this .getActiveViewpoint (),
				upVector       = viewpoint .getUpVector ();

			// Rubberband values

			var up = new Rotation4 (yAxis, upVector);

			var rubberBandRotation = this .direction .z > 0
			                         ? new Rotation4 (up .multVecRot (this .direction .copy ()), up .multVecRot (zAxis .copy ()))
			                         : new Rotation4 (up .multVecRot (Vector3 .negate (zAxis)), up .multVecRot (this .direction .copy ()));

			var rubberBandLength = this .direction .abs ();

			// Position offset

			var speedFactor = 1 - rubberBandRotation .angle / (Math .PI / 2);

			speedFactor *= navigationInfo .speed_ .getValue ();
			speedFactor *= viewpoint .getSpeedFactor ();
			speedFactor *= this .getBrowser () .hasShiftKey () ? SHIFT_SPEED_FACTOR : SPEED_FACTOR;
			speedFactor *= dt;

			var translation = this .getTranslationOffset (Vector3 .multiply (this .direction, speedFactor));

			viewpoint .positionOffset_ = this .getTranslation (translation) .add (viewpoint .positionOffset_ .getValue ());

			// Rotation

			var weight = ROTATION_SPEED_FACTOR * dt;
			weight *= Math .pow (rubberBandLength / (rubberBandLength + ROTATION_LIMIT), 2);

			viewpoint .orientationOffset_ = new Rotation4 () .slerp (rubberBandRotation, weight) .multLeft (viewpoint .orientationOffset_ .getValue ());

			// GeoRotation

			var geoRotation = new Rotation4 (upVector, viewpoint .getUpVector ());

			viewpoint .orientationOffset_ = geoRotation .multLeft (viewpoint .orientationOffset_ .getValue ());

			this .startTime = now;
		},
		pan: function ()
		{

		},
		roll: function ()
		{

		},
		getTranslation: function (translation)
		{
			return translation;

			/*
			// Apply collision to translation.

			var
				navigationInfo  = this .getNavigationInfo (),
				collisionRadius = navigationInfo .getCollisionRadius ();

			// Get width and height of camera

			var
				width  = collisionRadius * 2,
				height = collisionRadius + navigationInfo .getAvatarHeight () - navigationInfo .getStepHeight ();

			// Get position offset

			var positionOffset = height / 2 - collisionRadius;

			return this .getBrowser () .getActiveLayer () .getTranslation (new Vector3 (0, -positionOffset, 0), width, height, translation);
			*/
		},
		addFly: function ()
		{
			if (this .startTime)
				return;

			this .getBrowser () .prepareEvents () .addInterest (this, "fly");
			this .getBrowser () .addBrowserEvent ();

			this .startTime = performance .now ();
		},
		addPan: function ()
		{
			if (this .startTime)
				return;
			
			this .getBrowser () .prepareEvents () .addInterest (this, "pan");
			this .getBrowser () .addBrowserEvent ();
			
			this .startTime = performance .now ();
		},
		addRoll: function ()
		{
			if (this .startTime)
				return;
			
			this .getBrowser () .prepareEvents () .addInterest (this, "roll");
			this .getBrowser () .addBrowserEvent ();
			
			this .startTime = performance .now ();
		},
		display: function ()
		{/*
			try
			{
				// Configure HUD

				const auto & viewport = getBrowser () -> getRectangle ();
				const int    width    = viewport [2];
				const int    height   = viewport [3];

				const Matrix4d projection = ortho <float> (0, width, 0, height, -1, 1);

				glDisable (GL_DEPTH_TEST);

				glMatrixMode (GL_PROJECTION);
				glLoadMatrixd (projection .data ());
				glMatrixMode (GL_MODELVIEW);

				// Display Rubberband.

				glLoadIdentity ();

				const Vector3d fromPoint (fromVector .x (), height - fromVector .z (), 0);
				const Vector3d toPoint   (toVector   .x (), height - toVector   .z (), 0);

				// Draw a black and a white line.
				glLineWidth (2);
				glColor3f (0, 0, 0);

				glBegin (GL_LINES);
				glVertex3dv (fromPoint .data ());
				glVertex3dv (toPoint   .data ());
				glEnd ();

				glLineWidth (1);
				glColor3f (1, 1, 1);

				glBegin (GL_LINES);
				glVertex3dv (fromPoint .data ());
				glVertex3dv (toPoint   .data ());
				glEnd ();

				glEnable (GL_DEPTH_TEST);
			}
			catch (const std::domain_error &)
			{
				// unProjectPoint is not posible
			}
		*/},
		disconnect: function ()
		{
			this .getBrowser () .prepareEvents () .removeInterest (this, "fly");
			this .getBrowser () .prepareEvents () .removeInterest (this, "pan");
			this .getBrowser () .prepareEvents () .removeInterest (this, "roll");

			this .startTime = 0;
		},
		dispose: function ()
		{
			this .disconnect ();
			this .getBrowser () .getCanvas () .unbind (".X3DFlyViewer");
		},
	});

	return X3DFlyViewer;
});
