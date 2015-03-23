
define ([
	"cobweb/Bits/TraverseType",
	"standard/Math/Algorithms/QuickSort",
	"standard/Math/Numbers/Matrix4",
],
function (TraverseType, QuickSort, Matrix4)
{
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
		this .traverseTime         = 0;
		this .drawTime             = 0;
	}

	X3DRenderer .prototype =
	{
		constructor: X3DRenderer,
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
				bboxSize        = modelViewMatrix .multDirMatrix (shape .getBBoxSize () .copy ()),
				bboxCenter      = modelViewMatrix .multVecMatrix (shape .getBBoxCenter () .copy ()),
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
			}
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
					this .drawTime = performance .now () - t0;

					break;
				}
			}

			this .getBrowser () .getGlobalLights () .length = 0;
		},
		navigate: function ()
		{
		
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

			browser .getDefaultShader () .setGlobalLights ();

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
