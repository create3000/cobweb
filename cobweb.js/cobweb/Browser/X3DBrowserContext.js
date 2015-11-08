
define ([
	"jquery",
	"cobweb/Fields/SFTime",
	"cobweb/Basic/X3DBaseNode",
	"cobweb/Browser/Core/X3DCoreContext",
	"cobweb/Browser/Networking/X3DNetworkingContext",
	"cobweb/Browser/Rendering/X3DRenderingContext",
	"cobweb/Browser/Geometry2D/X3DGeometry2DContext",
	"cobweb/Browser/Geometry3D/X3DGeometry3DContext",
	"cobweb/Browser/PointingDeviceSensor/X3DPointingDeviceSensorContext",
	"cobweb/Browser/KeyDeviceSensor/X3DKeyDeviceSensorContext",
	"cobweb/Browser/Navigation/X3DNavigationContext",
	"cobweb/Browser/Layering/X3DLayeringContext",
	"cobweb/Browser/EnvironmentalEffects/X3DEnvironmentalEffectsContext",
	"cobweb/Browser/Lighting/X3DLightingContext",
	"cobweb/Browser/Scripting/X3DScriptingContext",
	"cobweb/Browser/Shaders/X3DShadersContext",
	"cobweb/Browser/Shape/X3DShapeContext",
	"cobweb/Browser/Sound/X3DSoundContext",
	"cobweb/Browser/Text/X3DTextContext",
	"cobweb/Browser/Texturing/X3DTexturingContext",
	"cobweb/Browser/Time/X3DTimeContext",
	"cobweb/Routing/X3DRoutingContext",
	"cobweb/Execution/World",
	"cobweb/Bits/TraverseType",
],
function ($,
          SFTime,
          X3DBaseNode,
          X3DCoreContext,
          X3DNetworkingContext,
          X3DRenderingContext,
          X3DGeometry2DContext,
          X3DGeometry3DContext,
          X3DPointingDeviceSensorContext,
          X3DKeyDeviceSensorContext,
          X3DNavigationContext,
          X3DLayeringContext,
          X3DEnvironmentalEffectsContext,
          X3DLightingContext,
          X3DScriptingContext,
          X3DShadersContext,
          X3DShapeContext,
          X3DSoundContext,
          X3DTextContext,
          X3DTexturingContext,
          X3DTimeContext,
          X3DRoutingContext,
          World,
          TraverseType)
{
"use strict";

	function X3DBrowserContext (xml)
	{
		X3DBaseNode                    .call (this, this, this);
		X3DCoreContext                 .call (this, xml);
		X3DNetworkingContext           .call (this);
		X3DRenderingContext            .call (this);
		X3DGeometry2DContext           .call (this);
		X3DGeometry3DContext           .call (this);
		X3DPointingDeviceSensorContext .call (this);
		X3DKeyDeviceSensorContext      .call (this);
		X3DNavigationContext           .call (this);
		X3DLayeringContext             .call (this);
		X3DEnvironmentalEffectsContext .call (this);
		X3DLightingContext             .call (this);
		X3DScriptingContext            .call (this);
		X3DShadersContext              .call (this);
		X3DShapeContext                .call (this);
		X3DSoundContext                .call (this);
		X3DTextContext                 .call (this);
		X3DTexturingContext            .call (this);
		X3DTimeContext                 .call (this);
		X3DRoutingContext              .call (this);

		this .changedTime     = 0;
		this .renderCallback  = this .traverse .bind (this);
		this .systemTime      = 0
		this .systemStartTime = 0
		this .browserTime     = 0;
		this .pickingTime     = 0;
		this .cameraTime      = 0;
		this .collisionTime   = 0;
		this .displayTime     = 0;
	};

	X3DBrowserContext .prototype = $.extend (Object .create (X3DBaseNode .prototype),
		X3DCoreContext .prototype,
		X3DNetworkingContext .prototype,
		X3DRenderingContext .prototype,
		X3DGeometry2DContext .prototype,
		X3DGeometry3DContext .prototype,
		X3DPointingDeviceSensorContext .prototype,
		X3DKeyDeviceSensorContext .prototype,
		X3DNavigationContext .prototype,
		X3DLayeringContext .prototype,
		X3DEnvironmentalEffectsContext .prototype,
		X3DLightingContext .prototype,
		X3DScriptingContext .prototype,
		X3DShadersContext .prototype,
		X3DShapeContext .prototype,
		X3DSoundContext .prototype,
		X3DTextContext .prototype,
		X3DTexturingContext .prototype,
		X3DTimeContext .prototype,
		X3DRoutingContext .prototype,
	{
		constructor: X3DBrowserContext,
		initialize: function ()
		{
			this .addChildren ("initialized",   new SFTime (),
			                   "shutdown",      new SFTime (),
			                   "prepareEvents", new SFTime (),
			                   "sensors",       new SFTime (),
			                   "finished",      new SFTime ());

			X3DBaseNode                    .prototype .initialize .call (this);
			X3DCoreContext                 .prototype .initialize .call (this);
			X3DNetworkingContext           .prototype .initialize .call (this);
			X3DRenderingContext            .prototype .initialize .call (this);
			X3DGeometry2DContext           .prototype .initialize .call (this);
			X3DGeometry3DContext           .prototype .initialize .call (this);
			X3DPointingDeviceSensorContext .prototype .initialize .call (this);
			X3DKeyDeviceSensorContext      .prototype .initialize .call (this);
			X3DNavigationContext           .prototype .initialize .call (this);
			X3DLayeringContext             .prototype .initialize .call (this);
			X3DEnvironmentalEffectsContext .prototype .initialize .call (this);
			X3DLightingContext             .prototype .initialize .call (this);
			X3DScriptingContext            .prototype .initialize .call (this);
			X3DShadersContext              .prototype .initialize .call (this);
			X3DShapeContext                .prototype .initialize .call (this);
			X3DSoundContext                .prototype .initialize .call (this);
			X3DTextContext                 .prototype .initialize .call (this);
			X3DTexturingContext            .prototype .initialize .call (this);
			X3DTimeContext                 .prototype .initialize .call (this);
			X3DRoutingContext              .prototype .initialize .call (this);
		},
		initialized: function ()
		{
			return this .initialized_;
		},
		shutdown: function ()
		{
			return this .shutdown_;
		},
		prepareEvents: function ()
		{
			return this .prepareEvents_;
		},
		sensors: function ()
		{
			return this .sensors_;
		},
		finished: function ()
		{
			return this .finished_;
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
			var t0 = performance .now ();
			this .systemTime = t0 - this .systemStartTime;
			this .advanceTime (time);

			this .prepareEvents_ .processInterests ();
			this .processEvents ();

			var t1 = performance .now ();
			this .world .traverse (TraverseType .CAMERA);
			this .cameraTime = performance .now () - t1;

			var t2 = performance .now ();
			if (this .getCollisionCount ())
				this .world .traverse (TraverseType .COLLISION);
			this .collisionTime = performance .now () - t2;

			this .sensors_ .processInterests ();
			this .processEvents ();

			var t3 = performance .now ();
			this .context .clearColor (0, 0, 0, 0);
			this .context .clear (this .context .COLOR_BUFFER_BIT);
			this .world .traverse (TraverseType .DISPLAY);
			this .displayTime = performance .now () - t3;

			this .browserTime     = performance .now () - t0;
			this .systemStartTime = performance .now ();

			this .finished_ .processInterests ();
		},
	});

	return X3DBrowserContext;
});
