
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
	function X3DGroupingNode (browser, executionContext)
	{
		X3DChildNode     .call (this, browser, executionContext);
		X3DBoundedObject .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DGroupingNode);
	}

	X3DGroupingNode .prototype = $.extend (new X3DChildNode (),
		X3DBoundedObject .prototype,
	{
		constructor: X3DGroupingNode,
		initialize: function ()
		{
			X3DChildNode     .prototype .initialize .call (this);
			X3DBoundedObject .prototype .initialize .call (this);
		},
		isHidden: function (value)
		{
		
		},
		traverse: function (type)
		{
			for (var i = 0; i < this .children_ .length; ++ i)
				this .children_ [i] .getValue () .traverse (type);
		},
	});

	return X3DGroupingNode;
});

