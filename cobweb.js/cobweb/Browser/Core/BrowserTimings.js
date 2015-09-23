
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

			this .type      = dataStorage ["BrowserTimings.type"] || "LESS";
			this .startTime = 0;
			this .frames    = 0;

			this .element = $("<div/>") .addClass ("cobweb-browser-timing") .appendTo (this .getBrowser () .getXML () .find (".cobweb-surface"));
			this .table   = $("<table/>") .appendTo (this .element);
			this .header  = $("<thead/>") .append ($("<tr/>") .append ($("<th colspan=2/>") .text (_("Browser Timings")))) .appendTo (this .table);
			this .body    = $("<tbody/>") .appendTo (this .table);
			this .footer  = $("<tfoot/>") .append ($("<tr/>") .append ($("<td colspan=2/>"))) .appendTo (this .table);
			this .button  = $("<button/>") .text (_("More Properties")) .click (this .set_type__ .bind (this)) .appendTo (this .footer .find ("td"));
			this .rows    = [ ];

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

			dataStorage ["BrowserTimings.type"] = this .type;
		   
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
				browser = this .getBrowser (),
				rows    = this .rows,
				i       = 0;

			rows [i++] = $("<tr>") .append ($("<td>") .text (_("Frame rate") + ":")) .append ($("<td>") .text ((this .frames / (currentTime - this .startTime)) .toFixed (2) .toLocaleString () + " " + _("fps")));
			rows [i++] = $("<tr>") .append ($("<td>") .text (_("Speed") + ":"))      .append ($("<td>") .text (browser .currentSpeed .toFixed (2) .toLocaleString () + " " + _("m/s")));

			if (this .type === "MORE")
			{
				var
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
			   
			   rows [1] .addClass ("cobweb-more");

				rows [i++] = $("<tr>") .append ($("<td>") .text (_("Browser") + ":"))   .append ($("<td>") .text (systemTime .toFixed (2) .toLocaleString () + " " + _("ms")));
				rows [i++] = $("<tr>") .append ($("<td>") .text (_("X3D") + ":"))       .append ($("<td>") .text (browser .browserTime .toFixed (2) .toLocaleString () + " " + _("ms")));
				rows [i++] = $("<tr>") .append ($("<td>") .text (_("Routing") + ":"))   .append ($("<td>") .text (routingTime .toFixed (2) .toLocaleString () + " " + _("ms")));
				rows [i++] = $("<tr>") .append ($("<td>") .text (_("Picking") + ":"))   .append ($("<td>") .text (browser .pickingTime .toFixed (2) .toLocaleString () + " " + _("ms")));
				rows [i++] = $("<tr>") .append ($("<td>") .text (_("Camera") + ":"))    .append ($("<td>") .text (browser .cameraTime .toFixed (2) .toLocaleString () + " " + _("ms")));
				rows [i++] = $("<tr>") .append ($("<td>") .text (_("Collision") + ":")) .append ($("<td>") .text (collisionTime .toFixed (2) .toLocaleString () + " " + _("ms")));
				rows [i++] = $("<tr>") .append ($("<td>") .text (_("Display") + ":"))   .append ($("<td>") .text (browser .displayTime .toFixed (2) .toLocaleString () + " " + _("ms")));
				rows [i++] = $("<tr>") .append ($("<td>") .text (_("Shapes") + ":"))    .append ($("<td>") .text (opaqueShapes + " + " + transparentShapes));
				rows [i++] = $("<tr>") .append ($("<td>") .text (_("Sensors") + ":"))   .append ($("<td>") .text (prepareEvents + sensors));
			}

			rows .length = i;

			this .body .empty ();
			this .body .append (rows);
		},
	});

	return BrowserTimings;
});
