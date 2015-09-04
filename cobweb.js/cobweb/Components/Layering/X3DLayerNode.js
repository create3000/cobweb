
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
	"standard/Math/Numbers/Matrix4",
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
          Vector3,
          Matrix4)
{
	var
		positionOffset   = new Vector3 (0, 0, 0),
		projectionMatrix = new Matrix4 (),
		line             = new Line3 (new Vector3 (0, 0, 0), new Vector3 (0, 0, 0));

	function X3DLayerNode (browser, executionContext, defaultViewpoint, group)
	{
		X3DNode     .call (this, browser, executionContext);
		X3DRenderer .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DLayerNode);

		this .defaultViewpoint = defaultViewpoint;
		this .group            = group;
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

			this .defaultNavigationInfo = new NavigationInfo (this .getExecutionContext ());
			this .defaultBackground     = new Background (this .getExecutionContext ());
			this .defaultFog            = new Fog (this .getExecutionContext ());

			this .defaultNavigationInfo .setup ();
			this .defaultBackground     .setup ();
			this .defaultFog            .setup ();
			this .defaultViewpoint      .setup ();

			this .defaultBackground .setHidden (true);
			this .defaultFog        .setHidden (true);

			this .currentViewport     = null;
			this .navigationInfoStack = new BindableStack (this .getExecutionContext (), this, this .defaultNavigationInfo);
			this .backgroundStack     = new BindableStack (this .getExecutionContext (), this, this .defaultBackground);
			this .fogStack            = new BindableStack (this .getExecutionContext (), this, this .defaultFog);
			this .viewpointStack      = new BindableStack (this .getExecutionContext (), this, this .defaultViewpoint);

			this .navigationInfos = new BindableList (this .getExecutionContext (), this);
			this .backgrounds     = new BindableList (this .getExecutionContext (), this);
			this .fogs            = new BindableList (this .getExecutionContext (), this);
			this .viewpoints      = new BindableList (this .getExecutionContext (), this);

			this .group .children_ = this .children_;
			this .group .setup ();
			this .collect = this .group .traverse .bind (this .group);

			this .hitRay = line;

			this .viewport_       .addInterest (this, "set_viewport__");
			this .addChildren_    .addInterest (this .group .addChildren_,    "setValue");
			this .removeChildren_ .addInterest (this .group .removeChildren_, "setValue");
			this .children_       .addInterest (this .group .children_,       "setValue");

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
		getNavigationInfo: function ()
		{
			return this .navigationInfoStack .top ();
		},
		getBackground: function ()
		{
			return this .backgroundStack .top ();
		},
		getFog: function ()
		{
			return this .fogStack .top ();
		},
		getViewpoint: function ()
		{
			return this .viewpointStack .top ();
		},
		getNavigationInfos: function ()
		{
			return this .navigationInfos;
		},
		getBackgrounds: function ()
		{
			return this .backgrounds;
		},
		getFogs: function ()
		{
			return this .fogs;
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
		getNavigationInfoStack: function ()
		{
			return this .navigationInfoStack;
		},
		getBackgroundStack: function ()
		{
			return this .backgroundStack;
		},
		getFogStack: function ()
		{
			return this .fogStack;
		},
		getViewpointStack: function ()
		{
			return this .viewpointStack;
		},
		setHitRay: function (value)
		{
			this .hitRay = value;
		},
		getHitRay: function ()
		{
			return this .hitRay;
		},
		getConstrainedTranslation: function (translation)
		{
			var
				navigationInfo  = this .getNavigationInfo (),
				distance        = this .getDistance (translation),
				length          = translation .abs ();

			var
				zFar            = navigationInfo .getFarPlane (this .getViewpoint ()),
				collisionRadius = navigationInfo .getCollisionRadius ();

			if (zFar - distance > 0) // Are there polygons under the viewer
			{
				distance -= collisionRadius;

				if (distance > 0)
				{
					// Move

					if (length > distance)
					{
						// Collision: The wall has reached.
						return translation .normalize () .multiplay (distance);
					}

					return translation;
				}

				// Collision
				return translation .set (0, 0, 0);
			}

			return translation;
		},
		getDistance: function (translation)
		{
			try
			{
				// Apply collision to translation.

				var
					viewpoint       = this .getViewpoint (),
					navigationInfo  = this .getNavigationInfo (),
					collisionRadius = navigationInfo .getCollisionRadius (),
					zNear           = navigationInfo .getNearPlane (),
					zFar            = navigationInfo .getFarPlane (getViewpoint ());

				// Get width and height of camera

				var
					width     = collisionRadius * 2,
					height    = collisionRadius + navigationInfo .getAvatarHeight () - navigationInfo .getStepHeight (),
					width1_2  = width / 2,
					height1_2 = height / 2;

				// Get position offset

				positionOffset .set (0, -height / 2 - collisionRadius, 0);
	
				// Reshape camera

				Camera .ortho (-width1_2, width1_2, -height1_2, height1_2, zNear, zFar, projectionMatrix);

				this .getBrowser () .setProjectionMatrix (projectionMatrix);

				// Translate camera

				var
					localOrientation = Rotation4 .inverse (viewpoint .orientation_ .getValue ()) .multRight (viewpoint .getOrientation ()),
					modelViewMatrix  = viewpoint .getParentMatrix () .copy ();

				modelViewMatrix .translate (viewpoint .getUserPosition () .add (positionOffset));
				modelViewMatrix .rotate (new Rotation4 (zAxis, Vector3 .negate (translation)) .multRight (localOrientation));
				modelViewMatrix .inverse ();

				this .getBrowser () .getModelViewMatrix () .set (modelViewMatrix);

				// Traverse and get distance

				this .getBrowser () .getLayers () .push (this);
				this .currentViewport .push ();

				//this .traverse (TraverseType .NAVIGATION);

				this .currentViewport .pop ();
				this .getBrowser () .getLayers () .pop ();

				return X3DRenderer .prototype .getDistance .call (this);
			}
			catch (error)
			{ }
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

			if (this .navigationInfos .get () .length)
			{
				var navigationInfo = this .navigationInfos .getBound ();
				this .navigationInfoStack .forcePush (navigationInfo);
				navigationInfo .bindToLayer (this);
			}

			if (this .backgrounds .get () .length)
			{
				var background = this .backgrounds .getBound ();
				this .backgroundStack .forcePush (background);
				background .bindToLayer (this);
			}

			if (this .fogs .get () .length)
			{
				var fog = this .fogs .getBound ();
				this .fogStack .forcePush (fog);
				fog .bindToLayer (this);
			}

			// Bind first viewpoint in viewpoint stack.

			if (this .viewpoints .get () .length)
			{
				var viewpoint = this .viewpoints .getBound ();
				this .viewpointStack .forcePush (viewpoint);
				viewpoint .bindToLayer (this);
			}
		},
		traverse: function (type)
		{
			this .getBrowser () .getLayers () .push (this);
			this .currentViewport .push ();

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

			this .currentViewport .pop ();
			this .getBrowser () .getLayers () .pop ();
		},
		pointer: function ()
		{
			if (this .isPickable_ .getValue ())
			{
				var
					viewVolumes = this .getViewVolumeStack (),
					viewVolume  = viewVolumes [viewVolumes .length - 1];

				if (this .getBrowser () .getSelectedLayer ())
				{
					if (this .getBrowser () .getSelectedLayer () !== this)
						return;
				}
				else
				{
					if (! this .getBrowser () .isPointerInRectangle (viewVolume .getScissor ()))
						return;
				}

				this .getViewpoint () .reshape ();
				this .getViewpoint () .transform ();

				this .getBrowser () .setHitRay (viewVolume .getScissor ());
				this .collect (TraverseType .POINTER);

				this .getBrowser () .getGlobalLights () .length = 0;
			}
		},
		camera: function ()
		{
			this .getViewpoint () .reshape ();
			this .getBrowser () .getModelViewMatrix () .identity ();

			this .defaultNavigationInfo .traverse (TraverseType .CAMERA);
			this .defaultBackground     .traverse (TraverseType .CAMERA);
			this .defaultViewpoint      .traverse (TraverseType .CAMERA);

			this .collect (TraverseType .CAMERA);

			this .navigationInfos .update ();
			this .backgrounds     .update ();
			this .fogs            .update ();
			this .viewpoints      .update ();
		},
		navigation: function ()
		{
		
		},
		collision: function ()
		{
		
		},
		display: function (type)
		{
			var gl       = this .getBrowser () .getContext ();
			var viewport = this .currentViewport .getRectangle ();

			gl .viewport (viewport [0],
			              viewport [1],
			              viewport [2],
			              viewport [3]);

			gl .scissor (viewport [0],
			             viewport [1],
			             viewport [2],
			             viewport [3]);

			gl .clear (gl .DEPTH_BUFFER_BIT);

			this .getBackground () .draw ();

			this .getNavigationInfo () .enable ();
			this .getViewpoint ()      .reshape ();
			this .getViewpoint ()      .transform ();

			this .render (TraverseType .DISPLAY);
		},
		collect: function (type) { },
	});

	return X3DLayerNode;
});

