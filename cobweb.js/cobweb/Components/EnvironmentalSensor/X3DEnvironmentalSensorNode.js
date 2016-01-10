
define ("cobweb/Components/EnvironmentalSensor/X3DEnvironmentalSensorNode",
[
	"jquery",
	"cobweb/Fields",
	"cobweb/Components/Core/X3DSensorNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector3",
],
function ($,
          Fields,
          X3DSensorNode, 
          X3DConstants,
          Vector3)
{
"use strict";

	function X3DEnvironmentalSensorNode (executionContext)
	{
		X3DSensorNode .call (this, executionContext);

		this .addType (X3DConstants .X3DEnvironmentalSensorNode);

		this .addChildren ("traversed", new Fields .SFBool (true));

		this .currentTraversed = true;
	}

	X3DEnvironmentalSensorNode .prototype = $.extend (Object .create (X3DSensorNode .prototype),
	{
		constructor: X3DEnvironmentalSensorNode,
		initialize: function ()
		{
			X3DSensorNode .prototype .initialize .call (this);

			this .getExecutionContext () .isLive () .addInterest (this, "set_live__");
			this .isLive () .addInterest (this, "set_live__");

			this .enabled_   .addInterest (this, "set_live__");
			this .size_      .addInterest (this, "set_live__");
			this .traversed_ .addInterest (this, "set_live__");

			this .set_live__ ();
		},
		setTraversed: function (value)
		{
		   if (value)
			{
				if (this .traversed_ .getValue () === false)
					this .traversed_ = true;
			}
			else
			{
				if (this .currentTraversed !== this .traversed_ .getValue ())
					this .traversed_ = this .currentTraversed;
			}

		   this .currentTraversed = value;
		},
		getTraversed: function ()
		{
		   return this .currentTraversed;
		},
		set_live__: function ()
		{
			if (this .traversed_ .getValue () && this .enabled_ .getValue () && this .isLive () .getValue () && this .getExecutionContext () .isLive () .getValue () && ! this .size_. getValue () .equals (Vector3 .Zero))
			{
				this .getBrowser () .sensors () .addInterest (this, "update");
			}
			else
			{
				this .getBrowser () .sensors () .removeInterest (this, "update");
				
				if (this .isActive_ .getValue ())
				{
					this .isActive_ = false;
					this .exitTime_ = this .getBrowser () .getCurrentTime ();
				}
			}
		},
		update: function () { },
	});

	return X3DEnvironmentalSensorNode;
});


