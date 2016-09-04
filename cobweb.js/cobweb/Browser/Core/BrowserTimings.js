
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
"use strict";
	
   function f2 (n) { return Math .floor (n * 100) / 100; }

	function BrowserTimings (executionContext)
	{
		X3DBaseNode .call (this, executionContext);

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

			this .localeOptions = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
			this .type          = dataStorage ["BrowserTimings.type"] || "LESS";
			this .startTime     = 0;
			this .frames        = 0;

			this .element = $("<div>") .addClass ("cobweb-browser-timing") .appendTo (this .getBrowser () .getElement () .find (".cobweb-surface"));
			this .table   = $("<table></table>") .appendTo (this .element);
			this .header  = $("<thead>") .append ($("<tr></tr>") .append ($("<th colspan='2'></th>"))) .appendTo (this .table);
			this .body    = $("<tbody></tbody>") .appendTo (this .table);
			this .footer  = $("<tfoot>") .append ($("<tr></tr>") .append ($("<td colspan='2'></td>"))) .appendTo (this .table);
			this .button  = $("<button>") .click (this .set_type__ .bind (this)) .appendTo (this .footer .find ("td"));
			this .rows    = [ ];

			this .set_button__ ();

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
				this .type = "LESS";
			else
				this .type = "MORE";

			dataStorage ["BrowserTimings.type"] = this .type;

			this .set_button__ ();
			this .build ();
		},
		set_button__: function ()
		{
			if (this .type === "MORE")
				this .button .text (_("Less Properties"));
			else
				this .button .text (_("More Properties"));
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
			var
				browser     = this .getBrowser (),
				currentTime = browser .getCurrentTime (),
				language    = navigator .language || navigator .userLanguage,
				fixed       = this .localeOptions,
				rows        = this .rows,
				r           = 0;
			
			rows [r++] = $("<tr>") .append ($("<td></td>") .text (_("Frame rate") + ":")) .append ($("<td></td>") .text (f2(this .frames / (currentTime - this .startTime)) .toLocaleString (language, fixed) + " " + _("fps")));
			rows [r++] = $("<tr>") .append ($("<td></td>") .text (_("Speed")      + ":")) .append ($("<td></td>") .text (f2(browser .currentSpeed)                          .toLocaleString (language, fixed) + " " + _("m/s")));

			if (this .type === "MORE")
			{
				var 
					systemTime        = browser .systemTime,
					navigationTime    = activeLayer && browser .getCollisionCount () ? activeLayer .collisionTime : 0,
					collisionTime     = browser .collisionTime + navigationTime,
					routingTime       = browser .browserTime - (browser .cameraTime + browser .collisionTime + browser .displayTime + navigationTime),
					prepareEvents     = Object .keys (browser .prepareEvents () .getInterests ()) .length - 1,
					sensors           = Object .keys (browser .sensors () .getInterests ()) .length,
					layers            = browser .getWorld () .getLayerSet () .getLayers (),
					activeLayer       = browser .getActiveLayer (),
					opaqueShapes      = 0,
					transparentShapes = 0;

				for (var l = 0; l < layers .length; ++ l)
				{
					var layer = layers [l];
					opaqueShapes      += layer .numOpaqueShapes;
					transparentShapes += layer .numTransparentShapes;
				}

			   rows [1] .addClass ("cobweb-more");

				rows [r++] = $("<tr>") .append ($("<td></td>") .text (_("Browser")   + ":")) .append ($("<td></td>") .text (f2(systemTime)           .toLocaleString (language, fixed) + " " + _("ms")));
				rows [r++] = $("<tr>") .append ($("<td></td>") .text (_("X3D")       + ":")) .append ($("<td></td>") .text (f2(browser .browserTime) .toLocaleString (language, fixed) + " " + _("ms")));
				rows [r++] = $("<tr>") .append ($("<td></td>") .text (_("Routing")   + ":")) .append ($("<td></td>") .text (f2(routingTime)          .toLocaleString (language, fixed) + " " + _("ms")));
				rows [r++] = $("<tr>") .append ($("<td></td>") .text (_("Picking")   + ":")) .append ($("<td></td>") .text (f2(browser .pickingTime) .toLocaleString (language, fixed) + " " + _("ms")));
				rows [r++] = $("<tr>") .append ($("<td></td>") .text (_("Camera")    + ":")) .append ($("<td></td>") .text (f2(browser .cameraTime)  .toLocaleString (language, fixed) + " " + _("ms")));
				rows [r++] = $("<tr>") .append ($("<td></td>") .text (_("Collision") + ":")) .append ($("<td></td>") .text (f2(collisionTime)        .toLocaleString (language, fixed) + " " + _("ms")));
				rows [r++] = $("<tr>") .append ($("<td></td>") .text (_("Display")   + ":")) .append ($("<td></td>") .text (f2(browser .displayTime) .toLocaleString (language, fixed) + " " + _("ms")));
				rows [r++] = $("<tr>") .append ($("<td></td>") .text (_("Shapes")    + ":")) .append ($("<td></td>") .text (opaqueShapes + " + " + transparentShapes));
				rows [r++] = $("<tr>") .append ($("<td></td>") .text (_("Sensors")   + ":")) .append ($("<td></td>") .text (prepareEvents + sensors));
			}

			rows .length = r;

			this .header .find ("th") .text (_("Browser Timings"));
			this .body .empty ();
			this .body .append (rows);
		},
	});

	return BrowserTimings;
});
