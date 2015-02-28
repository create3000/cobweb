
define ([
	"cobweb/Bits/TraverseType",
	"standard/Math/Algorithms/QuickSort",
],
function (TraverseType, QuickSort)
{
	function ShapeContainer ()
	{
		this .shape           = null;
		this .transparent     = false;
		this .modelViewMatrix = null;
		this .distance        = 0;
	}
	
	ShapeContainer .prototype =
	{
		assign: function (shape, transparent, modelViewMatrix, distance)
		{
			this .shape           = shape;
			this .transparent     = transparent;
			this .modelViewMatrix = modelViewMatrix;
			this .distance        = distance;	
		},
		draw: function ()
		{
			this .shape .draw (this);
		},
	};

	function X3DRenderer (browser, executionContext)
	{
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

			//this .globalObjects .length = 0;
		},
		addShape: function (shape)
		{
			var modelViewMatrix = this .getBrowser () .getModelViewMatrix () .get ();
		
			var bbox   = shape .getBBox () .multBoxMatrix (modelViewMatrix);
			//var depth  = bbox .size .z / 2;
			//var min    = bbox .center .z - depth;
			var distance = bbox .center .z;

			//if (min < 0)
			//{
				//var viewVolume = viewVolumeStack .back ();
			
				//if (viewVolume .intersects (bbox))
				//{
					if (shape .isTransparent ())
					{
						if (this .numTransparentShapes >= this .transparentShapes .length)
							this .transparentShapes .push (new ShapeContainer ());

						this .transparentShapes [this .numTransparentShapes] .assign (shape, true, modelViewMatrix, distance);

						++ this .numTransparentShapes;
					}
					else
					{
						if (this .numOpaqueShapes >= this .opaqueShapes .length)
							this .opaqueShapes .push (new ShapeContainer ());

						this .opaqueShapes [this .numOpaqueShapes] .assign (shape, false, modelViewMatrix , distance);

						++ this .numOpaqueShapes;
					}
				//}
			//}
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
				this .opaqueShapes [i] .draw ();

			// Render transparent objects

			gl .depthMask (false);
			gl .enable (gl .BLEND);

			this .transparencySorter .sort (0, this .numTransparentShapes);

			for (var i = 0; i < this .numTransparentShapes; ++ i)
				this .transparentShapes [i] .draw ();

			gl .depthMask (true);
			gl .disable (gl .BLEND);
		},
	};

	return X3DRenderer;
});
