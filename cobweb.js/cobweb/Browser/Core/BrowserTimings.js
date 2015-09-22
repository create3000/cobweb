
define ([
	"jquery",
	"cobweb/Fields/SFBool",
	"cobweb/Basic/X3DBaseNode",
	"lib/dataStorage",
	"lib/gettext",
],
function ($,
          SFBool,
          X3DBaseNode,
          dataStorage,
          _)
{
	function BrowserTimings (executionContext)
	{
		X3DBaseNode .call (this, executionContext .getBrowser (), executionContext);

		this .addChildren ("enabled", new SFBool ());
	}

	BrowserTimings .prototype = $.extend (Object .create (X3DBaseNode .prototype),
	{
		constructor: BrowserTimings,
		getTypeName: function ()
		{
			return "BrowserTimings";
		},
		getComponentName: function ()
		{
			return "Cobweb";
		},
		getContainerField: function ()
		{
			return "browserTimings";
		},
		initialize: function ()
		{
			X3DBaseNode .prototype .initialize .call (this);

			this .enabled_ .addInterest (this, "set_enabled__");

			this .type      = "LESS";
			this .startTime = 0;
			this .frames    = 0;

			this .element = $("<div/>") .addClass ("cobweb-browser-timing") .appendTo (this .getBrowser () .getXML () .find (".cobweb-surface"));
			this .header  = $("<div/>") .addClass ("cobweb-header") .text (_("Browser Timings")) .appendTo (this .element);
			this .text    = $("<div/>") .appendTo (this .element);
			this .buttons = $("<div/>") .appendTo (this .element);
			this .button  = $("<button/>") .text (_("More Properties")) .click (this .set_type__ .bind (this)) .appendTo (this .buttons);

			if (dataStorage ["BrowserTimings.enabled"])
				this .enabled_ = true;
		},
		set_enabled__: function (enabled)
		{
		   dataStorage ["BrowserTimings.enabled"] = enabled .getValue ();

			if (enabled .getValue ())
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
		set_type__: function ()
		{
		   if (this .type === "MORE")
		   {
		      this .type = "LESS";
		      this .button .text (_("More Properties"));
		   }
		   else
		   {
				this .type = "MORE";
		      this .button .text (_("Less Properties"));
			}

		   this .build ();
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
			text += _("Frame rate") + ": " + (this .frames / (currentTime - this .startTime)) .toFixed (2) .toLocaleString () + " fps\n";
			text += _("Speed") + ":      " + browser .currentSpeed .toFixed (2) .toLocaleString () + " m/s\n";
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

	return BrowserTimings;
});
