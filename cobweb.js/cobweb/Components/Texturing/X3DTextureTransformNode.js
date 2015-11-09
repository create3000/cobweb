
define ([
	"jquery",
	"cobweb/Components/Shape/X3DAppearanceChildNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Matrix4",
],
function ($,
          X3DAppearanceChildNode, 
          X3DConstants,
          Matrix4)
{
"use strict";

	function X3DTextureTransformNode (browser, executionContext)
	{
		X3DAppearanceChildNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DTextureTransformNode);

		this .matrix      = new Matrix4 ();
		this .matrixArray = new Float32Array (this .matrix);
	}

	X3DTextureTransformNode .prototype = $.extend (Object .create (X3DAppearanceChildNode .prototype),
	{
		constructor: X3DTextureTransformNode,
		setMatrix: function (value)
		{
			this .matrixArray .set (value);
		},
		getMatrix: function ()
		{
			return this .matrix;
		},
		getMatrixArray: function ()
		{
			return this .matrixArray;
		},
		traverse: function ()
		{
			this .getBrowser () .getTextureTransform () [0] = this;
		},
	});

	return X3DTextureTransformNode;
});


