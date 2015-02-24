
define ([
	"cobweb/Components/Layering/Viewport",
],
function (Viewport)
{
	function X3DLayeringContext ()
	{
		this .defaultViewport = new Viewport (this);
		this .layers          = [ ];
	}

	X3DLayeringContext .prototype =
	{
		initialize: function ()
		{
			this .defaultViewport .setup ();
		},
		getDefaultViewport: function ()
		{
			return this .defaultViewport;
		},
		getLayers: function ()
		{
			return this .layers;
		},
	};

	return X3DLayeringContext;
});
