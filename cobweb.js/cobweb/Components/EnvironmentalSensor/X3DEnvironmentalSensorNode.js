
define ([
	"jquery",
	"cobweb/Components/Core/X3DSensorNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector3",
],
function ($,
          X3DSensorNode, 
          X3DConstants,
          Vector3)
{
	function X3DEnvironmentalSensorNode (browser, executionContext)
	{
		X3DSensorNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DEnvironmentalSensorNode);

		this .traversed = true;
	}

	X3DEnvironmentalSensorNode .prototype = $.extend (Object .create (X3DSensorNode .prototype),
	{
		constructor: X3DEnvironmentalSensorNode,
		initialize: function ()
		{
			X3DSensorNode .prototype .initialize .call (this);

			this .setCameraObject (true);

			this .getExecutionContext () .isLive () .addInterest (this, "set_enabled__");
			this .isLive () .addInterest (this, "set_enabled__");

			this .enabled_        .addInterest (this, "set_enabled__");
			this .size_           .addInterest (this, "set_enabled__");
			this .isCameraObject_ .addInterest (this, "set_enabled__");

			this .set_enabled__ ();
		},
		setTraversed: function (value)
		{
		   if (value)
				this .setCameraObject (true);
			else
				this .setCameraObject (this .traversed);

		   this .traversed = value;
		},
		getTraversed: function ()
		{
		   return this .traversed;
		},
		set_enabled__: function ()
		{
			if (this .getCameraObject () && this .enabled_ .getValue () && this .isLive () .getValue () && this .getExecutionContext () .isLive () .getValue () && ! this .size_. getValue () .equals (Vector3 .Zero))
				this .getBrowser () .sensors () .addInterest (this, "update");
			else
			{
				if (this .isActive_ .getValue ())
				{
					this .isActive_ = false;
					this .exitTime_ = this .getBrowser () .getCurrentTime ();
				}

				this .getBrowser () .sensors () .removeInterest (this, "update");
			}
		},
		update: function () { },
	});

	return X3DEnvironmentalSensorNode;
});

