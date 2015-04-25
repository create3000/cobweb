
define ([
	"jquery",
	"cobweb/Components/Core/X3DChildNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DChildNode, 
          X3DConstants)
{
	function X3DBindableNode (browser, executionContext)
	{
		X3DChildNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DBindableNode);

		this .layers = { };
	}

	X3DBindableNode .prototype = $.extend (Object .create (X3DChildNode .prototype),
	{
		constructor: X3DBindableNode,
		initialize: function ()
		{
			X3DChildNode .prototype .initialize .call (this);
			
			this .setCameraObject (true);

			this .getExecutionContext () .isLive () .addInterest (this, "set_live__");
			this .isLive () .addInterest (this, "set_live__");

			this .set_live__ ();
		},
		set_live__: function ()
		{
			if (this .getExecutionContext () .isLive () .getValue () && this .isLive () .getValue ())
				return;

			for (var id in this .layers)
				this .removeFromLayer (this .layers [id]);
		},
		getLayers: function ()
		{
			return this .layers;
		},
		bindToLayer: function (layer)
		{
			this .layers [layer .getId ()] = layer;
		},
		unbindFromLayer: function (layer)
		{
			delete this .layers [layer .getId ()];
		},
		transitionStart: function () { },
	});

	return X3DBindableNode;
});

