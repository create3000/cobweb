
define ([
	"jquery",
	"cobweb/Components/Core/X3DNode",
	"cobweb/Rendering/X3DRenderer",
	"cobweb/Components/Layering/X3DViewportNode",
	"cobweb/Execution/BindableStack",
	"cobweb/Execution/BindableList",
	"cobweb/Components/Navigation/NavigationInfo",
	"cobweb/Components/EnvironmentalEffects/Fog",
	"cobweb/Components/EnvironmentalEffects/Background",
	"cobweb/Bits/X3DCast",
	"cobweb/Bits/TraverseType",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Geometry/Line3",
	"standard/Math/Numbers/Vector3",
],
function ($,
          X3DNode,
          X3DRenderer,
          X3DViewportNode,
          BindableStack,
          BindableList,
          NavigationInfo,
          Fog,
          Background,
          X3DCast,
          TraverseType,
          X3DConstants,
          Line3,
          Vector3)
{
"use strict";

	var line = new Line3 (new Vector3 (0, 0, 0), new Vector3 (0, 0, 0));

	function X3DLayerNode (browser, executionContext, defaultViewpoint, group)
	{
		X3DNode     .call (this, browser, executionContext);
		X3DRenderer .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DLayerNode);

		this .group           = group;
		this .currentViewport = null;

		this .defaultBackground     = new Background (executionContext);
		this .defaultFog            = new Fog (executionContext);
		this .defaultNavigationInfo = new NavigationInfo (executionContext);
		this .defaultViewpoint      = defaultViewpoint;

		this .backgroundStack     = new BindableStack (this .getExecutionContext (), this, this .defaultBackground);
		this .fogStack            = new BindableStack (this .getExecutionContext (), this, this .defaultFog);
		this .navigationInfoStack = new BindableStack (this .getExecutionContext (), this, this .defaultNavigationInfo);
		this .viewpointStack      = new BindableStack (this .getExecutionContext (), this, this .defaultViewpoint);

		this .backgrounds     = new BindableList (this .getExecutionContext (), this, this .defaultBackground)
		this .fogs            = new BindableList (this .getExecutionContext (), this, this .defaultFog);
		this .navigationInfos = new BindableList (this .getExecutionContext (), this, this .defaultNavigationInfo);
		this .viewpoints      = new BindableList (this .getExecutionContext (), this, this .defaultViewpoint);

		this .defaultBackground .setHidden (true);
		this .defaultFog        .setHidden (true);

		this .hitRay        = line;
		this .collisionTime = 0;
	}

	X3DLayerNode .prototype = $.extend (Object .create (X3DNode .prototype),
		X3DRenderer .prototype,
	{
		constructor: X3DLayerNode,
		layer0: false,
		initialize: function ()
		{
			X3DNode     .prototype .initialize .call (this);
			X3DRenderer .prototype .initialize .call (this);

			this .group .children_ = this .children_;
			this .group .setup ();
			this .collect = this .group .traverse .bind (this .group);

			this .defaultNavigationInfo .setup ();
			this .defaultBackground     .setup ();
			this .defaultFog            .setup ();
			this .defaultViewpoint      .setup ();

			this .backgroundStack     .setup ();
			this .fogStack            .setup ();
			this .navigationInfoStack .setup ();
			this .viewpointStack      .setup ();
	
			this .backgrounds     .setup ();
			this .fogs            .setup ();
			this .navigationInfos .setup ();
			this .viewpoints      .setup ();

			this .viewport_       .addInterest (this, "set_viewport__");
			this .addChildren_    .addFieldInterest (this .group .addChildren_);
			this .removeChildren_ .addFieldInterest (this .group .removeChildren_);
			this .children_       .addFieldInterest (this .group .children_);

			this .set_viewport__ ();
		},
		isLayer0: function (value)
		{
			this .layer0 = value;
			this .defaultBackground .setHidden (! value);
		},
		getViewport: function ()
		{
			return this .currentViewport;
		},
		getBackground: function ()
		{
			return this .backgroundStack .top ();
		},
		getFog: function ()
		{
			return this .fogStack .top ();
		},
		getNavigationInfo: function ()
		{
			return this .navigationInfoStack .top ();
		},
		getViewpoint: function ()
		{
			return this .viewpointStack .top ();
		},
		getBackgrounds: function ()
		{
			return this .backgrounds;
		},
		getFogs: function ()
		{
			return this .fogs;
		},
		getNavigationInfos: function ()
		{
			return this .navigationInfos;
		},
		getViewpoints: function ()
		{
			return this .viewpoints;
		},
		getUserViewpoints: function ()
		{
			var userViewpoints = [ ];

			for (var i = 0; i < this .viewpoints .get () .length; ++ i)
			{
				var viewpoint = this .viewpoints .get () [i];

				if (viewpoint .description_ .length)
					userViewpoints .push (viewpoint);
			}

			return userViewpoints;
		},
		getBackgroundStack: function ()
		{
			return this .backgroundStack;
		},
		getFogStack: function ()
		{
			return this .fogStack;
		},
		getNavigationInfoStack: function ()
		{
			return this .navigationInfoStack;
		},
		getViewpointStack: function ()
		{
			return this .viewpointStack;
		},
		getHitRay: function ()
		{
			return this .hitRay;
		},
		set_viewport__: function ()
		{
			this .currentViewport = X3DCast (X3DConstants .X3DViewportNode, this .viewport_);

			if (! this .currentViewport)
				this .currentViewport = this .getBrowser () .getDefaultViewport ();
		},
		bind: function ()
		{
			this .traverse (TraverseType .CAMERA);

			// Bind first viewpoint in viewpoint list.

			this .navigationInfoStack .forcePush (this .navigationInfos .getBound ());
			this .backgroundStack     .forcePush (this .backgrounds     .getBound ());
			this .fogStack            .forcePush (this .fogs            .getBound ());
			this .viewpointStack      .forcePush (this .viewpoints      .getBound ());
		},
		traverse: function (type)
		{
		   var browser = this .getBrowser ();

			browser .getLayers () .push (this);

			switch (type)
			{
				case TraverseType .POINTER:
					this .pointer ();
					break;
				case TraverseType .CAMERA:
					this .camera ();
					break;
				case TraverseType .COLLISION:
					this .collision ();
					break;
				case TraverseType .DISPLAY:
					this .display ();
					break;
			}

			browser .getLayers () .pop ();
		},
		pointer: function ()
		{
			if (this .isPickable_ .getValue ())
			{
				var viewport = this .currentViewport .getRectangle ();

				if (this .getBrowser () .getSelectedLayer ())
				{
					if (this .getBrowser () .getSelectedLayer () !== this)
						return;
				}
				else
				{
					if (! this .getBrowser () .isPointerInRectangle (viewport))
						return;
				}

				this .getViewpoint () .reshape ();
				this .getViewpoint () .transform ();

				this .hitRay = this .getBrowser () .setHitRay (viewport);

				this .currentViewport .push ();
				this .collect (TraverseType .POINTER);
				this .currentViewport .pop ();
			}
		},
		camera: function ()
		{
			this .getViewpoint () .reshape ();
			this .getBrowser () .getModelViewMatrix () .identity ();

			this .currentViewport .push ();
			this .collect (TraverseType .CAMERA);
			this .currentViewport .pop ();

			this .navigationInfos .update ();
			this .backgrounds     .update ();
			this .fogs            .update ();
			this .viewpoints      .update ();

			this .getViewpoint () .update ();
		},
		collision: function ()
		{
			this .collisionTime = 0;

			this .getViewpoint () .reshape ();
			this .getBrowser () .getModelViewMatrix () .identity ();

			// Render
			this .currentViewport .push ();
			this .render (TraverseType .COLLISION);
			this .currentViewport .pop ();
		},
		display: function (type)
		{
			this .getNavigationInfo () .enable ();
			this .getViewpoint ()      .reshape ();
			this .getViewpoint ()      .transform ();

			this .currentViewport .push ();
			this .render (TraverseType .DISPLAY);
			this .currentViewport .pop ();
		},
		collect: function (type)
		{
			// Taken from group.traverse.
		},
	});

	return X3DLayerNode;
});


