
define ([
	"jquery",
	"cobweb/Browser/PointingDeviceSensor/PointingDevice",
	"cobweb/Bits/TraverseType",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Geometry/Line3",
	"standard/Math/Geometry/ViewVolume",
	"standard/Math/Numbers/Vector2",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Matrix4",
	"standard/Math/Algorithms/MergeSort",
	"standard/Math/Algorithm",
],
function ($,
          PointingDevice,
          TraverseType,
          X3DConstants,
          Line3,
          ViewVolume,
          Vector2,
          Vector3,
          Matrix4,
          MergeSort,
          Algorithm)
{
	var line = new Line3 (new Vector3 (0, 0, 0), new Vector3 (0, 0, 0));

	function X3DPointingDeviceSensorContext ()
	{
	}

	X3DPointingDeviceSensorContext .prototype =
	{
		initialize: function ()
		{
			this .getCanvas () .attr ("tabindex", 8803068);
			this .setCursor ("DEFAULT");
			
			this .pointingDevice = new PointingDevice (this);
			this .pointingDevice .setup ();

			this .pointer        = new Vector2 (0, 0);
			this .hits           = [ ];
			this .enabledSensors = [{ }];
			this .selectedLayer  = null;
			this .overSensors    = { };
			this .activeSensors  = { };

			this .hitPointSorter = new MergeSort (this .hits, function (lhs, rhs) { return lhs .intersection .point .z < rhs .intersection .point .z; });
			this .layerSorter    = new MergeSort (this .hits, function (lhs, rhs) { return lhs .layerNumber < rhs .layerNumber; });

			this .pickingTime = 0;
		},
		setCursor: function (value)
		{
			this .cursorType = value;

			var div = this .getBrowser () .getXML () .find (".cobweb-surface");

			switch (value)
			{
				case "HAND": // Hand with finger
					div .css ("cursor", "pointer");
					break;
				case "MOVE": // Hand grabed something
					div .css ("cursor", "move");
					break;
				case "CROSSHAIR":
					div .css ("cursor", "crosshair");
					break;
				default:
				{
					if (this .loadCount_ .getValue ())
						div .css ("cursor", "wait");
					else if (this .pointingDevice && this .pointingDevice .isOver)
						div .css ("cursor", "pointer");
					else
						div .css ("cursor", "default");
					break;
				}
			}
		},
		getCursor: function ()
		{
			return this .cursorType;
		},
		isPointerInRectangle: function (rectangle)
		{
			return this .pointer .x > rectangle .x &&
			       this .pointer .x < rectangle .x + rectangle .z &&
			       this .pointer .y > rectangle .y &&
			       this .pointer .y < rectangle .y + rectangle .w;
		},
		setLayerNumber: function (value)
		{
			this .layerNumber = value;
		},
		getSelectedLayer: function ()
		{
			return this .selectedLayer;
		},
		setHitRay: function (viewport)
		{
			try
			{
				return this .hitRay = ViewVolume .unProjectLine (this .pointer .x, this .pointer .y, Matrix4 .Identity, this .getProjectionMatrix (), viewport);
			}
			catch (error)
			{
				return this .hitRay = line;
			}
		},
		getHitRay: function ()
		{
			return this .hitRay;
		},
		getSensors: function ()
		{
			return this .enabledSensors;
		},
		addHit: function (intersection, layer)
		{
			this .hits .push ({
				pointer:         this .pointer,
				hitRay:          this .hitRay,
				intersection:    intersection,
				sensors:         this .enabledSensors [this .enabledSensors .length - 1],
				layer:           layer,
				layerNumber:     this .layerNumber,
			});
		},
		buttonPressEvent: function (x, y)
		{
			this .touch (x, y);

			if (this .hits .length === 0)
				return false;

			var nearestHit = this .hits [this .hits .length - 1];

			this .selectedLayer = nearestHit .layer;
			this .activeSensors = nearestHit .sensors;

			for (var key in this .activeSensors)
				this .activeSensors [key] .set_active__ (nearestHit, true);

			return ! $.isEmptyObject (nearestHit .sensors);
		},
		buttonReleaseEvent: function ()
		{
			this .selectedLayer = null;

			for (var key in this .activeSensors)
				this .activeSensors [key] .set_active__ (null, false);

			this .activeSensors = { };

			// Selection

			return true;
		},
		motionNotifyEvent: function (x, y)
		{
			this .touch (x, y);

			this .motion ();

			return this .hits .length && ! $.isEmptyObject (this .hits [this .hits .length - 1] .sensors);
		},
		leaveNotifyEvent: function ()
		{
		},
		touch: function (x, y)
		{
			var t0 = performance .now ();
		
			this .pointer .set (x, y);

			// Clear hits.

			this .hits .length = 0;

			// Pick.
			
			this .getWorld () .traverse (TraverseType .POINTER);

			// Picking end.

			this .hitPointSorter .sort (0, this .hits .length);
			this .layerSorter    .sort (0, this .hits .length);

			this .addBrowserEvent ();
			this .pickingTime = performance .now () - t0;
		},
		motion: function ()
		{
			if (this .hits .length)
				var nearestHit = this .hits [this .hits .length - 1];
			else
			{
				var hitRay = this .selectedLayer ? this .selectedLayer .getHitRay () : line;

				var nearestHit = {
					pointer:         this .pointer,
					modelViewMatrix: new Matrix4 (),
					hitRay:          hitRay,
					intersection:    null,
					sensors:         { },
					shape:           null,
					layer:           null,
					layerNumber:     0,
				};
			}

			// Set isOver to FALSE for appropriate nodes

			if (this .hits .length)
				var difference = Algorithm .set_difference (this .overSensors, nearestHit .sensors, { });

			else
				var difference = $.extend ({ }, this .overSensors);

			for (var key in difference)
				difference [key] .set_over__ (nearestHit, false);

			// Set isOver to TRUE for appropriate nodes

			if (this .hits .length)
			{
				this .overSensors = nearestHit .sensors;

				for (var key in this .overSensors)
					this .overSensors [key] .set_over__ (nearestHit, true);
			}
			else
				this .overSensors = { };

			// Forward motion event to active drag sensor nodes

			for (var key in this .activeSensors)
			{
				var dragSensorNode = this .activeSensors [key];

				if (dragSensorNode .getType () .indexOf (X3DConstants .X3DDragSensorNode) === -1)
					continue;

				dragSensorNode .set_motion__ (nearestHit);
			}
		},
	};

	return X3DPointingDeviceSensorContext;
});
