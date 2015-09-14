
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Components/Core/X3DBindableNode",
	"cobweb/Components/Navigation/X3DViewpointObject",
	"cobweb/Components/Time/TimeSensor",
	"cobweb/Components/Interpolation/EaseInEaseOut",
	"cobweb/Components/Interpolation/PositionInterpolator",
	"cobweb/Components/Interpolation/OrientationInterpolator",
	"cobweb/Bits/TraverseType",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector2",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Rotation4",
	"standard/Math/Numbers/Matrix4",
],
function ($,
          Fields,
          X3DBindableNode, 
          X3DViewpointObject,
          TimeSensor,
          EaseInEaseOut,
          PositionInterpolator,
          OrientationInterpolator,
          TraverseType,
          X3DConstants,
          Vector2,
          Vector3,
          Rotation4,
          Matrix4)
{
	with (Fields)
	{
		var
			upVector = new Vector3 (0, 1, 0),
			yAxis    = new Vector3 (0, 1, 0),
			zAxis    = new Vector3 (0, 0, 1);

		function X3DViewpointNode (browser, executionContext)
		{
			X3DBindableNode    .call (this, browser, executionContext);
			X3DViewpointObject .call (this, browser, executionContext);

			this .addType (X3DConstants .X3DViewpointNode);

			this .transformationMatrix     = new Matrix4 ();
			this .cameraSpaceMatrix        = new Matrix4 (1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 10, 1);
			this .inverseCameraSpaceMatrix = new Matrix4 (1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -10, 1);
		}

		X3DViewpointNode .prototype = $.extend (Object .create (X3DBindableNode .prototype),
			X3DViewpointObject .prototype,
		{
			constructor: X3DViewpointNode,
			initialize: function ()
			{
				X3DBindableNode    .prototype .initialize .call (this);
				X3DViewpointObject .prototype .initialize .call (this);

				this .addChildren ("positionOffset",         new SFVec3f (),
				                   "orientationOffset",      new SFRotation (),
				                   "scaleOffset",            new SFVec3f (1, 1, 1),
				                   "scaleOrientationOffset", new SFRotation (),
				                   "centerOfRotationOffset", new SFVec3f (),
				                   "fieldOfViewScale",       new SFFloat (1));

				this .timeSensor                   = new TimeSensor              (this .getBrowser () .getPrivateScene ());
				this .easeInEaseOut                = new EaseInEaseOut           (this .getBrowser () .getPrivateScene ());
				this .positionInterpolator         = new PositionInterpolator    (this .getBrowser () .getPrivateScene ());
				this .orientationInterpolator      = new OrientationInterpolator (this .getBrowser () .getPrivateScene ());
				this .scaleInterpolator            = new PositionInterpolator    (this .getBrowser () .getPrivateScene ());
				this .scaleOrientationInterpolator = new OrientationInterpolator (this .getBrowser () .getPrivateScene ());
			
				this .timeSensor .stopTime_ = 1;
				this .timeSensor .setup ();

				this .easeInEaseOut .key_           = [ 0, 1 ];
				this .easeInEaseOut .easeInEaseOut_ = [ new Vector2 (0, 0), new Vector2 (0, 0) ];
				this .easeInEaseOut .setup ();

				this .positionInterpolator         .key_ = [ 0, 1 ];
				this .orientationInterpolator      .key_ = [ 0, 1 ];
				this .scaleInterpolator            .key_ = [ 0, 1 ];
				this .scaleOrientationInterpolator .key_ = [ 0, 1 ];

				this .positionInterpolator         .setup ();
				this .orientationInterpolator      .setup ();
				this .scaleInterpolator            .setup ();
				this .scaleOrientationInterpolator .setup ();

				this .timeSensor .fraction_changed_ .addFieldInterest (this .easeInEaseOut .set_fraction_);

				this .easeInEaseOut .modifiedFraction_changed_ .addFieldInterest (this .positionInterpolator         .set_fraction_);
				this .easeInEaseOut .modifiedFraction_changed_ .addFieldInterest (this .orientationInterpolator      .set_fraction_);
				this .easeInEaseOut .modifiedFraction_changed_ .addFieldInterest (this .scaleInterpolator            .set_fraction_);
				this .easeInEaseOut .modifiedFraction_changed_ .addFieldInterest (this .scaleOrientationInterpolator .set_fraction_);

				this .positionInterpolator         .value_changed_ .addFieldInterest (this .positionOffset_);
				this .orientationInterpolator      .value_changed_ .addFieldInterest (this .orientationOffset_);
				this .scaleInterpolator            .value_changed_ .addFieldInterest (this .scaleOffset_);
				this .scaleOrientationInterpolator .value_changed_ .addFieldInterest (this .scaleOrientationOffset_);

				this .isBound_ .addInterest (this, "set_bind__");
			},
			bindToLayer: function (layer)
			{
				X3DBindableNode .prototype .bindToLayer .call (this, layer);
			
				layer .getViewpointStack () .push (this);
			},
			unbindFromLayer: function (layer)
			{
				X3DBindableNode .prototype .unbindFromLayer .call (this, layer);

				layer .getViewpointStack () .pop (this);
			},
			removeFromLayer: function (layer)
			{
				layer .getViewpointStack () .remove (this);
			},
			getPosition: function ()
			{
				return this .position_ .getValue () .copy ();
			},
			getUserPosition: function ()
			{
				return Vector3 .add (this .position_ .getValue (), this .positionOffset_ .getValue ());
			},
			getOrientation: function ()
			{
				return this .orientation_ .getValue () .copy ();
			},
			getUserOrientation: function ()
			{
				return Rotation4 .multRight (this .orientation_ .getValue (), this .orientationOffset_ .getValue ());
			},
			getUserCenterOfRotation: function ()
			{
				return Vector3 .add (this .centerOfRotation_ .getValue (), this .centerOfRotationOffset_ .getValue ());
			},
			getTransformationMatrix: function ()
			{
				return this .transformationMatrix;
			},
			getCameraSpaceMatrix: function ()
			{
				return this .cameraSpaceMatrix;
			},
			getInverseCameraSpaceMatrix: function ()
			{
				return this .inverseCameraSpaceMatrix;
			},
			getUpVector: function ()
			{
				return upVector;
			},
			getSpeedFactor: function ()
			{
				return 1;
			},
			getMaxZFar: function ()
			{
				return 1e5;
			},
			transitionStart: function (layer, fromViewpoint)
			{
				try
				{
					if (! layer)
					{
						for (var id in this .getLayers ())
						{
							layer = this .getLayers () [id];
							break;
						}
					}

					if (this .jump_ .getValue ())
					{
						if (! this .retainUserOffsets_ .getValue ())
							this .resetUserOffsets ();

						if (layer)
						{
							var navigationInfo = layer .getNavigationInfo ();

							navigationInfo .transitionStart_ = true;

							var
								transitionType = navigationInfo .getTransitionType (),
								transitionTime = navigationInfo .transitionTime_ .getValue ();
						}
						else
						{
							var
								transitionType = "LINEAR",
								transitionTime = 1;
						}

						switch (transitionType)
						{
							case "TELEPORT":
							{
								if (layer)
									layer .getNavigationInfo () .transitionComplete_ = true;

								return;
							}
							case "ANIMATE":
							{
								this .easeInEaseOut .easeInEaseOut_ = [ new Vector2 (0, 1), new Vector2 (1, 0) ];
								break;
							}
							default:
							{
								// LINEAR
								this .easeInEaseOut .easeInEaseOut_ = [ new Vector2 (0, 0), new Vector2 (0, 0) ];
								break;
							}
						}
						
						this .timeSensor .cycleInterval_ = transitionTime;
						this .timeSensor .stopTime_      = this .getBrowser () .getCurrentTime ();
						this .timeSensor .startTime_     = this .getBrowser () .getCurrentTime ();
						this .timeSensor .isActive_ .addInterest (this, "set_active__");

						var
							relativePosition         = new Vector3 (0, 0, 0),
							relativeOrientation      = new Rotation4 (),
							relativeScale            = new Vector3 (0, 0, 0),
							relativeScaleOrientation = new Rotation4 ();

						this .getRelativeTransformation (fromViewpoint, relativePosition, relativeOrientation, relativeScale, relativeScaleOrientation);

						var
							startPosition         = relativePosition,
							startOrientation      = relativeOrientation,
							startScale            = relativeScale,
							startScaleOrientation = relativeScaleOrientation;

						var
							endPosition         = this .positionOffset_         .getValue () .copy (),
							endOrientation      = this .orientationOffset_      .getValue () .copy (),
							endScale            = this .scaleOffset_            .getValue () .copy (),
							endScaleOrientation = this .scaleOrientationOffset_ .getValue () .copy ();

						this .positionOffset_         = startPosition;
						this .orientationOffset_      = startOrientation;
						this .scaleOffset_            = startScale;
						this .scaleOrientationOffset_ = startScaleOrientation;

						this .positionInterpolator         .keyValue_ = [ startPosition, endPosition ];
						this .orientationInterpolator      .keyValue_ = [ startOrientation, endOrientation ];
						this .scaleInterpolator            .keyValue_ = [ startScale, endScale ];
						this .scaleOrientationInterpolator .keyValue_ = [ startScaleOrientation, endScaleOrientation ];
					}
					else
					{
						var
							relativePosition         = new Vector3 (0, 0, 0),
							relativeOrientation      = new Rotation4 (),
							relativeScale            = new Vector3 (0, 0, 0),
							relativeScaleOrientation = new Rotation4 ();

						this .getRelativeTransformation (fromViewpoint, relativePosition, relativeOrientation, relativeScale, relativeScaleOrientation);
		 
						this .positionOffset_         = relativePosition;
						this .orientationOffset_      = relativeOrientation;
						this .scaleOffset_            = relativeScale;
						this .scaleOrientationOffset_ = relativeScaleOrientation;
					}
				}
				catch (error)
				{
					console .log (error);
				}
			},
			transitionStop: function ()
			{
				this .timeSensor .stopTime_ = this .getBrowser () .getCurrentTime ();
				this .timeSensor .isActive_ .removeInterest (this, "set_active__");
			},
			resetUserOffsets: function ()
			{
				this .positionOffset_         = new Vector3 (0, 0, 0);
				this .orientationOffset_      = new Rotation4 ();
				this .scaleOffset_            = new Vector3 (1, 1, 1);
				this .scaleOrientationOffset_ = new Rotation4 ();
				this .centerOfRotationOffset_ = new Vector3 (0, 0, 0);
				this .fieldOfViewScale_       = 1;
			},
			getRelativeTransformation: function (fromViewpoint, relativePosition, relativeOrientation, relativeScale, relativeScaleOrientation)
			// throw
			{
				var differenceMatrix = this .transformationMatrix .copy () .multRight (fromViewpoint .getInverseCameraSpaceMatrix ()) .inverse ();

				differenceMatrix .get (relativePosition, relativeOrientation, relativeScale, relativeScaleOrientation);

				relativePosition .subtract (this .position_ .getValue ());
				relativeOrientation .assign (this .orientation_ .getValue () .copy () .inverse () .multRight (relativeOrientation)); // mit gepuffereter location matrix
			},
			straightenHorizon: function (orientation)
			{
				// Taken from Billboard

				var
					direction = orientation .multVecRot (zAxis .copy ()),
					normal    = Vector3 .cross (direction, this .getUpVector ()),
					vector    = Vector3 .cross (direction, orientation .multVecRot (yAxis .copy ()));

				return new Rotation4 (vector, normal);
			},
			set_active__: function (value)
			{
				if (! value .getValue () && this .timeSensor .fraction_changed_ .getValue () === 1)
				{
					for (var id in this .getLayers ())
					{
						var navigationInfo = this .getLayers () [id] .getNavigationInfo ();

						navigationInfo .transitionComplete_ = true;
					}

					this .easeInEaseOut .set_fraction_ = 1;
				}
			},
			set_bind__: function ()
			{
				if (! this .isBound_ .getValue ())
					this .timeSensor .stopTime_ = this .getBrowser () .getCurrentTime ();
			},
			reshape: function ()
			{
				var navigationInfo = this .getCurrentNavigationInfo ();
	
				this .reshapeWithLimits (navigationInfo .getNearPlane (), navigationInfo .getFarPlane (this));
			},
			reshapeWithLimits: function (zNear, zFar)
			{
				this .getBrowser () .setProjectionMatrix (this .getProjectionMatrix (zNear, zFar, this .getCurrentViewport () .getRectangle ()));
			},
			transform: function ()
			{
				this .getBrowser () .getModelViewMatrix () .set (this .inverseCameraSpaceMatrix);
			},
			traverse: function (type)
			{
				try
				{
					if (type === TraverseType .CAMERA)
					{
						this .getCurrentLayer () .getViewpoints () .push (this);

						this .transformationMatrix .assign (this .getBrowser () .getModelViewMatrix () .get ());

						if (this .isBound_ .getValue ())
						{
							this .cameraSpaceMatrix .set (this .getUserPosition (),
							                              this .getUserOrientation (),
							                              this .scaleOffset_ .getValue (),
							                              this .scaleOrientationOffset_ .getValue ());

							this .cameraSpaceMatrix .multRight (this .transformationMatrix);

							this .inverseCameraSpaceMatrix .assign (this .cameraSpaceMatrix) .inverse ();
						}
					}
				}
				catch (error)
				{
				   //console .log (error);
				}
			},
		});

		return X3DViewpointNode;
	}
});

