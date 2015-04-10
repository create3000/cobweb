
define ([
	"jquery",
	"cobweb/Browser/PointingDeviceSensor/PointingDevice",
	"cobweb/Bits/TraverseType",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Geometry/ViewVolume",
	"standard/Math/Numbers/Vector2",
	"standard/Math/Numbers/Matrix4",
	"standard/Math/Algorithms/MergeSort",
],
function (jquery,
          PointingDevice,
          TraverseType,
          X3DConstants,
          ViewVolume,
          Vector2,
          Matrix4,
          MergeSort)
{
	function set_difference (lhs, rhs, result)
	{
		for (var key in lhs)
		{
			if (key in rhs)
				continue;

			result [key] = lhs [key];
		}

		return result;
	}

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

			var div = this .getBrowser () .getXML () .find (".canvas");

			switch (value)
			{
				case "HAND":
					div .css ("cursor", "pointer");
					break;
				case "MOVE":
					div .css ("cursor", "move");
					break;
				case "CROSSHAIR":
					div .css ("cursor", "crosshair");
					break;
				default:
				{
					if (this .loadCount_ .getValue ())
						div .css ("cursor", "wait");
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
		buttonPressEvent: function (x, y)
		{
			this .touch (x, y);

			if (this .hits .length === 0)
				return false;

			var nearestHit = this .hits [this .hits .length - 1];

			if (nearestHit .sensors .length === 0)
				return false;

			this .selectedLayer = nearestHit .layer;
			this .activeSensors = nearestHit .sensors;

			for (var key in this .activeSensors)
				this .activeSensors [key] .set_active__ (nearestHit, true);

			return true;
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
				this .hitRay = ViewVolume .unProjectLine (this .pointer .x, this .pointer .y, Matrix4 .Identity, this .getProjectionMatrix (), viewport);
			}
			catch (error)
			{
				this .hitRay = new Line3 (new Vector3 (0, 0, 0), new Vector3 (0, 0, 0));
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
		addHit: function (modelViewMatrix, intersection, shape, layer)
		{
			this .hits .push ({
				pointer:         this .pointer,
				modelViewMatrix: modelViewMatrix,
				hitRay:          this .hitRay,
				intersection:    intersection,
				sensors:         this .enabledSensors [this .enabledSensors .length - 1],
				shape:           shape,
				layer:           layer,
				layerNumber:     this .layerNumber,
			});
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
				var nearestHit = {
					pointer:         this .pointer,
					modelViewMatrix: new Matrix4 (),
					hitRay:          this .hitRay, // XXX: must be ray from selected layer
					intersection:    null,
					sensors:         { },
					shape:           null,
					layer:           null,
					layerNumber:     0,
				};
			}

			// Set isOver to FALSE for appropriate nodes

			if (this .hits .length)
				var difference = set_difference (this .overSensors, nearestHit .sensors, { });

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
