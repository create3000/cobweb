
define ([
	"jquery",
	"cobweb/Components/Core/X3DBindableNode",
	"cobweb/Bits/TraverseType",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Complex",
	"standard/Math/Numbers/Rotation4",
	"standard/Math/Numbers/Matrix4",
	"standard/Math/Algorithm",
],
function ($,
          X3DBindableNode,
          TraverseType,
          X3DConstants,
          Complex,
          Rotation4,
          Matrix4,
          Algorithm)
{
	var
		SIZE        = 10000,
		U_DIMENSION = 20;

	function X3DBackgroundNode (browser, executionContext)
	{
		X3DBindableNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DBackgroundNode);
		
		this .hidden = false;
		this .matrix = new Matrix4 ();
		this .colors = [ ];
		this .sphere = [ ];
	}

	X3DBackgroundNode .prototype = $.extend (new X3DBindableNode (),
	{
		constructor: X3DBackgroundNode,
		initialize: function ()
		{
			X3DBindableNode .prototype .initialize .call (this);

			var gl = this .getBrowser () .getContext ();

			this .colorBuffer    = gl .createBuffer ();
			this .sphereBuffer   = gl .createBuffer ();
			this .texCoordBuffer = gl .createBuffer ();
			this .cubeBuffer     = gl .createBuffer ();
			
			this .addInterest (this, "build");

			this .build ();
		},
		bindToLayer (layer)
		{
			layer .getBackgroundStack () .push (this);
		},
		unbindFromLayer (layer)
		{
			layer .getBackgroundStack () .pop (this);
		},
		setHidden: function (value)
		{
			this .hidden = value;

			this .getBrowser () .addBrowserEvent ();
		},
		getHidden: function ()
		{
			return this .hidden;
		},
		getColor: function (theta, color, angle)
		{
			var index = Algorithm .upperBound (angle, 0, angle .length, theta);

			return color [index];
		},
		build: function ()
		{
			this .colors .length = 0;
			this .sphere .length = 0;

			if (this .transparency_ .getValue () >= 1)
				return;

			var alpha = 1 - Algorithm .clamp (this .transparency_ .getValue (), 0, 1);

			if (this .groundColor_ .length === 0 && this .skyColor_ .length == 1)
			{
				// Build cube

				var
					r = SIZE,
					c = this .skyColor_ [0];

				// Back
				this .sphere .push ( r,  r, -r, 1, -r,  r, -r, 1, -r, -r, -r, 1);
				this .sphere .push ( r,  r, -r, 1, -r, -r, -r, 1,  r, -r, -r, 1);
				// Front
				this .sphere .push (-r,  r,  r, 1,  r,  r,  r, 1, -r, -r,  r, 1);
				this .sphere .push (-r, -r,  r, 1,  r,  r,  r, 1,  r, -r,  r, 1);
				// Left
				this .sphere .push (-r,  r, -r, 1, -r,  r,  r, 1, -r, -r,  r, 1);
				this .sphere .push (-r,  r, -r, 1, -r, -r,  r, 1, -r, -r, -r, 1);
				// Right
				this .sphere .push ( r,  r,  r, 1,  r,  r, -r, 1,  r, -r,  r, 1);
				this .sphere .push ( r, -r,  r, 1,  r,  r, -r, 1,  r, -r, -r, 1);
				// Top
				this .sphere .push ( r,  r,  r, 1, -r,  r,  r, 1, -r,  r, -r, 1);
				this .sphere .push ( r,  r,  r, 1, -r,  r, -r, 1,  r,  r, -r, 1);
				// Bottom
				this .sphere .push ( -r, -r,  r, 1, r, -r,  r, 1, -r, -r, -r, 1);
				this .sphere .push ( -r, -r, -r, 1, r, -r,  r, 1,  r, -r, -r, 1);
				this .sphere .vertices = this .sphere .length / 4;

				for (var i = 0, vertices = this .sphere .vertices; i < vertices; ++ i)
					this .colors .push (c .r, c .g, c .b, alpha);
			}
			else
			{
				// Build sphere

				var radius = Math .sqrt (2 * Math .pow (SIZE, 2));
			
				if (this .skyColor_ .length > this .skyAngle_ .length)
				{
					var vAngle = [ ];
					
					for (var i = 0; i < this .skyAngle_ .length; ++ i)
						vAngle .push (this .skyAngle_ [i]);

					if (vAngle .length === 0 || vAngle [0] > 0)
						vAngle .unshift (0);

					var vAngleMax = this .groundColor_ .length > this .groundAngle_ .length ? Math .PI / 2 : Math .PI;

					if (vAngle [vAngle .length - 1] < vAngleMax)
						vAngle .push (vAngleMax);

					this .buildSphere (radius, vAngle, this .skyAngle_, this .skyColor_, alpha, false);
				}

				if (this .groundColor_ .length > this .groundAngle_ .length)
				{
					var vAngle = [ ];
					
					for (var i = 0; i < this .groundAngle_ .length; ++ i)
						vAngle .push (this .groundAngle_ [i]);

					vAngle .reverse ();

					if (vAngle .length === 0 || vAngle [0] < Math .PI / 2)
						vAngle .unshift (Math .PI / 2);

					if (vAngle [vAngle .length - 1] > 0)
						vAngle .push (0);

					this .buildSphere (radius, vAngle, this .groundAngle_, this .groundColor_, alpha, true);
				}

				this .sphere .vertices = this .sphere .length / 4;
			}

			this .transfer ();
		},
		buildSphere: function (radius, vAngle, angle, color, alpha, bottom)
		{
			var
				phi         = 0,
				y1          = null,
				y2          = null,
				y3          = null,
				y4          = null,
				p           = null,
				vAngleMax   = bottom ? Math .PI / 2 : Math .PI,
				V_DIMENSION = vAngle .length - 1;
			
			for (var v = 0; v < V_DIMENSION; ++ v)
			{
				var
					theta1 = Algorithm .clamp (vAngle [v],     0, vAngleMax),
					theta2 = Algorithm .clamp (vAngle [v + 1], 0, vAngleMax);

				if (bottom)
				{
					theta1 = Math .PI - theta1;
					theta2 = Math .PI - theta2;
				}

				var
					z1 = Complex .Polar (radius, theta1),
					z2 = Complex .Polar (radius, theta2),
					c1 = this .getColor (vAngle [v],     color, angle),
					c2 = this .getColor (vAngle [v + 1], color, angle);
				
				for (var u = 0; u < U_DIMENSION; ++ u)
				{
					// p4 --- p1
					//  |   / |
					//  | /   |
					// p3 --- p2

					// The last point is the first one.
					var u1 = u < U_DIMENSION - 1 ? u + 1 : 0;
			
					// p1, p2
					phi = 2 * Math .PI * (u / U_DIMENSION);
					y1  = Complex .Polar (-z1 .imag, phi);
					y2  = Complex .Polar (-z2 .imag, phi);

					// p3, p4
					phi = 2 * Math .PI * (u1 / U_DIMENSION);
					y3  = Complex .Polar (-z2 .imag, phi);
					y4  = Complex .Polar (-z1 .imag, phi);
					
					// Triangle 1
					this .colors .push (c1 .r, c1 .g, c1 .b, alpha);
					this .colors .push (c2 .r, c2 .g, c2 .b, alpha);
					this .colors .push (c2 .r, c2 .g, c2 .b, alpha);

					this .sphere .push (y1 .imag, z1 .real, y1 .real, 1);
					this .sphere .push (y3 .imag, z2 .real, y3 .real, 1);	
					this .sphere .push (y2 .imag, z2 .real, y2 .real, 1);

					// Triangle 2
					this .colors .push (c1 .r, c1 .g, c1 .b, alpha);
					this .colors .push (c1 .r, c1 .g, c1 .b, alpha);
					this .colors .push (c2 .r, c2 .g, c2 .b, alpha);

					this .sphere .push (y1 .imag, z1 .real, y1 .real, 1);
					this .sphere .push (y4 .imag, z1 .real, y4 .real, 1);	
					this .sphere .push (y3 .imag, z2 .real, y3 .real, 1);	
				}
			}
		},
		transfer: function ()
		{
			var gl = this .getBrowser () .getContext ();

			// Transfer colors.

			gl .bindBuffer (gl .ARRAY_BUFFER, this .colorBuffer);
			gl .bufferData (gl .ARRAY_BUFFER, new Float32Array (this .colors), gl .STATIC_DRAW);

			// Transfer sphere.

			gl .bindBuffer (gl .ARRAY_BUFFER, this .sphereBuffer);
			gl .bufferData (gl .ARRAY_BUFFER, new Float32Array (this .sphere), gl .STATIC_DRAW);
		},
		traverse: function (type)
		{
			switch (type)
			{
				case TraverseType .CAMERA:
				{
					this .getCurrentLayer () .getBackgrounds () .push (this);
					break;
				}
				case TraverseType .DISPLAY:
				{
					this .matrix = this .getBrowser () .getModelViewMatrix () .get () .copy ();
					break;
				}
			}
		},
		draw: function ()
		{
			if (this .hidden)
				return;

			// Get background scale

			var viewport = this .getBrowser () .getViewport ();
			var scale    = this .getCurrentViewpoint () .getScreenScale (SIZE, viewport);

			scale .multiply (Math .max (viewport [2], viewport [3]));

			this .getCurrentViewpoint () .reshapeWithLimits (1, Math .max (2, 3 * SIZE * scale .z));

			// Rotate and scale background

			var rotation = new Rotation4 ();

			this .matrix .get (null, rotation);

			var modelViewMatrix = new Matrix4 ();
			modelViewMatrix .scale (scale);
			modelViewMatrix .rotate (rotation);

			this .drawSphere (modelViewMatrix);
		},
		drawSphere: function (modelViewMatrix)
		{
			if (this .transparency_ .getValue () >= 1)
				return;

			var browser = this .getBrowser ();
			var gl      = browser .getContext ();

			// Setup context.
	
			gl .disable (gl .DEPTH_TEST);
			gl .depthMask (false);

			if (this .transparency_ .getValue ())
				gl .enable (gl .BLEND);

			// Shader

			var shader = browser .getBackgroundSphereShader ();

			shader .use ();
				
			gl .uniformMatrix4fv (shader .projectionMatrix, false, browser .getProjectionMatrix () .array);
			gl .uniformMatrix4fv (shader .modelViewMatrix,  false, new Float32Array (modelViewMatrix));

			// Enable attribute arrays.

			var vertexAttribArray = 0;

			if (shader .color >= 0)
			{
				gl .enableVertexAttribArray (vertexAttribArray ++);
				gl .bindBuffer (gl .ARRAY_BUFFER, this .colors .length ? this .colorBuffer : browser .getDefaultColorBuffer ());
				gl .vertexAttribPointer (shader .color, 4, gl .FLOAT, false, 0, 0);
			}

			if (shader .position >= 0)
			{
				gl .enableVertexAttribArray (vertexAttribArray ++);
				gl .bindBuffer (gl .ARRAY_BUFFER, this .sphereBuffer);
				gl .vertexAttribPointer (shader .position, 4, gl .FLOAT, false, 0, 0);
			}

			// Draw.

			gl .enable (gl .CULL_FACE);
			gl .frontFace (gl .CCW);
			gl .drawArrays (gl .TRIANGLES, 0, this .sphere .vertices);

			// Disable attribute arrays.

			for (var i = 0; i < vertexAttribArray; ++ i)
				gl .disableVertexAttribArray (i);
		},
	});

	return X3DBackgroundNode;
});

