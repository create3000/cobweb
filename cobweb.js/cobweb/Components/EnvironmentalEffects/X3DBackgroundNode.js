
define ([
	"jquery",
	"cobweb/Components/Core/X3DBindableNode",
	"cobweb/Bits/TraverseType",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Complex",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Rotation4",
	"standard/Math/Numbers/Matrix4",
	"standard/Math/Algorithm",
	"standard/Math/Geometry/Camera",
],
function ($,
          X3DBindableNode,
          TraverseType,
          X3DConstants,
          Complex,
          Vector3,
          Rotation4,
          Matrix4,
          Algorithm,
          Camera)
{
"use strict";

	var
		SIZE        = 10000,
		U_DIMENSION = 20;
	
	var s = Math .sqrt (Math .pow (2 * SIZE, 2) / 2) / 2;

	var texCoords = [
		1, 1, 0, 1,
		0, 1, 0, 1,
		0, 0, 0, 1,
		1, 1, 0, 1,
		0, 0, 0, 1,
		1, 0, 0, 1,
	];

	var frontVertices = [
		 s,  s, -s, 1,
		-s,  s, -s, 1,
		-s, -s, -s, 1,
		 s,  s, -s, 1,
		-s, -s, -s, 1,
		 s, -s, -s, 1,
	];

	var backVertices = [
		-s,  s,  s, 1,
		 s,  s,  s, 1,
		 s, -s,  s, 1,
		-s,  s,  s, 1,
		 s, -s,  s, 1,
		-s, -s,  s, 1,
	];

	var leftVertices = [
		-s,  s, -s, 1,
		-s,  s,  s, 1,
		-s, -s,  s, 1,
		-s,  s, -s, 1,
		-s, -s,  s, 1,
		-s, -s, -s, 1,
	];

	var rightVertices = [
		s,  s,  s, 1,
		s,  s, -s, 1,
		s, -s, -s, 1,
		s,  s,  s, 1,
		s, -s, -s, 1,
		s, -s,  s, 1,
	];

	var topVertices = [
		 s, s,  s, 1,
		-s, s,  s, 1,
		-s, s, -s, 1,
		 s, s,  s, 1,
		-s, s, -s, 1,
		 s, s, -s, 1,
	];

	var bottomVertices = [
		 s, -s, -s, 1,
		-s, -s, -s, 1,
		-s, -s,  s, 1,
		 s, -s, -s, 1,
		-s, -s,  s, 1,
		 s, -s,  s, 1,
	];

	var
		z1 = new Complex (0, 0),
		z2 = new Complex (0, 0),
		y1 = new Complex (0, 0),
		y2 = new Complex (0, 0),
		y3 = new Complex (0, 0),
		y4 = new Complex (0, 0);

	var identity = new Matrix4 ();

	function X3DBackgroundNode (browser, executionContext)
	{
		X3DBindableNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DBackgroundNode);

		this .hidden                = false;
		this .projectionMatrixArray = new Float32Array (16);
		this .transformationMatrix  = new Matrix4 ();
		this .modelViewMatrixArray  = new Float32Array (16);
		this .clipPlanes            = [ ];
		this .colors                = [ ];
		this .sphere                = [ ];
		this .textures              = 0;
	}

	X3DBackgroundNode .prototype = $.extend (Object .create (X3DBindableNode .prototype),
	{
		constructor: X3DBackgroundNode,
		rotation: new Rotation4 (),
		textureMatrixArray: new Float32Array (new Matrix4 ()),
		rectangleCount: 6,
		initialize: function ()
		{
			X3DBindableNode .prototype .initialize .call (this);

			var gl = this .getBrowser () .getContext ();

			this .colorBuffer     = gl .createBuffer ();
			this .sphereBuffer    = gl .createBuffer ();
			this .texCoordBuffer  = gl .createBuffer ();
			this .cubeBuffer      = gl .createBuffer ();
			this .texCoordsBuffer = gl .createBuffer ();
			this .frontBuffer     = gl .createBuffer ();
			this .backBuffer      = gl .createBuffer ();
			this .leftBuffer      = gl .createBuffer ();
			this .rightBuffer     = gl .createBuffer ();
			this .topBuffer       = gl .createBuffer ();
			this .bottomBuffer    = gl .createBuffer ();

			this .groundAngle_  .addInterest (this, "build");
			this .groundColor_  .addInterest (this, "build");
			this .skyAngle_     .addInterest (this, "build");
			this .skyColor_     .addInterest (this, "build");
			this .transparency_ .addInterest (this, "build");

			this .build ();
			this .transferRectangle ();
		},
		set_frontTexture__: function (value)
		{
			this .setTexture ("frontTexture", value, 0);
		},
		set_backTexture__: function (value)
		{
			this .setTexture ("backTexture", value, 1);
		},
		set_leftTexture__: function (value)
		{
			this .setTexture ("leftTexture", value, 2);
		},
		set_rightTexture__: function (value)
		{
			this .setTexture ("rightTexture", value, 3);
		},
		set_topTexture__: function (value)
		{
			this .setTexture ("topTexture", value, 4);
		},
		set_bottomTexture__: function (value)
		{
			this .setTexture ("bottomTexture", value, 5);
		},
		setTexture: function (key, texture, bit)
		{
			if (this [key])
				this [key] .loadState_ .removeInterest (this, "setTextureBit");

			this [key] = texture;

			if (texture)
			{
				texture .loadState_ .addInterest (this, "setTextureBit", bit);
				this .setTextureBit (texture .loadState_, bit);
			}
			else
				this .textures &= ~(1 << bit);
		},
		setTextureBit: function (loadState, bit)
		{
			if (loadState .getValue () === X3DConstants .COMPLETE_STATE)
				this .textures |= 1 << bit;
			else
				this .textures &= ~(1 << bit);
		},
		bindToLayer: function (layer)
		{
			X3DBindableNode .prototype .bindToLayer .call (this, layer);

			layer .getBackgroundStack () .push (this);
		},
		unbindFromLayer: function (layer)
		{
			X3DBindableNode .prototype .unbindFromLayer .call (this, layer);

			layer .getBackgroundStack () .pop (this);
		},
		removeFromLayer: function (layer)
		{
			layer .getBackgroundStack () .remove (this);
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
			var index = Algorithm .upperBound (angle, 0, angle .length, theta, Algorithm .less);

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
				var s = SIZE;

				// Build cube

				this .sphere .vertices = 36;

				this .sphere .push ( s,  s, -s, 1, -s,  s, -s, 1, -s, -s, -s, 1, // Back
				                     s,  s, -s, 1, -s, -s, -s, 1,  s, -s, -s, 1,
				                    -s,  s,  s, 1,  s,  s,  s, 1, -s, -s,  s, 1, // Front
				                    -s, -s,  s, 1,  s,  s,  s, 1,  s, -s,  s, 1,
				                    -s,  s, -s, 1, -s,  s,  s, 1, -s, -s,  s, 1, // Left	
				                    -s,  s, -s, 1, -s, -s,  s, 1, -s, -s, -s, 1,
				                    	s,  s,  s, 1,  s,  s, -s, 1,  s, -s,  s, 1, // Right		
				                     s, -s,  s, 1,  s,  s, -s, 1,  s, -s, -s, 1,
				                    	s,  s,  s, 1, -s,  s,  s, 1, -s,  s, -s, 1, // Top		
				                     s,  s,  s, 1, -s,  s, -s, 1,  s,  s, -s, 1,
				                    -s, -s,  s, 1,  s, -s,  s, 1, -s, -s, -s, 1, // Bottom	
				                    -s, -s, -s, 1,  s, -s,  s, 1,  s, -s, -s, 1);

				var c = this .skyColor_ [0];

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
					
					for (var i = 0, length = this .skyAngle_ .length; i < length; ++ i)
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
					
					for (var i = 0, length = this .groundAngle_ .length; i < length; ++ i)
						vAngle .push (this .groundAngle_ [i]);

					vAngle .reverse ();

					if (vAngle .length === 0 || vAngle [0] < Math .PI / 2)
						vAngle .unshift (Math .PI / 2);

					if (vAngle [vAngle .length - 1] > 0)
						vAngle .push (0);

					this .buildSphere (radius, vAngle, this .groundAngle_, this .groundColor_, alpha, true);
				}
			}

			this .transferSphere ();
		},
		buildSphere: function (radius, vAngle, angle, color, alpha, bottom)
		{
			var
				phi         = 0,
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

				z1 .setPolar (radius, theta1);
				z2 .setPolar (radius, theta2);
				
				var
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
					y1  .setPolar (-z1 .imag, phi);
					y2  .setPolar (-z2 .imag, phi);

					// p3, p4
					phi = 2 * Math .PI * (u1 / U_DIMENSION);
					y3  .setPolar (-z2 .imag, phi);
					y4  .setPolar (-z1 .imag, phi);
					
					// Triangle 1 and 2

					this .colors .push (c1 .r, c1 .g, c1 .b, alpha,
					                    c2 .r, c2 .g, c2 .b, alpha,
					                    c2 .r, c2 .g, c2 .b, alpha,
					                    // Triangle 2
					                    c1 .r, c1 .g, c1 .b, alpha,
					                    c1 .r, c1 .g, c1 .b, alpha,
					                    c2 .r, c2 .g, c2 .b, alpha);

					this .sphere .push (y1 .imag, z1 .real, y1 .real, 1,
					                    y3 .imag, z2 .real, y3 .real, 1,
					                    y2 .imag, z2 .real, y2 .real, 1,
					                    // Triangle 2
					                    y1 .imag, z1 .real, y1 .real, 1,
					                    y4 .imag, z1 .real, y4 .real, 1,
					                    y3 .imag, z2 .real, y3 .real, 1);	
				}
			}
		},
		transferSphere: function ()
		{
			var gl = this .getBrowser () .getContext ();

			// Transfer colors.

			gl .bindBuffer (gl .ARRAY_BUFFER, this .colorBuffer);
			gl .bufferData (gl .ARRAY_BUFFER, new Float32Array (this .colors), gl .STATIC_DRAW);

			// Transfer sphere.

			gl .bindBuffer (gl .ARRAY_BUFFER, this .sphereBuffer);
			gl .bufferData (gl .ARRAY_BUFFER, new Float32Array (this .sphere), gl .STATIC_DRAW);
			this .sphereCount = this .sphere .length / 4;
		},
		transferRectangle: function ()
		{
			var gl = this .getBrowser () .getContext ();

			// Transfer texCoords.

			gl .bindBuffer (gl .ARRAY_BUFFER, this .texCoordsBuffer);
			gl .bufferData (gl .ARRAY_BUFFER, new Float32Array (texCoords), gl .STATIC_DRAW);

			// Transfer rectangle.

			gl .bindBuffer (gl .ARRAY_BUFFER, this .frontBuffer);
			gl .bufferData (gl .ARRAY_BUFFER, new Float32Array (frontVertices), gl .STATIC_DRAW);

			gl .bindBuffer (gl .ARRAY_BUFFER, this .backBuffer);
			gl .bufferData (gl .ARRAY_BUFFER, new Float32Array (backVertices), gl .STATIC_DRAW);

			gl .bindBuffer (gl .ARRAY_BUFFER, this .leftBuffer);
			gl .bufferData (gl .ARRAY_BUFFER, new Float32Array (leftVertices), gl .STATIC_DRAW);

			gl .bindBuffer (gl .ARRAY_BUFFER, this .rightBuffer);
			gl .bufferData (gl .ARRAY_BUFFER, new Float32Array (rightVertices), gl .STATIC_DRAW);

			gl .bindBuffer (gl .ARRAY_BUFFER, this .topBuffer);
			gl .bufferData (gl .ARRAY_BUFFER, new Float32Array (topVertices), gl .STATIC_DRAW);

			gl .bindBuffer (gl .ARRAY_BUFFER, this .bottomBuffer);
			gl .bufferData (gl .ARRAY_BUFFER, new Float32Array (bottomVertices), gl .STATIC_DRAW);
		},
		traverse: function (type)
		{
			switch (type)
			{
				case TraverseType .CAMERA:
				{
					this .getCurrentLayer () .getBackgrounds () .push (this);
		
					this .transformationMatrix .assign (this .getBrowser () .getModelViewMatrix () .get ());
					break;
				}
				case TraverseType .DISPLAY:
				{
					var
						sourcePlanes = this .getCurrentLayer () .getClipPlanes (),
						destPlanes   = this .clipPlanes;
	
					for (var i = 0, length = sourcePlanes .length; i < length; ++ i)
						destPlanes [i] = sourcePlanes [i];
					
					destPlanes .length = sourcePlanes .length;
					break;
				}
			}
		},
		draw: function (viewport)
		{
			if (this .hidden)
				return;

			var
				browser = this .getBrowser (),
				gl      = browser .getContext ();

			// Setup context.
	
			gl .disable (gl .DEPTH_TEST);
			gl .depthMask (false);
			gl .enable (gl .CULL_FACE);
			gl .frontFace (gl .CCW);

			// Get background scale.

			var
				viewpoint       = this .getCurrentViewpoint (),
				scale           = viewpoint .getScreenScale (SIZE, viewport),
				rotation        = this .rotation,
				modelViewMatrix = this .transformationMatrix;

			scale .multiply (Math .max (viewport [2], viewport [3]));

			// Get projection matrix.

			this .projectionMatrixArray .set (viewpoint .getProjectionMatrix (1, Math .max (2, 3 * SIZE * scale .z), viewport));	

			// Rotate and scale background.

			modelViewMatrix .multLeft (viewpoint .getInverseCameraSpaceMatrix ());
			modelViewMatrix .get (null, rotation);
			modelViewMatrix .identity ();
			modelViewMatrix .scale (scale);
			modelViewMatrix .rotate (rotation);

			this .modelViewMatrixArray .set (modelViewMatrix);
		
			// Draw.

			this .drawSphere ();

			if (this .textures)
				this .drawCube ();
		},
		drawSphere: function ()
		{
			var transparency = this .transparency_ .getValue ();
		
			if (transparency >= 1)
				return;
	
			var
				browser    = this .getBrowser (),
				gl         = browser .getContext (),
				shader     = browser .getBackgroundSphereShader (),
				clipPlanes = this .clipPlanes;

			shader .use ();

			// Clip planes

			for (var i = 0, numClipPlanes = Math .min (shader .maxClipPlanes, clipPlanes .length); i < numClipPlanes; ++ i)
				clipPlanes [i] .use (gl, shader, i);

			if (i < shader .numClipPlanes)
				gl .uniform1i (shader .clipPlaneEnabled [i], false);

			shader .numClipPlanes = i;

			// Uniforms

			gl .uniformMatrix4fv (shader .projectionMatrix, false, this .projectionMatrixArray);
			gl .uniformMatrix4fv (shader .modelViewMatrix,  false, this .modelViewMatrixArray);

			// Setup context.
	
			if (transparency)
				gl .enable (gl .BLEND);
			else
				gl .disable (gl .BLEND);

			// Enable vertex attribute arrays.

			gl .enableVertexAttribArray (shader .color);
			gl .bindBuffer (gl .ARRAY_BUFFER, this .colorBuffer);
			gl .vertexAttribPointer (shader .color, 4, gl .FLOAT, false, 0, 0);

			gl .enableVertexAttribArray (shader .vertex);
			gl .bindBuffer (gl .ARRAY_BUFFER, this .sphereBuffer);
			gl .vertexAttribPointer (shader .vertex, 4, gl .FLOAT, false, 0, 0);

			// Draw.

			gl .drawArrays (gl .TRIANGLES, 0, this .sphereCount);

			// Disable vertex attribute arrays.

			gl .disableVertexAttribArray (shader .color);
			gl .disableVertexAttribArray (shader .vertex);
		},
		drawCube: function ()
		{
			var
				browser    = this .getBrowser (),
				gl         = browser .getContext (),
				shader     = browser .getGouraudShader (),
				clipPlanes = this .clipPlanes;

			shader .use ();

			// Clip planes

			for (var i = 0, numClipPlanes = Math .min (shader .maxClipPlanes, clipPlanes .length); i < numClipPlanes; ++ i)
				clipPlanes [i] .use (gl, shader, i);

			if (i < shader .numClipPlanes)
				gl .uniform1i (shader .clipPlaneEnabled [i], false);

			shader .numClipPlanes = i;

			// Uniforms

			gl .uniform1i (shader .fogType,       0);
			gl .uniform1i (shader .colorMaterial, false);
			gl .uniform1i (shader .lighting,      false);
			gl .uniform1i (shader .texturing,     true);

			gl .uniformMatrix4fv (shader .textureMatrix,    false, this .textureMatrixArray);
			gl .uniformMatrix4fv (shader .projectionMatrix, false, this .projectionMatrixArray);
			gl .uniformMatrix4fv (shader .modelViewMatrix,  false, this .modelViewMatrixArray);

			// Enable vertex attribute arrays.

			gl .enableVertexAttribArray (shader .texCoord);
			gl .bindBuffer (gl .ARRAY_BUFFER, this .texCoordsBuffer);
			gl .vertexAttribPointer (shader .texCoord, 4, gl .FLOAT, false, 0, 0);

			gl .enableVertexAttribArray (shader .vertex);

			// Draw.

			this .drawRectangle (gl, shader, this .frontTexture,  this .frontBuffer);
			this .drawRectangle (gl, shader, this .backTexture,   this .backBuffer);
			this .drawRectangle (gl, shader, this .leftTexture,   this .leftBuffer);
			this .drawRectangle (gl, shader, this .rightTexture,  this .rightBuffer);
			this .drawRectangle (gl, shader, this .topTexture,    this .topBuffer);
			this .drawRectangle (gl, shader, this .bottomTexture, this .bottomBuffer);

			// Disable vertex attribute arrays.

			gl .disableVertexAttribArray (shader .texCoord);
			gl .disableVertexAttribArray (shader .vertex);
		},
		drawRectangle: function (gl, shader, texture, buffer)
		{
			if (texture && texture .checkLoadState () === X3DConstants .COMPLETE_STATE)
			{
				texture .traverse ();

				if (texture .transparent_ .getValue ())
					gl .enable (gl .BLEND);
				else
					gl .disable (gl .BLEND);

				gl .bindBuffer (gl .ARRAY_BUFFER, buffer);
				gl .vertexAttribPointer (shader .vertex, 4, gl .FLOAT, false, 0, 0);

				// Draw.

				gl .drawArrays (gl .TRIANGLES, 0, this .rectangleCount);
			}
		},
	});

	return X3DBackgroundNode;
});


