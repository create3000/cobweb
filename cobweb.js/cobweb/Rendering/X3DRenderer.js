
define ([
	"jquery",
	"cobweb/Rendering/DepthBuffer",
	"cobweb/Bits/TraverseType",
	"standard/Math/Algorithms/QuickSort",
	"standard/Math/Geometry/Camera",
	"standard/Math/Geometry/Sphere3",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Vector4",
	"standard/Math/Numbers/Rotation4",
	"standard/Math/Numbers/Matrix4",
	"standard/Math/Algorithm",
],
function ($,
          DepthBuffer,
	       TraverseType,
          QuickSort,
          Camera,
          Sphere3,
          Vector3,
          Vector4,
          Rotation4,
          Matrix4,
          Algorithm)
{
"use strict";

	var
		DEPTH_BUFFER_WIDTH  = 16,
		DEPTH_BUFFER_HEIGHT = 16,
		projectionMatrix    = new Matrix4 (),
		modelViewMatrix     = new Matrix4 (),
		localOrientation    = new Rotation4 (0, 0, 1, 0),
		positionOffset      = new Vector3 (0, 0, 0),
		yAxis               = new Vector3 (0, 1, 0),
		zAxis               = new Vector3 (0, 0, 1),
		upVector            = new Vector3 (0, 1, 0),
		vector              = new Vector3 (0, 0, 0),
		rotation            = new Rotation4 (0, 0, 1, 0);

	function compareDistance (lhs, rhs) { return lhs .distance < rhs .distance; }

	function X3DRenderer (browser, executionContext)
	{
		this .viewVolumes          = [ ];
		this .localLights          = [ ];
		this .numOpaqueShapes      = 0;
		this .numTransparentShapes = 0;
		this .numCollisionShapes   = 0;
		this .opaqueShapes         = [ ];
		this .transparentShapes    = [ ];
		this .transparencySorter   = new QuickSort (this .transparentShapes, compareDistance);
		this .collisionShapes      = [ ];
		this .activeCollisions     = { };
		this .collisionSphere      = new Sphere3 (0, Vector3 .Zero);
		this .invModelViewMatrix   = new Matrix4 ();
		this .speed                = 0;

		try
		{
			this .depthBuffer = new DepthBuffer (this .getBrowser (), DEPTH_BUFFER_WIDTH, DEPTH_BUFFER_HEIGHT);
		}
		catch (error)
		{
		   this .distance = 0;
		   this .navigate = function () { };
		}
	}

	X3DRenderer .prototype =
	{
		constructor: X3DRenderer,
		bboxSize: new Vector3 (0, 0, 0),
		bboxCenter: new Vector3 (0, 0, 0),
		translation: new Vector3 (0, 0, 0),
		initialize: function ()
		{
		},
		getViewVolumes: function ()
		{
			return this .viewVolumes;
		},
		getViewVolume: function ()
		{
			return this .viewVolumes [this .viewVolumes .length - 1];
		},
		getLocalLights: function ()
		{
			return this .localLights;
		},
		addShape: function (shape)
		{
			var
				modelViewMatrix = this .getBrowser () .getModelViewMatrix () .get (),
				bboxSize        = modelViewMatrix .multDirMatrix (this .bboxSize   .assign (shape .getBBoxSize ())),
				bboxCenter      = modelViewMatrix .multVecMatrix (this .bboxCenter .assign (shape .getBBoxCenter ())),
				radius          = bboxSize .abs () / 2,
				distance        = bboxCenter .z,
				viewVolume      = this .viewVolumes [this .viewVolumes .length - 1];

			if (viewVolume .intersectsSphere (radius, bboxCenter))
			{
				if (shape .isTransparent ())
				{
					if (this .numTransparentShapes === this .transparentShapes .length)
						this .transparentShapes .push ({ transparent: true, modelViewMatrix: new Float32Array (16), scissor: new Vector4 (0, 0, 0, 0), localLights: [ ], geometryType: 3, });

					var context = this .transparentShapes [this .numTransparentShapes];

					++ this .numTransparentShapes;
				}
				else
				{
					if (this .numOpaqueShapes === this .opaqueShapes .length)
						this .opaqueShapes .push ({ transparent: false, modelViewMatrix: new Float32Array (16), scissor: new Vector4 (0, 0, 0, 0), localLights: [ ], geometryType: 3, });

					var context = this .opaqueShapes [this .numOpaqueShapes];

					++ this .numOpaqueShapes;
				}

				context .modelViewMatrix .set (modelViewMatrix);
				context .shape    = shape;
				context .scissor .assign (viewVolume .getScissor ());
				context .distance = distance;
				context .fog      = this .getFog ();

				var
				   sourceLights = this .localLights,
				   destLights   = context .localLights;

				for (var i = 0, length = sourceLights .length; i < length; ++ i)
				   destLights [i] = sourceLights [i];
				
				destLights .length = sourceLights .length;
			}
		},
		addCollision: function (shape)
		{
			var
				modelViewMatrix = this .getBrowser () .getModelViewMatrix () .get (),
				viewVolume      = this .viewVolumes [this .viewVolumes .length - 1];

				if (this .numCollisionShapes === this .collisionShapes .length)
					this .collisionShapes .push ({ modelViewMatrix: new Float32Array (16), collisions: [ ] });

				var context = this .collisionShapes [this .numCollisionShapes];

				++ this .numCollisionShapes;

				context .modelViewMatrix .set (modelViewMatrix);
				context .geometry = shape .getGeometry ();
				context .scissor  = viewVolume .getScissor ();

				var
					sourceCollisions = this .getBrowser () .getCollisions (),
					destCollisions   = context .collisions;

				for (var i = 0, length = sourceCollisions .length; i < length; ++ i)
				   destCollisions [i] = sourceCollisions [i];
				
				destCollisions .length = sourceCollisions .length;
		},
		constrainTranslation: function (translation)
		{
		   var t0 = performance .now ();

			var
				navigationInfo  = this .getNavigationInfo (),
				distance        = this .getDistance (translation),
				zFar            = navigationInfo .getFarPlane (this .getViewpoint ());

			if (zFar - distance > 0) // Are there polygons before the viewer
			{
				var collisionRadius = navigationInfo .getCollisionRadius ();
			
				distance -= collisionRadius;

				if (distance > 0)
				{
					// Move
					
					var length = translation .abs ();

					if (length > distance)
					{
						// Collision: The wall is reached.
						return translation .normalize () .multiply (distance);
					}

					return translation;
				}

				// Collision
				return translation .normalize () .multiply (distance);
			}

			this .collisionTime += performance .now () - t0;
			return translation;
		},
		getDistance: function (translation)
		{
			try
			{
				// Apply collision to translation.

				var
					viewpoint       = this .getViewpoint (),
					navigationInfo  = this .getNavigationInfo (),
					collisionRadius = navigationInfo .getCollisionRadius (),
					bottom          = navigationInfo .getStepHeight () - navigationInfo .getAvatarHeight (),
					zNear           = navigationInfo .getNearPlane (),
					zFar            = navigationInfo .getFarPlane (viewpoint);

				// Determine width and height of camera
					
			
				// Reshape camera

				Camera .ortho (-collisionRadius, collisionRadius, bottom, collisionRadius, zNear, zFar, projectionMatrix);

				// Translate camera to user position and to look in the direction of the translation.

				localOrientation .assign (viewpoint .orientation_ .getValue ()) .inverse () .multRight (viewpoint .getOrientation ());
				rotation .setFromToVec (zAxis, vector .assign (translation) .negate ()) .multRight (localOrientation);
				//viewpoint .straightenHorizon (rotation);

				modelViewMatrix .assign (viewpoint .getTransformationMatrix ());
				modelViewMatrix .translate (viewpoint .getUserPosition ());
				modelViewMatrix .rotate (rotation);
				modelViewMatrix .inverse ();

				this .getBrowser () .setProjectionMatrix (modelViewMatrix .multRight (projectionMatrix));

				return this .getDepth ();
			}
			catch (error)
			{
				console .log (error);
			}
		},
		getDepth: function ()
		{
			// Render all objects

			var
				browser         = this .getBrowser (),
				gl              = browser .getContext (),
				shader          = browser .getDepthShader (),
				collisionShapes = this .collisionShapes;
			
			shader .use ();
			gl .uniformMatrix4fv (shader .projectionMatrix, false, browser .getProjectionMatrixArray ());

			this .depthBuffer .bind ();

			gl .enable (gl .DEPTH_TEST);
			gl .depthMask (true);
			gl .disable (gl .BLEND);

			for (var i = 0, length = this .numCollisionShapes; i < length; ++ i)
			{
				var
					context = collisionShapes [i],
					scissor = context .scissor;

				gl .scissor (scissor .x,
				             scissor .y,
				             scissor .z,
				             scissor .w);

				gl .uniformMatrix4fv (shader .modelViewMatrix, false, context .modelViewMatrix);

				context .geometry .collision (shader);
			}

			var
				navigationInfo = this .getNavigationInfo (),
				viewpoint      = this .getViewpoint (),
				zNear          = navigationInfo .getNearPlane (),
				zFar           = navigationInfo .getFarPlane (viewpoint),
				radius         = navigationInfo .getCollisionRadius ();

			var distance = this .depthBuffer .getDistance (radius, zNear, zFar);

			this .depthBuffer .unbind ();

			return distance;
		},
		render: function (type)
		{
			switch (type)
			{
				case TraverseType .COLLISION:
				{
					// Collect for collide and gravite
					this .numCollisionShapes = 0;

					this .collect (type);
					this .collide ();
					this .gravite ();
					break;
				}
				case TraverseType .DISPLAY:
				{
					this .numOpaqueShapes      = 0;
					this .numTransparentShapes = 0;

					this .collect (type);
					this .draw ();
					break;
				}
			}
		},
		collide: function ()
		{
			// Collision nodes are handled here.

			var activeCollisions = { }; // current active Collision nodes

			this .collisionSphere .radius = this .getNavigationInfo () .getCollisionRadius () * 1.2; // Make the radius a little bit larger.

			for (var i = 0; i < this .numCollisionShapes; ++ i)
			{
				try
				{
					var
						context    = this .collisionShapes [i],
						collisions = context .collisions;

					if (collisions .length)
					{
					   this .invModelViewMatrix .assign (context .modelViewMatrix) .multRight (this .getViewpoint () .getInverseCameraSpaceMatrix ()) .inverse ();

					   this .collisionSphere .center .set (this .invModelViewMatrix [12], this .invModelViewMatrix [13], this .invModelViewMatrix [14]);

						if (context .geometry .intersectsSphere (this .collisionSphere))
						{
						   for (var c = 0; c < collisions .length; ++ c)
								activeCollisions [collisions [c] .getId ()] = collisions [c];
						}
					}
				}
				catch (error)
				{ }
			}

			// Set isActive to FALSE for affected nodes.

			if (! $.isEmptyObject (this .activeCollisions))
			{
				var inActiveCollisions = $.isEmptyObject (activeCollisions)
				                         ? this .activeCollisions
				                         : Algorithm .set_difference (this .activeCollisions, activeCollisions, { });
		
				for (var key in inActiveCollisions)
					inActiveCollisions [key] .set_active (false);
			}

			// Set isActive to TRUE for affected nodes.

			this .activeCollisions = activeCollisions;

			for (var key in activeCollisions)
				activeCollisions [key] .set_active (true);
		},
		gravite: function ()
		{
		   try
		   {
				// Terrain following and gravitation

				if (this .getBrowser () .getCurrentViewer () !== "WALK")
					return;

				// Get NavigationInfo values

				var
					navigationInfo  = this .getNavigationInfo (),
					viewpoint       = this .getViewpoint (),
					collisionRadius = navigationInfo .getCollisionRadius (),
					zNear           = navigationInfo .getNearPlane (),
					zFar            = navigationInfo .getFarPlane (viewpoint),
					height          = navigationInfo .getAvatarHeight (),
					stepHeight      = navigationInfo .getStepHeight ();

				// Reshape viewpoint for gravite.

				Camera .ortho (-collisionRadius, collisionRadius, -collisionRadius, collisionRadius, zNear, zFar, projectionMatrix)

				// Transform viewpoint to look down the up vector

				var
					upVector = viewpoint .getUpVector (),
					down     = rotation .setFromToVec (zAxis, upVector);

				modelViewMatrix .assign (viewpoint .getTransformationMatrix ());
				modelViewMatrix .translate (viewpoint .getUserPosition ());
				modelViewMatrix .rotate (down);
				modelViewMatrix .inverse ();

				this .getBrowser () .setProjectionMatrix (modelViewMatrix .multRight (projectionMatrix));

				var distance = this .getDepth ();

				// Gravite or step up

				if (zFar - distance > 0) // Are there polygons under the viewer
				{
					distance -= height;

					var up = rotation .setFromToVec (yAxis, upVector);

					if (distance > 0)
					{
						// Gravite and fall down the floor

						var currentFrameRate = this .speed ? this .getBrowser () .getCurrentFrameRate () : 1000000;

						this .speed -= this .getBrowser () .getBrowserOptions () .Gravity_ .getValue () / currentFrameRate;

						var translation = this .speed / currentFrameRate;

						if (translation < -distance)
						{
							// The ground is reached.
							translation = -distance;
							this .speed = 0;
						}

						viewpoint .positionOffset_ = viewpoint .positionOffset_ .getValue () .add (up .multVecRot (vector .set (0, translation, 0)));
					}
					else
					{
						this .speed = 0;

						distance = -distance;

						if (distance > 0.01 && distance < stepHeight)
						{
							// Step up
							var translation = this .constrainTranslation (up .multVecRot (this .translation .set (0, distance, 0)));

							//if (getBrowser () -> getBrowserOptions () -> animateStairWalks ())
							//{
							//	float step = getBrowser () -> getCurrentSpeed () / getBrowser () -> getCurrentFrameRate ();
							//	step = abs (getInverseCameraSpaceMatrix () .mult_matrix_dir (Vector3f (0, step, 0) * up));
							//
							//	Vector3f offset = Vector3f (0, step, 0) * up;
							//
							//	if (math::abs (offset) > math::abs (translation) or getBrowser () -> getCurrentSpeed () == 0)
							//		offset = translation;
							//
							//	getCurrentViewpoint () -> positionOffset () += offset;
							//}
							//else
								viewpoint .positionOffset_ = translation .add (viewpoint .positionOffset_ .getValue ());
						}
					}
				}
				else
				{
					this .speed = 0;
				}
			}
			catch (error)
			{
			   console .log (error);
			}
		},
		draw: function ()
		{
			var
				browser           = this .getBrowser (),
				gl                = browser .getContext (),
				opaqueShapes      = this .opaqueShapes,
				transparentShapes = this .transparentShapes;

			browser .getPointShader ()   .setGlobalUniforms ();
			browser .getLineShader ()    .setGlobalUniforms ();
			browser .getDefaultShader () .setGlobalUniforms ();

			// Sorted blend

			// Render opaque objects first

			gl .enable (gl .DEPTH_TEST);
			gl .depthMask (true);
			gl .disable (gl .BLEND);

			for (var i = 0, length = this .numOpaqueShapes; i < length; ++ i)
			{
				var
					context = opaqueShapes [i],
					scissor = context .scissor;

				gl .scissor (scissor .x,
				             scissor .y,
				             scissor .z,
				             scissor .w);

				context .shape .draw (context);
			}

			// Render transparent objects

			gl .depthMask (false);
			gl .enable (gl .BLEND);

			this .transparencySorter .sort (0, this .numTransparentShapes);

			for (var i = 0, length = this .numTransparentShapes; i < length; ++ i)
			{
				var
					context = transparentShapes [i],
					scissor = context .scissor;

				gl .scissor (scissor .x,
				             scissor .y,
				             scissor .z,
				             scissor .w);

				context .shape .draw (context);
			}

			gl .depthMask (true);
			gl .disable (gl .BLEND);

			// Recycle global lights.

			var lights = this .getBrowser () .getGlobalLights ();

			for (var i = 0; i < lights .length; ++ i)
			   lights [i] .recycle ();

			lights .length = 0;

			// Recycle local lights.

			var lights = this .getBrowser () .getLocalLights ();

			for (var i = 0; i < lights .length; ++ i)
			   lights [i] .recycle ();

			lights .length = 0;
		},
	};

	return X3DRenderer;
});
