
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Components/Core/X3DBindableNode",
	"cobweb/Components/Navigation/X3DViewpointObject",
	"cobweb/Bits/TraverseType",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Matrix4",
],
function ($,
          Fields,
          X3DBindableNode, 
          X3DViewpointObject,
          TraverseType,
          X3DConstants,
          Matrix4)
{
	with (Fields)
	{
		function X3DViewpointNode (browser, executionContext)
		{
			X3DBindableNode    .call (this, browser, executionContext);
			X3DViewpointObject .call (this, browser, executionContext);

			this .addType (X3DConstants .X3DViewpointNode);

			this .addChildren ("positionOffset",         new SFVec3f (),
		                      "orientationOffset",      new SFRotation (),
		                      "scaleOffset",            new SFVec3f (1, 1, 1),
		                      "scaleOrientationOffset", new SFRotation (),
		                      "centerOfRotationOffset", new SFVec3f (),
		                      "fieldOfViewScale",       new SFFloat (1));

			this .parentMatrix             = new Matrix4 ();
			this .cameraSpaceMatrix        = new Matrix4 (1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 10, 1);
			this .inverseCameraSpaceMatrix = new Matrix4 (1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -10, 1);
		}

		X3DViewpointNode .prototype = $.extend (new X3DBindableNode (),
			X3DViewpointObject .prototype,
		{
			constructor: X3DViewpointNode,
			initialize: function ()
			{
				X3DBindableNode    .prototype .initialize .call (this);
				X3DViewpointObject .prototype .initialize .call (this);
			},
			getUserPosition: function ()
			{
				return this .position_ .getValue () .add (this .positionOffset_ .getValue ());
			},
			getUserOrientation: function ()
			{
				return this .orientation_ .getValue () .multRight (this .orientationOffset_ .getValue ());
			},
			getUserCenterOfRotation: function ()
			{
				return this .centerOfRotation_ .getValue () .add (this .centerOfRotationOffset_ .getValue ());
			},
			setCameraSpaceMatrix: function (value)
			{
				try
				{
					this .cameraSpaceMatrix        = value;
					this .inverseCameraSpaceMatrix = value .inverse ();
				}
				catch (error)
				{ }
			},
			getCameraSpaceMatrix: function ()
			{
				return this .cameraSpaceMatrix;
			},
			getUpVector: function ()
			{
				return new Vector3 (0, 1, 0);
			},
			getMaxZFar: function ()
			{
				return 1e5;
			},
			reshape: function ()
			{
				this .reshapeWithLimits (0.25, 1000000);
			},
			reshapeWithLimits: function (zNear, zFar)
			{
				this .getBrowser () .getProjectionMatrix () .set (this .getProjectionMatrix (zNear, zFar, this .getBrowser () .getViewport ()));
			},
			transform: function ()
			{
				this .getBrowser () .getModelViewMatrix () .set (this .inverseCameraSpaceMatrix);
			},
			traverse: function (type)
			{
				if (type === TraverseType .CAMERA)
				{
					this .getCurrentLayer () .getViewpoints () .push (this);

					this .parentMatrix = this .getBrowser () .getModelViewMatrix () .get () .copy ();

					if (+this .isBound_)
					{
						var matrix = new Matrix4 ();
						matrix .set (this .getUserPosition (),
						             this .getUserOrientation (),
						             this .scaleOffset_ .getValue (),
						             this .scaleOrientationOffset_ .getValue ());

						this .setCameraSpaceMatrix (matrix .multRight (this .getBrowser () .getModelViewMatrix () .get ()));
					}
				}
			},
		});

		return X3DViewpointNode;
	}
});

