
define ([
	"jquery",
	"cobweb/Components/Rendering/X3DGeometryNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DGeometryNode,
          X3DConstants)
{
"use strict";

	function X3DLineGeometryNode (browser, executionContext)
	{
		X3DGeometryNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DLineGeometryNode);

		this .shader = browser .getLineShader ();
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
		traverse: function (context)
		{
			var
				browser = this .getBrowser (),
				gl      = browser .getContext (),
				shader  = browser .getShader ();

			if (shader === browser .getDefaultShader ())
				shader = this .shader;

			if (shader .vertex < 0)
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
	});

	return X3DLineGeometryNode;
});


