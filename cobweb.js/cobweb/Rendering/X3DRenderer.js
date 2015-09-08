
define ([
	"cobweb/Rendering/DepthBuffer",
	"cobweb/Bits/TraverseType",
	"standard/Math/Algorithms/QuickSort",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Matrix4",
],
function (DepthBuffer,
	       TraverseType,
          QuickSort,
          Vector3,
          Matrix4)
{
	var
		DEPTH_BUFFER_WIDTH  = 16,
		DEPTH_BUFFER_HEIGHT = 16;

	function X3DRenderer (browser, executionContext)
	{
		this .viewVolumes          = [ ];
		this .localObjects         = [ ];
		this .numOpaqueShapes      = 0;
		this .numTransparentShapes = 0;
		this .numCollisionShapes   = 0;
		this .opaqueShapes         = [ ];
		this .transparentShapes    = [ ];
		this .transparencySorter   = new QuickSort (this .transparentShapes, function (lhs, rhs) { return lhs .distance < rhs .distance; });
		this .collisionShapes      = [ ];
		this .traverseTime         = 0;
		this .displayTime          = 0;
		this .distance             = 0;

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
		initialize: function ()
		{
		},
		getViewVolumeStack: function ()
		{
			return this .viewVolumes;
		},
		getViewVolume: function ()
		{
			return this .viewVolumes [this .viewVolumes .length - 1];
		},
		addShape: function (shape)
		{
			var
				modelViewMatrix = this .getBrowser () .getModelViewMatrix () .get (),
				bboxSize        = modelViewMatrix .multDirMatrix (this .bboxSize .assign (shape .getBBoxSize ())),
				bboxCenter      = modelViewMatrix .multVecMatrix (this .bboxCenter .assign (shape .getBBoxCenter ())),
				radius          = bboxSize .abs () / 2,
				distance        = bboxCenter .z,
				viewVolume      = this .viewVolumes [this .viewVolumes .length - 1];

			if (viewVolume .intersectsSphere (radius, bboxCenter))
			{
				if (shape .isTransparent ())
				{
					if (this .numTransparentShapes === this .transparentShapes .length)
						this .transparentShapes .push ({ modelViewMatrix: new Float32Array (16), transparent: true, localLights: [ ] });

					var context = this .transparentShapes [this .numTransparentShapes];

					++ this .numTransparentShapes;
				}
				else
				{
					if (this .numOpaqueShapes === this .opaqueShapes .length)
						this .opaqueShapes .push ({ modelViewMatrix: new Float32Array (16), transparent: false, localLights: [ ] });

					var context = this .opaqueShapes [this .numOpaqueShapes];

					++ this .numOpaqueShapes;
				}

				context .modelViewMatrix .set (modelViewMatrix);
				context .shape    = shape;
				context .scissor  = viewVolume .getScissor ();
				context .distance = distance;
				context .fog      = this .getFog ();
			}
		},
		addCollision: function (shape)
		{
			var
				modelViewMatrix = this .getBrowser () .getModelViewMatrix () .get (),
				bboxSize        = modelViewMatrix .multDirMatrix (this .bboxSize .assign (shape .getBBoxSize ())),
				bboxCenter      = modelViewMatrix .multVecMatrix (this .bboxCenter .assign (shape .getBBoxCenter ())),
				radius          = bboxSize .abs () / 2,
				distance        = bboxCenter .z,
				viewVolume      = this .viewVolumes [this .viewVolumes .length - 1];

			if (viewVolume .intersectsSphere (radius, bboxCenter))
			{
				if (this .numCollisionShapes === this .collisionShapes .length)
					this .collisionShapes .push ({ modelViewMatrix: new Float32Array (16) });

				var context = this .collisionShapes [this .numCollisionShapes];

				++ this .numCollisionShapes;

				context .modelViewMatrix .set (modelViewMatrix);
				context .geometry = shape .getGeometry ();
				context .scissor  = viewVolume .getScissor ();
				context .distance = distance;
			}
		},
		getDistance: function ()
		{
			return this .distance;
		},
		render: function (type)
		{
			this .numOpaqueShapes      = 0;
			this .numTransparentShapes = 0;
			this .numCollisionShapes   = 0;

			switch (type)
			{
				case TraverseType .NAVIGATION:
				{
					this .collect (type);
					this .navigate ();
					break;
				}
				case TraverseType .COLLISION:
				{
					// Collect for collide and gravite
					this .collect (type);
					this .collide ();
					break;
				}
				case TraverseType .DISPLAY:
				{
					var t0 = performance .now ();
					this .collect (type);
					this .traverseTime = performance .now () - t0;

					var t0 = performance .now ();
					this .draw ();
					this .displayTime = performance .now () - t0;

					break;
				}
			}

			this .getBrowser () .getGlobalLights () .length = 0;
		},
		navigate: function ()
		{
			// Measure distance

			// Get NavigationInfo values

			var
				navigationInfo = this .getNavigationInfo (),
				viewpoint      = this .getViewpoint ();

			var
				zNear = navigationInfo .getNearPlane (),
				zFar  = navigationInfo .getFarPlane (viewpoint);

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

				gl .uniformMatrix4fv (shader .modelViewMatrix,  false, context .modelViewMatrix);

				context .geometry .collision (shader);
			}

			this .distance = this .depthBuffer .getDistance (zNear, zFar);

			this .depthBuffer .unbind ();
		},
		collide: function ()
		{
		
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
		},
	};

	return X3DRenderer;
});
