
define ([
	"cobweb/Bits/TraverseType",
	"standard/Math/Algorithms/QuickSort",
	"standard/Math/Numbers/Matrix4",
],
function (TraverseType, QuickSort, Matrix4)
{
	function ShapeContainer (transparent)
	{
		this .shape           = null;
		this .transparent     = transparent;
		this .modelViewMatrix = new Matrix4 ();
		this .scissor         = null;
		this .distance        = 0;
		this .localLights     = [ ];
	}

	ShapeContainer .prototype =
	{
		set: function (shape, modelViewMatrix, scissor, distance)
		{
			this .shape           = shape;
			this .modelViewMatrix .assign (modelViewMatrix);
			this .scissor         = scissor;
			this .distance        = distance;	
		},
		draw: function (gl)
		{
			gl .scissor (this .scissor [0],
			             this .scissor [1],
			             this .scissor [2],
			             this .scissor [3]);

			this .shape .draw (this);
		},
	};

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
			var modelViewMatrix = this .getBrowser () .getModelViewMatrix () .get ();
			var bboxSize        = modelViewMatrix .multDirMatrix (shape .getBBoxSize () .copy ());
			var bboxCenter      = modelViewMatrix .multVecMatrix (shape .getBBoxCenter () .copy ());
			var radius          = bboxSize .abs () / 2;
			var distance        = bboxCenter .z;
			var min             = distance - radius;

			if (min < 0)
			{
				var viewVolume = this .viewVolumes [this .viewVolumes .length - 1];

				if (viewVolume .intersectsSphere (radius, bboxCenter))
				{
					if (shape .isTransparent ())
					{
						if (this .numTransparentShapes === this .transparentShapes .length)
							this .transparentShapes .push (new ShapeContainer (true));

						this .transparentShapes [this .numTransparentShapes] .set (shape, modelViewMatrix, viewVolume .getScissor (), distance);

						++ this .numTransparentShapes;
					}
					else
					{
						if (this .numOpaqueShapes === this .opaqueShapes .length)
							this .opaqueShapes .push (new ShapeContainer (false));

						this .opaqueShapes [this .numOpaqueShapes] .set (shape, modelViewMatrix, viewVolume .getScissor (), distance);

						++ this .numOpaqueShapes;
					}
				}
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
			var browser = this .getBrowser ();
			var gl      = browser .getContext ();
			var shader  = browser .getDefaultShader ();

			shader .setGlobalLights ();

			// Sorted blend

			// Render opaque objects first

			gl .enable (gl .DEPTH_TEST);
			gl .depthMask (true);
			gl .disable (gl .BLEND);

			for (var i = 0; i < this .numOpaqueShapes; ++ i)
				this .opaqueShapes [i] .draw (gl);

			// Render transparent objects

			gl .depthMask (false);
			gl .enable (gl .BLEND);

			this .transparencySorter .sort (0, this .numTransparentShapes);

			for (var i = 0; i < this .numTransparentShapes; ++ i)
				this .transparentShapes [i] .draw (gl);

			gl .depthMask (true);
			gl .disable (gl .BLEND);
		},
	};

	return X3DRenderer;
});
