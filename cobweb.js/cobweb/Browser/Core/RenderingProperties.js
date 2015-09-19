
define ([
	"jquery",
	"cobweb/Basic/X3DBaseNode",
	"cobweb/Components/Rendering/X3DGeometryNode",
],
function ($,
          X3DBaseNode,
          X3DGeometryNode)
{
	function RenderingProperties (executionContext)
	{
		X3DBaseNode .call (this, executionContext .getBrowser (), executionContext);

	}

	RenderingProperties .prototype = $.extend (Object .create (X3DBaseNode .prototype),
	{
		constructor: RenderingProperties,
		getTypeName: function ()
		{
			return "RenderingProperties";
		},
		getComponentName: function ()
		{
			return "Cobweb";
		},
		getContainerField: function ()
		{
			return "renderingProperties";
		},
		initialize: function ()
		{
			X3DBaseNode .prototype .initialize .call (this);

			this .enabled   = false;
			this .type      = "LESS";
			this .startTime = 0;
			this .frames    = 0;

			this .element = $("<div/>") .addClass ("cobweb-browser-timing") .appendTo (this .getBrowser () .getXML () .find (".cobweb-canvas"));
			this .header  = $("<div/>") .addClass ("cobweb-header") .text ("Browser Timing") .appendTo (this .element);
			this .text    = $("<div/>") .appendTo (this .element);
			this .buttons = $("<div/>") .appendTo (this .element);
			this .button  = $("<button/>") .text ("More Properties") .click (this .set_type__ .bind (this)) .appendTo (this .buttons);

			if (this .getBrowser () .getXML () [0] .getAttribute ("statistics") == "true")
				this .setEnabled (true);
		},
		set_type__: function ()
		{
		   if (this .type === "MORE")
		   {
		      this .type = "LESS";
		      this .button .text ("More Properties");
		   }
		   else
		   {
				this .type = "MORE";
		      this .button .text ("Less Properties");
			}

		   this .build ();
		},
		setEnabled: function (value)
		{
			this .enabled = value;
			
			if (value)
			{
				this .element .fadeIn ();
				this .getBrowser () .prepareEvents () .addInterest (this, "update");
				this .update ();
			}
			else
			{
				this .element .fadeOut ();
				this .getBrowser () .prepareEvents () .removeInterest (this, "update");
			}
		},
		getEnabled: function ()
		{
			return this .enabled;
		},
		update: function ()
		{
			var currentTime = this .getBrowser () .getCurrentTime ();
		
			if (currentTime - this .startTime > 1)
			{
			   this .build ();
				
				this .frames    = 0;
				this .startTime = currentTime;
			}
			else
				++ this .frames;
		},
		build: function ()
		{
			var currentTime = this .getBrowser () .getCurrentTime ();
		
			var
				browser           = this .getBrowser (),
				layers            = browser .getWorld () .getLayerSet () .getLayers (),
				activeLayer       = browser .getActiveLayer (),
				opaqueShapes      = 0,
				transparentShapes = 0;

			var
				prepareEvents = Object .keys (browser .prepareEvents () .getInterests ()) .length - 1,
				sensors       = Object .keys (browser .sensors () .getInterests ()) .length;

			for (var i = 0; i < layers .length; ++ i)
			{
				var layer = layers [i];
				opaqueShapes      += layer .numOpaqueShapes;
				transparentShapes += layer .numTransparentShapes;
			}

			var 
				navigationTime = activeLayer && browser .getCollisionCount () ? activeLayer .collisionTime : 0,
				collisionTime  = browser .collisionTime + navigationTime,
				routingTime    = browser .browserTime - (browser .cameraTime + browser .collisionTime + browser .displayTime + navigationTime),
				systemTime     = browser .systemTime - browser .pickingTime;

			var text = "";
			text += "Frame rate: " + (this .frames / (currentTime - this .startTime)) .toFixed (2) .toLocaleString () + " fps\n";
			text += "Speed:      " + browser .currentSpeed .toFixed (2) .toLocaleString () + " m/s\n";
			text += "\n";

			if (this .type === "MORE")
			{
				text += "Browser:    " + systemTime .toFixed (2) .toLocaleString () + " ms" + "\n";
				text += "X3D:        " + browser .browserTime .toFixed (2) .toLocaleString () + " ms" + "\n";
				text += "Routing:    " + routingTime .toFixed (2) .toLocaleString () + " ms" + "\n";
				text += "Picking:    " + browser .pickingTime .toFixed (2) .toLocaleString () + " ms" + "\n";
				text += "Camera:     " + browser .cameraTime .toFixed (2) .toLocaleString () + " ms" + "\n";
				text += "Collision:  " + collisionTime .toFixed (2) .toLocaleString () + " ms" + "\n";
				text += "Display:    " + browser .displayTime .toFixed (2) .toLocaleString () + " ms" + "\n";
				text += "Shapes:     " + opaqueShapes + " + " + transparentShapes + "\n";
				text += "Sensors:    " + (prepareEvents + sensors) + "\n";
				text += "\n";
			}

			this .text .text (text);
		},
	});

	return RenderingProperties;
});
