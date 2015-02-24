
define ([
	"jquery",
	"cobweb/Components/Core/X3DNode",
	"cobweb/Components/Layering/X3DViewportNode",
	"cobweb/Components/Navigation/NavigationInfo",
	"cobweb/Components/Navigation/Viewpoint",
	"cobweb/Bits/TraverseType",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Matrix4",
	"cobweb/Bits/x3d_cast",
],
function ($,
          X3DNode,
          X3DViewportNode,
          NavigationInfo,
          Viewpoint,
          TraverseType,
          X3DConstants,
          Matrix4,
          x3d_cast)
{
	function X3DLayerNode (browser, executionContext, defaultViewpoint, group)
	{
		X3DNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DLayerNode);
	}

	X3DLayerNode .prototype = $.extend (new X3DNode (),
	{
		constructor: X3DLayerNode,
		layer0: false,
		initialize: function ()
		{
			X3DNode .prototype .initialize .call (this);
		
			this .defaultNavigationInfo  = new NavigationInfo (this .getExecutionContext ());
			this .defaultViewpoint       = new Viewpoint (this .getExecutionContext ());
			
			this .currentViewport     = null;
			this .navigationInfoStack = [ this .defaultNavigationInfo ];
			this .viewpointStack      = [ this .defaultViewpoint ];

			this .defaultNavigationInfo .setup ();
			this .defaultViewpoint .setup ();

			this .viewport_ .addInterest (this, "set_viewport__");

			this .set_viewport__ ();
		},
		isLayer0: function (value)
		{
			this .layer0 = value;
		},
		getViewport: function ()
		{
			return this .currentViewport;
		},
		getNavigationInfo: function ()
		{
			return this .navigationInfoStack [0];
		},
		getViewpoint: function ()
		{
			return this .viewpointStack [0];
		},
		set_viewport__: function ()
		{
			this .currentViewport = x3d_cast (X3DViewportNode, this .viewport_);

			if (! this .currentViewport)
				this .currentViewport = this .getBrowser () .getDefaultViewport ();
		},
		bind: function ()
		{
			this .defaultViewpoint .isBound_ = true;
		},
		traverse: function (type)
		{
			this .getBrowser () .getLayers () .unshift (this);

			switch (type)
			{
				case TraverseType .POINTER:
					this .pointer ();
					break;
				case TraverseType .CAMERA:
					this .camera ();
					break;
				case TraverseType .NAVIGATION:
					this .navigation ();
					break;
				case TraverseType .COLLISION:
					this .collision ();
					break;
				case TraverseType .DISPLAY:
					this .display ();
					break;
			}

			this .getBrowser () .getLayers () .shift ();
		},
		pointer: function ()
		{
		
		},
		camera: function ()
		{
			this .getBrowser () .getModelViewMatrix () .identity ();
			this .getViewpoint () .reshape ();
		
			this .defaultNavigationInfo .traverse (TraverseType .CAMERA);
			this .defaultViewpoint .traverse (TraverseType .CAMERA);
			
			this .currentViewport .push (TraverseType .CAMERA);

			this .collect (TraverseType .CAMERA);

			this .currentViewport .pop (TraverseType .CAMERA);
		},
		navigation: function ()
		{
		
		},
		collision: function ()
		{
		
		},
		display: function (type)
		{
			var gl = this .getBrowser () .getContext ();
		
			gl .clear (gl .DEPTH_BUFFER_BIT);

			this .getBrowser () .getModelViewMatrix () .identity ();

			this .getNavigationInfo () .enable ();
			this .getViewpoint () .reshape ();
			this .getViewpoint () .transform ();

			this .currentViewport .push (TraverseType .DISPLAY);
			this .collect (TraverseType .DISPLAY);
			this .currentViewport .pop (TraverseType .DISPLAY);
			
			this .getNavigationInfo () .disable ();
		},
		collect: function (type)
		{
			for (var i = 0; i < this .children_ .length; ++ i)
				this .children_ [i] .getValue () .traverse (TraverseType .DISPLAY);	
		},
	});

	return X3DLayerNode;
});

