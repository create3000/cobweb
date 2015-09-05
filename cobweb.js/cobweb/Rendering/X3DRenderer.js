
define ([
	"cobweb/Bits/TraverseType",
	"standard/Math/Algorithms/QuickSort",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Matrix4",
],
function (TraverseType,
          QuickSort,
          Vector3,
          Matrix4)
{
	function FrameBuffer (browser, width, height, samples, hasColorBuffer)
	{
		var gl = browser .getContext ();
	
		if (! gl .getExtension ("WEBGL_depth_texture"))
		{
		}

		this .browser = browser;
		this .width   = width;
		this .height  = height;
		this .array   = new Uint8Array (width * height * 4);

		this .buffer = gl .createFramebuffer ();

		// Bind frame buffer.
		gl .bindFramebuffer (gl .FRAMEBUFFER, this .buffer);

		// The color buffer
		if (hasColorBuffer)
		{
		}

		// The depth texture

		this .depthTexture = gl .createTexture ();

		gl .bindTexture (gl .TEXTURE_2D, this .depthTexture);
		gl .texParameteri (gl .TEXTURE_2D, gl .TEXTURE_WRAP_S,     gl .CLAMP_TO_EDGE);
		gl .texParameteri (gl .TEXTURE_2D, gl .TEXTURE_WRAP_T,     gl .CLAMP_TO_EDGE);
		gl .texParameteri (gl .TEXTURE_2D, gl .TEXTURE_MIN_FILTER, gl .LINEAR);
		gl .texParameteri (gl .TEXTURE_2D, gl .TEXTURE_MAG_FILTER, gl .LINEAR);
		gl .texImage2D (gl .TEXTURE_2D, 0, gl .RGBA, width, height, 0, gl .RGBA, gl .UNSIGNED_BYTE, null);

		gl .framebufferTexture2D (gl .FRAMEBUFFER, gl .COLOR_ATTACHMENT0, gl .TEXTURE_2D, this .depthTexture, 0);
		gl .bindTexture (gl .TEXTURE_2D, null);

		// The depth buffer

		var depthBuffer = gl .createRenderbuffer ();

		gl .bindRenderbuffer (gl .RENDERBUFFER, depthBuffer);
		gl .renderbufferStorage (gl .RENDERBUFFER, gl .DEPTH_COMPONENT16, width, height);
		gl .framebufferRenderbuffer (gl .FRAMEBUFFER, gl .DEPTH_ATTACHMENT, gl .RENDERBUFFER, depthBuffer);

		// Always check that our framebuffer is ok
		if (gl .checkFramebufferStatus (gl .FRAMEBUFFER) !== gl .FRAMEBUFFER_COMPLETE)
			throw new Error ("Couldn't create frame buffer.");

		gl .bindFramebuffer (gl .FRAMEBUFFER, null);
	}

	function unpack (r, g, b)
	{
		var f = 0;

		f += r / 255;
		f += g / 65025;
		f += b / 16581375;

		return f;
	}

	FrameBuffer .prototype =
	{
		constructor: FrameBuffer,
		getDistance: function (zNear, zFar)
		{
			var gl = this .browser .getContext ();

			gl .readPixels (0, 0, this .width, this .height, gl .RGBA, gl .UNSIGNED_BYTE, this .array);

			var
				array = this .array,
				z     = Number .POSITIVE_INFINITY;

			for (var i = 0; i < array .length; i += 4)
			{
				z = Math .min (z, unpack (array [i], array [i + 1], array [i + 2]));
			}

			var distance = zNear + (zFar - zNear) * z;

			//console .log (distance);

			return distance;
		},
		bind: function ()
		{
			var gl = this .browser .getContext ();

			gl .bindFramebuffer (gl .FRAMEBUFFER, this .buffer);

			gl .viewport (0, 0, this .width, this .height);
			gl .scissor (0, 0, this .width, this .height);
			
			gl .clearColor (1, 0, 0, 0);
			gl .clear (gl .COLOR_BUFFER_BIT | gl .DEPTH_BUFFER_BIT);
		},
		unbind: function ()
		{
			var gl = this .browser .getContext ();
			gl .bindFramebuffer (gl .FRAMEBUFFER, null);
		},
	};

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
		this .depthBuffer          = new FrameBuffer (this .getBrowser (), DEPTH_BUFFER_WIDTH, DEPTH_BUFFER_HEIGHT, 0, false);
		this .distance             = 0;

		this .pm = new Float32Array (16);
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

			this .pm .set (browser .getProjectionMatrixArray ());
			this .l = this .numCollisionShapes;
		},
		draw1: function ()
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
			gl .uniformMatrix4fv (shader .projectionMatrix, false, this .pm);

			//this .depthBuffer .bind ();

			gl .enable (gl .DEPTH_TEST);
			gl .depthMask (true);
			gl .disable (gl .BLEND);

			for (var i = 0, length = this .l; i < length; ++ i)
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

			//this .depthBuffer .unbind ();
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
