
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
			invTransformationMatrix = new Matrix4 (),
			upVector                = new Vector3 (0, 1, 0),
			yAxis                   = new Vector3 (0, 1, 0),
			zAxis                   = new Vector3 (0, 0, 1);

		var
			relativePosition         = new Vector3 (0, 0, 0),
			relativeOrientation      = new Rotation4 (0, 0, 1, 0),
			relativeScale            = new Vector3 (0, 0, 0),
			relativeScaleOrientation = new Rotation4 (0, 0, 1, 0);
				
		var
			localYAxis = new Vector3 (0, 0, 0),
			direction  = new Vector3 (0, 0, 0),
			normal     = new Vector3 (0, 0, 0),
			vector     = new Vector3 (0, 0, 0),
			rotation   = new Rotation4 (0, 0, 1, 0);

		function X3DViewpointNode (browser, executionContext)
		{
			X3DBindableNode    .call (this, browser, executionContext);
			X3DViewpointObject .call (this, browser, executionContext);

			this .addType (X3DConstants .X3DViewpointNode);

		   this .userPosition             = new Vector3 (0, 1, 0);
		   this .userOrientation          = new Rotation4 (0, 0, 1, 0);
		   this .userCenterOfRotation     = new Vector3 (0, 0, 0);
			this .transformationMatrix     = new Matrix4 ();
			this .cameraSpaceMatrix        = new Matrix4 (1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0,  10, 1);
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
				return this .position_ .getValue ();
			},
			getUserPosition: function ()
			{
				return this .userPosition .assign (this .getPosition ()) .add (this .positionOffset_ .getValue ());
			},
			getOrientation: function ()
			{
				return this .orientation_ .getValue ();
			},
			getUserOrientation: function ()
			{
				return this .userOrientation .assign (this .getOrientation ()) .multRight (this .orientationOffset_ .getValue ());
			},
			getCenterOfRotation: function ()
			{
				return this .centerOfRotation_ .getValue ();
			},
			getUserCenterOfRotation: function ()
			{
				return this .userCenterOfRotation .assign (this .getCenterOfRotation ()) .add (this .centerOfRotationOffset_ .getValue ());
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
			   // Local y-axis,
			   // see http://www.web3d.org/documents/specifications/19775-1/V3.3/index.html#NavigationInfo.
			   return yAxis;
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

						this .getRelativeTransformation (fromViewpoint, relativePosition, relativeOrientation, relativeScale, relativeScaleOrientation);

						this .positionInterpolator         .keyValue_ = [ relativePosition,         this .positionOffset_         .getValue () ];
						this .orientationInterpolator      .keyValue_ = [ relativeOrientation,      this .orientationOffset_      .getValue () ];
						this .scaleInterpolator            .keyValue_ = [ relativeScale,            this .scaleOffset_            .getValue () ];
						this .scaleOrientationInterpolator .keyValue_ = [ relativeScaleOrientation, this .scaleOrientationOffset_ .getValue () ];

						this .positionOffset_         = relativePosition;
						this .orientationOffset_      = relativeOrientation;
						this .scaleOffset_            = relativeScale;
						this .scaleOrientationOffset_ = relativeScaleOrientation;
					}
					else
					{
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
				this .positionOffset_         = Vector3   .Zero;
				this .orientationOffset_      = Rotation4 .Identity;
				this .scaleOffset_            = Vector3   .One;
				this .scaleOrientationOffset_ = Rotation4 .Identity;
				this .centerOfRotationOffset_ = Vector3   .Zero;
				this .fieldOfViewScale_       = 1;
			},
			getRelativeTransformation: function (fromViewpoint, relativePosition, relativeOrientation, relativeScale, relativeScaleOrientation)
			// throw
			{
				var differenceMatrix = this .transformationMatrix .copy () .multRight (fromViewpoint .getInverseCameraSpaceMatrix ()) .inverse ();

				differenceMatrix .get (relativePosition, relativeOrientation, relativeScale, relativeScaleOrientation);

				relativePosition .subtract (this .position_ .getValue ());
				relativeOrientation .assign (this .orientation_ .getValue () .copy () .inverse () .multRight (relativeOrientation));
			},
			straightenHorizon: function (orientation)
			{
				// Taken from Billboard

				orientation .multVecRot (direction .assign (zAxis));
				orientation .multVecRot (localYAxis .assign (yAxis));

				normal .assign (direction) .cross (this .getUpVector ());
				vector .assign (direction) .cross (localYAxis);

				rotation .setFromToVec (vector, normal);

				return orientation .multRight (rotation);
			},
			set_active__: function (active)
			{
				if (! active .getValue () && this .timeSensor .fraction_changed_ .getValue () === 1)
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
				if (this .isBound_ .getValue ())
					this .getBrowser () .getNotification () .string_ = this .description_;
				else
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
				   console .log (error);
				}
			},
		});

		return X3DViewpointNode;
	}
});

