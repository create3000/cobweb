
define ([
	"jquery",
	"cobweb/Components/Core/X3DNode",
	"cobweb/Bits/X3DConstants",
],
function ($, X3DNode, X3DConstants)
{
	function X3DGeometryNode (browser, executionContext)
	{
		X3DNode .call (this, browser, executionContext);

		this .normals  = [ ];
		this .vertices = [ ];

		this .addType (X3DConstants .X3DGeometryNode);
	}

	X3DGeometryNode .prototype = $.extend (new X3DNode (),
	{
		constructor: X3DGeometryNode,
		setup: function ()
		{
			X3DNode .prototype .setup .call (this);

			this .update ();
		},
		initialize: function ()
		{
			X3DNode .prototype .initialize .call (this);

			var gl = this .getBrowser () .getContext ();

			this .normalBuffer = gl .createBuffer ();
			this .vertexBuffer = gl .createBuffer ();
		},
		addNormal: function (normal)
		{
			this .normals .push (normal .x);
			this .normals .push (normal .y);
			this .normals .push (normal .z);
		},
		addVertex: function (vertex)
		{
			this .vertices .push (vertex .x);
			this .vertices .push (vertex .y);
			this .vertices .push (vertex .z);
			this .vertices .push (1);
		},
		update: function ()
		{
			this .clear ();
			this .build ();
			this .transfer ();
		},
		clear: function ()
		{
			this .normals  .length = 0;
			this .vertices .length = 0;
		},
		transfer: function ()
		{
			var gl = this .getBrowser () .getContext ();

			gl .bindBuffer (gl .ARRAY_BUFFER, this .normalBuffer);
			gl .bufferData (gl .ARRAY_BUFFER, new Float32Array (this .normals), gl .STATIC_DRAW);

			gl .bindBuffer (gl .ARRAY_BUFFER, this .vertexBuffer);
			gl .bufferData (gl .ARRAY_BUFFER, new Float32Array (this .vertices), gl .STATIC_DRAW);
			this .vertices .count = this .vertices .length / 4;
  		},
		traverse: function ()
		{
			var gl = this .getBrowser () .getContext ();

			// Shader

			var shader = this .getBrowser () .getDefaultShader ();

			shader .use ();

			var normalMatrix     = gl .getUniformLocation (shader .program, "normalMatrix");
			var projectionMatrix = gl .getUniformLocation (shader .program, "projectionMatrix");
			var modelViewMatrix  = gl .getUniformLocation (shader .program, "modelViewMatrix");

			if (normalMatrix)
				gl .uniformMatrix3fv (normalMatrix, false, new Float32Array (this .getBrowser () .getModelViewMatrix () .get () .inverse () .transpose () .matrix3 ()));

			if (projectionMatrix)
				gl .uniformMatrix4fv (projectionMatrix, false, new Float32Array (this .getBrowser () .getProjectionMatrix () .get ()));

			if (modelViewMatrix)
				gl .uniformMatrix4fv (modelViewMatrix, false, new Float32Array (this .getBrowser () .getModelViewMatrix () .get ()));

			var normal   = gl .getAttribLocation (shader .program, "normal");
			var position = gl .getAttribLocation (shader .program, "position");

			//

			var vertexAttribArray = 0;

			if (normal >= 0)
			{
				gl .enableVertexAttribArray (vertexAttribArray ++);
				gl .bindBuffer (gl .ARRAY_BUFFER, this .normalBuffer);
				gl .vertexAttribPointer (normal, 3, gl .FLOAT, false, 0, 0);
			}

			if (position >= 0)
			{
				gl .enableVertexAttribArray (vertexAttribArray ++);
				gl .bindBuffer (gl .ARRAY_BUFFER, this .vertexBuffer);
				gl .vertexAttribPointer (position, 4, gl .FLOAT, false, 0, 0);
			}

			if (vertexAttribArray)
				gl .drawArrays (gl .TRIANGLES, 0, this .vertices .count);
		},
	});

	return X3DGeometryNode;
});
