
define ([
	"jquery",
	"cobweb/Components/Core/X3DChildNode",
	"cobweb/Components/Grouping/X3DBoundedObject",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DChildNode, 
          X3DBoundedObject, 
          X3DConstants)
{
	function X3DShapeNode (browser, executionContext)
	{
		X3DChildNode     .call (this, browser, executionContext);
		X3DBoundedObject .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DShapeNode);
	}

	X3DShapeNode .prototype = $.extend (new X3DChildNode (),
		X3DBoundedObject .prototype,
	{
		constructor: X3DShapeNode,
		initialize: function ()
		{
			X3DChildNode     .prototype .initialize .call (this);
			X3DBoundedObject .prototype .initialize .call (this);
		},
		traverse: function (type)
		{
			if (this .geometry_ .getValue ())
				this .geometry_ .getValue () .traverse (type);
		},
	});

	return X3DShapeNode;
});

