
define ([
	"jquery",
	"cobweb/Components/Rendering/X3DGeometryNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Matrix4",
],
function ($,
          X3DGeometryNode,
          X3DConstants,
          Matrix4)
{
"use strict";

	function X3DLineGeometryNode (executionContext)
	{
		X3DGeometryNode .call (this, executionContext);

		//this .addType (X3DConstants .X3DLineGeometryNode);

		this .shader = this .getBrowser () .getLineShader ();
	}

	X3DLineGeometryNode .prototype = $.extend (Object .create (X3DGeometryNode .prototype),
	{
		constructor: X3DLineGeometryNode,
		isLineGeometry: function ()
		{
			return true;
		},
		setShader: function (value)
		{
			this .shader = value;
		},
		display: function (context)
		{
			var
				browser = this .getBrowser (),
				gl      = browser .getContext (),
				shader  = browser .getShader ();

			if (shader === browser .getDefaultShader ())
				shader = this .shader;

			if (shader .vertex < 0 || this .vertexCount === 0)
				return;

			// Setup shader.

			context .colorMaterial = this .colors .length;
			shader .setLocalUniforms (context);

			// Setup vertex attributes.

			if (this .colors .length && shader .color >= 0)
			{
				gl .enableVertexAttribArray (shader .color);
				gl .bindBuffer (gl .ARRAY_BUFFER, this .colorBuffer);
				gl .vertexAttribPointer (shader .color, 4, gl .FLOAT, false, 0, 0);
			}

			gl .enableVertexAttribArray (shader .vertex);
			gl .bindBuffer (gl .ARRAY_BUFFER, this .vertexBuffer);
			gl .vertexAttribPointer (shader .vertex, 4, gl .FLOAT, false, 0, 0);

			// Wireframes are always solid so only one drawing call is needed.

			gl .drawArrays (shader .primitiveMode === gl .POINTS ? gl .POINTS : this .primitiveMode, 0, this .vertexCount);

			if (shader .color >= 0) gl .disableVertexAttribArray (shader .color);
			gl .disableVertexAttribArray (shader .vertex);
		},
		displayParticles: function (context, particles, numParticles)
		{
			var
				browser = this .getBrowser (),
				gl      = browser .getContext (),
				shader  = browser .getShader ();

			if (shader === browser .getDefaultShader ())
				shader = this .shader;

			if (shader .vertex < 0 || this .vertexCount === 0)
				return;

			// Setup shader.

			context .colorMaterial = this .colors .length;
			shader .setLocalUniforms (context);

			// Setup vertex attributes.

			if (this .colors .length && shader .color >= 0)
			{
				gl .enableVertexAttribArray (shader .color);
				gl .bindBuffer (gl .ARRAY_BUFFER, this .colorBuffer);
				gl .vertexAttribPointer (shader .color, 4, gl .FLOAT, false, 0, 0);
			}

			gl .enableVertexAttribArray (shader .vertex);
			gl .bindBuffer (gl .ARRAY_BUFFER, this .vertexBuffer);
			gl .vertexAttribPointer (shader .vertex, 4, gl .FLOAT, false, 0, 0);

			// Wireframes are always solid so only one drawing call is needed.

			var
				modelViewMatrix = context .modelViewMatrix,
				x               = modelViewMatrix [12],
				y               = modelViewMatrix [13],
				z               = modelViewMatrix [14],
				primitiveMode   = shader .primitiveMode === gl .POINTS ? gl .POINTS : this .primitiveMode;

			for (var p = 0; p < numParticles; ++ p)
			{
				modelViewMatrix [12] = x;
				modelViewMatrix [13] = y;
				modelViewMatrix [14] = z;

				Matrix4 .prototype .translate .call (modelViewMatrix, particles [p] .position);

				gl .uniformMatrix4fv (shader .modelViewMatrix, false, modelViewMatrix);
	
				gl .drawArrays (primitiveMode, 0, this .vertexCount);
			}

			if (shader .color >= 0) gl .disableVertexAttribArray (shader .color);
			gl .disableVertexAttribArray (shader .vertex);
		},
	});

	return X3DLineGeometryNode;
});


