
define ([
	"cobweb/Bits/TraverseType",
	"standard/Math/Algorithms/QuickSort",
	"standard/Math/Numbers/Matrix4",
],
function (TraverseType, QuickSort, Matrix4)
{
	function ShapeContainer ()
	{
		this .shape           = null;
		this .transparent     = false;
		this .modelViewMatrix = new Matrix4 ();
		this .scissor         = null;
		this .distance        = 0;
		this .localLights     = [ ];
	}

	ShapeContainer .prototype =
	{
		assign: function (shape, transparent, modelViewMatrix, scissor, distance)
		{
			this .shape           = shape;
			this .transparent     = transparent;
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
	}

	X3DRenderer .prototype =
	{
		constructor: X3DRenderer,
		initialize: function ()
		{
		},
		getViewVolumes: function ()
		{
			return this .viewVolumes;
		},
		addShape: function (shape)
		{
			var modelViewMatrix = this .getBrowser () .getModelViewMatrix () .get ();

			var bbox       = shape .getBBox () .copy () .multRight (modelViewMatrix);
			var bboxSize   = bbox .size;
			var bboxCenter = bbox .center;
			var depth      = bboxSize .z / 2;
			var distance   = bboxCenter .z;
			var min        = distance - depth;

			if (min < 0)
			{
				var viewVolume = this .viewVolumes [this .viewVolumes .length - 1];

				if (viewVolume .intersects (bboxSize, bboxCenter))
				{
					if (shape .isTransparent ())
					{
						if (this .numTransparentShapes === this .transparentShapes .length)
							this .transparentShapes .push (new ShapeContainer ());

						this .transparentShapes [this .numTransparentShapes] .assign (shape, true, modelViewMatrix, viewVolume .getScissor (), distance);

						++ this .numTransparentShapes;
					}
					else
					{
						if (this .numOpaqueShapes === this .opaqueShapes .length)
							this .opaqueShapes .push (new ShapeContainer ());

						this .opaqueShapes [this .numOpaqueShapes] .assign (shape, false, modelViewMatrix, viewVolume .getScissor (), distance);

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
					this .collect (type);
					this .draw ();
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
			var gl = this .getBrowser () .getContext ();

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
