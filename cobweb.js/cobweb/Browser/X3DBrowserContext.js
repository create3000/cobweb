
define ([
	"jquery",
	"cobweb/Fields/SFTime",
	"cobweb/Basic/X3DBaseNode",
	"cobweb/Browser/Rendering/X3DRenderingContext",
	"cobweb/Browser/Geometry3D/X3DGeometry3DContext",
	"cobweb/Browser/KeyDeviceSensor/X3DKeyDeviceSensorContext",
	"cobweb/Browser/EnvironmentalEffects/X3DEnvironmentalEffectsContext",
	"cobweb/Browser/Layering/X3DLayeringContext",
	"cobweb/Browser/Lighting/X3DLightingContext",
	"cobweb/Browser/Navigation/X3DNavigationContext",
	"cobweb/Browser/Networking/X3DNetworkingContext",
	"cobweb/Browser/Shaders/X3DShadersContext",
	"cobweb/Browser/Shape/X3DShapeContext",
	"cobweb/Browser/Texturing/X3DTexturingContext",
	"cobweb/Browser/Time/X3DTimeContext",
	"cobweb/Routing/X3DRoutingContext",
	"cobweb/Execution/World",
	"cobweb/Bits/TraverseType",
],
function ($,
          SFTime,
          X3DBaseNode,
          X3DRenderingContext,
          X3DGeometry3DContext,
          X3DKeyDeviceSensorContext,
          X3DEnvironmentalEffectsContext,
          X3DLayeringContext,
          X3DLightingContext,
          X3DNavigationContext,
          X3DNetworkingContext,
          X3DShadersContext,
          X3DShapeContext,
          X3DTexturingContext,
          X3DTimeContext,
          X3DRoutingContext,
          World,
          TraverseType)
{
	function X3DBrowserContext (x3d)
	{
		X3DBaseNode                    .call (this, this, this);
		X3DRenderingContext            .call (this, x3d);
		X3DGeometry3DContext           .call (this);
		X3DKeyDeviceSensorContext      .call (this);
		X3DEnvironmentalEffectsContext .call (this);
		X3DLayeringContext             .call (this);
		X3DLightingContext             .call (this);
		X3DNavigationContext           .call (this);
		X3DNetworkingContext           .call (this);
		X3DShadersContext              .call (this);
		X3DShapeContext                .call (this);
		X3DTexturingContext            .call (this);
		X3DTimeContext                 .call (this);
		X3DRoutingContext              .call (this);

		this .changedTime    = 0;
		this .renderCallback = this .traverse .bind (this);

		this .frames = 0; // DEBUG frame rate
		this .timer  = 0; // DEBUG frame rate
	};

	X3DBrowserContext .prototype = $.extend (new X3DBaseNode (),
		X3DRenderingContext .prototype,
		X3DGeometry3DContext .prototype,
		X3DKeyDeviceSensorContext .prototype,
		X3DEnvironmentalEffectsContext .prototype,
		X3DLayeringContext .prototype,
		X3DLightingContext .prototype,
		X3DNavigationContext .prototype,
		X3DNetworkingContext .prototype,
		X3DShadersContext .prototype,
		X3DShapeContext .prototype,
		X3DTexturingContext .prototype,
		X3DTimeContext .prototype,
		X3DRoutingContext .prototype,
	{
		constructor: X3DBrowserContext,
		initialize: function ()
		{
			this .addChildren ("prepareEvents", new SFTime ());

			X3DBaseNode                    .prototype .initialize .call (this);
			X3DRenderingContext            .prototype .initialize .call (this);
			X3DGeometry3DContext           .prototype .initialize .call (this);
			X3DKeyDeviceSensorContext      .prototype .initialize .call (this);
			X3DEnvironmentalEffectsContext .prototype .initialize .call (this);
			X3DLayeringContext             .prototype .initialize .call (this);
			X3DLightingContext             .prototype .initialize .call (this);
			X3DNavigationContext           .prototype .initialize .call (this);
			X3DNetworkingContext           .prototype .initialize .call (this);
			X3DShadersContext              .prototype .initialize .call (this);
			X3DShapeContext                .prototype .initialize .call (this);
			X3DTexturingContext            .prototype .initialize .call (this);
			X3DTimeContext                 .prototype .initialize .call (this);
			X3DRoutingContext              .prototype .initialize .call (this);
		},
		getWorld: function ()
		{
			return this .world;
		},
		setExecutionContext: function (executionContext)
		{
			this .world = new World (executionContext);
			this .world .setup ();
		},
		getExecutionContext: function ()
		{
			return this .world .getExecutionContext ();
		},
		addBrowserEvent: function ()
		{
			if (this .changedTime === this .getCurrentTime ())
				return;

			this .changedTime = this .getCurrentTime ();

			requestAnimationFrame (this .renderCallback);
		},
		traverse: function (time)
		{
			this .advance (performance .timing .navigationStart + time);

			this .prepareEvents_ .processInterests ();

			this .processEvents ();
			this .world .traverse (TraverseType .CAMERA);

			this .processEvents ();

			this .context .clearColor (0, 0, 0, 0);
			this .context .clear (this .context .COLOR_BUFFER_BIT);

			this .world .traverse (TraverseType .DISPLAY);

			// DEBUG frame rate

			if (this .currentTime - this .timer > 10)
			{
				console .log (this .frames / (this .currentTime - this .timer));
				this .frames = 0;
				this .timer  = this .currentTime;
			}
			else
				++ this .frames;
		},
	});

	return X3DBrowserContext;
});
