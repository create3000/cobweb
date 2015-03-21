
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
	function X3DTextureTransformNode (browser, executionContext)
	{
		X3DAppearanceChildNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DTextureTransformNode);

		this .matrix        = new Matrix4 ();
		this .matrix .array = new Float32Array (this .matrix);
	}

	X3DTextureTransformNode .prototype = $.extend (new X3DAppearanceChildNode (),
	{
		constructor: X3DTextureTransformNode,
		setMatrix: function (value)
		{
			this .matrix .assign (value);
			this .matrix .array .set (value);
		},
		getMatrix: function ()
		{
			return this .matrix;
		},
		traverse: function ()
		{
			this .getBrowser () .getTextureTransform () [0] = this;
		},
	});

	return X3DTextureTransformNode;
});

