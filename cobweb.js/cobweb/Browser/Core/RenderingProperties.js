
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
		initialize: function ()
		{
			X3DBaseNode .prototype .initialize .call (this);

			this .element   = $("<div/>") .addClass ("renderingProperties") .appendTo (this .getBrowser () .getXML () .find (".canvas"));
			this .enabled   = false;
			this .startTime = 0;
			this .frames    = 0;
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
					browser           = this .getBrowser ();
					layers            = browser .getWorld () .getLayerSet () .getLayers ()
					traverseTime      = 0,
					displayTime       = 0,
					opaqueShapes      = 0,
					transparentShapes = 0;

				var
					prepareEvents = Object .keys (browser .prepareEvents () .getInterests ()) .length,
					sensors       = Object .keys (browser .sensors () .getInterests ()) .length;

				for (var i = 0; i < layers .length; ++ i)
				{
					var layer = layers [i];
					traverseTime      += layer .traverseTime;
					displayTime       += layer .displayTime;
					opaqueShapes      += layer .numOpaqueShapes;
					transparentShapes += layer .numTransparentShapes;
				}

				var routingTime = browser .browserTime - (browser .cameraTime + traverseTime + displayTime);

				var text = "";
				text += "Rendering Properties\n\n";
				text += "Frame rate: " + (this .frames / (currentTime - this .startTime)) .toFixed (2) .toLocaleString () + " fps\n";
				text += "System:     " + browser .systemTime .toFixed (2) .toLocaleString () + " ms" + "\n";
				text += "Browser:    " + browser .browserTime .toFixed (2) .toLocaleString () + " ms" + "\n";
				text += "Routing:    " + routingTime .toFixed (2) .toLocaleString () + " ms" + "\n";
				text += "Camera:     " + browser .cameraTime .toFixed (2) .toLocaleString () + " ms" + "\n";
				text += "Traverse:   " + traverseTime .toFixed (2) .toLocaleString () + " ms" + "\n";
				text += "Display:    " + displayTime .toFixed (2) .toLocaleString () + " ms" + "\n";
				text += "Picking:    " + browser .pickingTime .toFixed (2) .toLocaleString () + " ms" + "\n";
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
