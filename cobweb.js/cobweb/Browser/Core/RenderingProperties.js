
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

			this .element   = $("<div/>") .addClass ("renderingProperties") .appendTo (this .getBrowser () .getXML () .find (".canvas"));
			this .enabled   = false;
			this .startTime = 0;
			this .frames    = 0;

			if (this .getBrowser () .getXML () [0] .getAttribute ("statistics") == "true")
				this .setEnabled (true);
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
				text += "Rendering Properties\n\n";
				text += "Frame rate: " + (this .frames / (currentTime - this .startTime)) .toFixed (2) .toLocaleString () + " fps\n";
				text += "Browser:    " + systemTime .toFixed (2) .toLocaleString () + " ms" + "\n";
				text += "X3D:        " + browser .browserTime .toFixed (2) .toLocaleString () + " ms" + "\n";
				text += "Routing:    " + routingTime .toFixed (2) .toLocaleString () + " ms" + "\n";
				text += "Picking:    " + browser .pickingTime .toFixed (2) .toLocaleString () + " ms" + "\n";
				text += "Camera:     " + browser .cameraTime .toFixed (2) .toLocaleString () + " ms" + "\n";
				text += "Collision:  " + collisionTime .toFixed (2) .toLocaleString () + " ms" + "\n";
				text += "Display:    " + browser .displayTime .toFixed (2) .toLocaleString () + " ms" + "\n";
				text += "Shapes:     " + opaqueShapes + " + " + transparentShapes + "\n";
				text += "Sensors:    " + (prepareEvents + sensors) + "\n";

				this .element .text (text);

				this .frames    = 0;
				this .startTime = currentTime;
			}
			else
				++ this .frames;
		},
	});

	return RenderingProperties;
});
