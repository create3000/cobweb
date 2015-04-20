
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
	}

	X3DEnvironmentalSensorNode .prototype = $.extend (Object .create (X3DSensorNode .prototype),
	{
		constructor: X3DEnvironmentalSensorNode,
		initialize: function ()
		{
			X3DSensorNode .prototype .initialize .call (this);

			this .setCameraObject (true);

			this .getExecutionContext () .isLive_ .addInterest (this, "set_enabled__");
			this .isLive_ .addInterest (this, "set_enabled__");

			this .enabled_ .addInterest (this, "set_enabled__");
			this .size_    .addInterest (this, "set_enabled__");

			this .set_enabled__ ();
		},
		set_enabled__: function ()
		{
			if (this .enabled_ .getValue () && this .isLive_ .getValue () && this .getExecutionContext () .isLive_ .getValue () && ! this .size_. getValue () .equals (Vector3 .Zero))
				this .getBrowser () .sensors () .addInterest (this, "update");

			else
				this .getBrowser () .sensors () .removeInterest (this, "update");
		},
		update: function () { },
	});

	return X3DEnvironmentalSensorNode;
});

