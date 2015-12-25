
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Components/Core/X3DBindableNode",
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
"use strict";

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
		X3DBindableNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DViewpointNode);

	   this .userPosition             = new Vector3 (0, 1, 0);
	   this .userOrientation          = new Rotation4 (0, 0, 1, 0);
	   this .userCenterOfRotation     = new Vector3 (0, 0, 0);
		this .transformationMatrix     = new Matrix4 ();
		this .cameraSpaceMatrix        = new Matrix4 (1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0,  10, 1);
		this .inverseCameraSpaceMatrix = new Matrix4 (1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -10, 1);

		this .timeSensor                   = new TimeSensor              (browser .getPrivateScene ());
		this .easeInEaseOut                = new EaseInEaseOut           (browser .getPrivateScene ());
		this .positionInterpolator         = new PositionInterpolator    (browser .getPrivateScene ());
		this .orientationInterpolator      = new OrientationInterpolator (browser .getPrivateScene ());
		this .scaleInterpolator            = new PositionInterpolator    (browser .getPrivateScene ());
		this .scaleOrientationInterpolator = new OrientationInterpolator (browser .getPrivateScene ());
	}

	X3DViewpointNode .prototype = $.extend (Object .create (X3DBindableNode .prototype),
	{
		constructor: X3DViewpointNode,
		initialize: function ()
		{
			X3DBindableNode .prototype .initialize .call (this);

			this .addChildren ("positionOffset",         new Fields .SFVec3f (),
			                   "orientationOffset",      new Fields .SFRotation (),
			                   "scaleOffset",            new Fields .SFVec3f (1, 1, 1),
			                   "scaleOrientationOffset", new Fields .SFRotation (),
			                   "centerOfRotationOffset", new Fields .SFVec3f (),
			                   "fieldOfViewScale",       new Fields .SFFloat (1));
		
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
		getEaseInEaseOut: function ()
		{
			return this .easeInEaseOut;
		},
		setInterpolators: function () { },
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
	
					for (var id in this .getLayers ())
						this .getLayers () [id] .getNavigationInfo () .transitionStart_ = true;;

					if (layer)
					{
						var navigationInfo = layer .getNavigationInfo ();

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

					this .setInterpolators (fromViewpoint);
				}
				else
				{
					this .getRelativeTransformation (fromViewpoint, relativePosition, relativeOrientation, relativeScale, relativeScaleOrientation);
	 
					this .positionOffset_         = relativePosition;
					this .orientationOffset_      = relativeOrientation;
					this .scaleOffset_            = relativeScale;
					this .scaleOrientationOffset_ = relativeScaleOrientation;

					this .setInterpolators (fromViewpoint);
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
		lookAtPoint: function (point, factor, straighten)
		{
			if (! this .getBrowser () .getActiveLayer ())
				return;

			try
			{
				this .getCameraSpaceMatrix () .multVecMatrix (point);

				Matrix4 .inverse (this .getTransformationMatrix ()) .multVecMatrix (point);

				var minDistance = this .getBrowser () .getActiveLayer () .getNavigationInfo () .getNearPlane () * 2;
		
				this .lookAt (point, minDistance, factor, straighten);
			}
			catch (error)
			{
				console .error (error);
			}
		},
		lookAt: function (point, distance, factor, straighten)
		{
			var offset = point .copy () .add (this .getUserOrientation () .multVecRot (new Vector3 (0, 0, distance))) .subtract (this .getPosition ());

			for (var id in this .getLayers ())
				this .getLayers () [id] .getNavigationInfo () .transitionStart_ = true;;
		
			this .timeSensor .cycleInterval_ = 0.2;
			this .timeSensor .stopTime_      = this .getBrowser () .getCurrentTime ();
			this .timeSensor .startTime_     = this .getBrowser () .getCurrentTime ();
			this .timeSensor .isActive_ .addInterest (this, "set_active__");
	
			this .easeInEaseOut .easeInEaseOut_ = [ new Vector2 (0, 1), new Vector2 (1, 0) ];

			var
				translation = Vector3 .lerp (this .positionOffset_ .getValue (), offset, factor),
				direction   = Vector3 .add (this .getPosition (), translation) .subtract (point),
				rotation    = Rotation4 .multRight (this .orientationOffset_ .getValue (), new Rotation4 (this .getUserOrientation () .multVecRot (new Vector3 (0, 0, 1)), direction));
		
			if (straighten)
				rotation = Rotation4 .inverse (this .getOrientation ()) .multRight (this .straightenHorizon (Rotation4 .multRight (this .getOrientation (), rotation)));
		
			this .positionInterpolator         .keyValue_ = [ this .positionOffset_ .getValue (),         translation ];
			this .orientationInterpolator      .keyValue_ = [ this .orientationOffset_ .getValue (),      rotation ];
			this .scaleInterpolator            .keyValue_ = [ this .scaleOffset_ .getValue (),            this .scaleOffset_ .getValue () ];
			this .scaleOrientationInterpolator .keyValue_ = [ this .scaleOrientationOffset_ .getValue (), this .scaleOrientationOffset_ .getValue () ];
		
			this .centerOfRotationOffset_ = Vector3 .subtract (point, this .getCenterOfRotation ());
			this .set_bind_               = true;
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
	
			var projectionMatrix = this .getProjectionMatrix (navigationInfo .getNearPlane (),
                                                           navigationInfo .getFarPlane (this),
                                                           this .getCurrentViewport () .getRectangle ());

			this .getBrowser () .setProjectionMatrix (projectionMatrix);
		},
		transform: function ()
		{
			this .getBrowser () .getModelViewMatrix () .set (this .inverseCameraSpaceMatrix);
		},
		traverse: function (type)
		{
			this .getCurrentLayer () .getViewpoints () .push (this);

			this .transformationMatrix .assign (this .getBrowser () .getModelViewMatrix () .get ());
		},
		update: function ()
		{
			try
			{
				this .cameraSpaceMatrix .set (this .getUserPosition (),
				                              this .getUserOrientation (),
				                              this .scaleOffset_ .getValue (),
				                              this .scaleOrientationOffset_ .getValue ());

				this .cameraSpaceMatrix .multRight (this .transformationMatrix);

				this .inverseCameraSpaceMatrix .assign (this .cameraSpaceMatrix) .inverse ();
			}
			catch (error)
			{
			   console .log (error);
			}
		},
	});

	return X3DViewpointNode;
});


