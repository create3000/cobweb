
define ([
	"jquery",
	"cobweb/Components/Core/X3DSensorNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DSensorNode, 
          X3DConstants)
{
	function X3DKeyDeviceSensorNode (browser, executionContext)
	{
		X3DSensorNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DKeyDeviceSensorNode);
	}

	X3DKeyDeviceSensorNode .prototype = $.extend (Object .create (X3DSensorNode .prototype),
	{
		constructor: X3DKeyDeviceSensorNode,
		initialize: function ()
		{
			X3DSensorNode .prototype .initialize .call (this);

			this .getExecutionContext () .isLive () .addInterest (this, "set_live__");
			this .isLive ()                         .addInterest (this, "set_live__");

			this .set_live__ ();
		},
		set_live__: function ()
		{
			if (this .getExecutionContext () .isLive ().getValue () && this .isLive () .getValue ())
			{
				this .enabled_ .addInterest (this, "set_enabled__");

				if (this .enabled_ .getValue ())
					this .enable ();
			}
			else
			{
				this .enabled_ .removeInterest (this, "set_enabled__");

				if (this .enabled_ .getValue ())
					this .disable ();
			}
		},
		set_enabled__: function ()
		{
			if (this .enabled_ .getValue ())
				this .enable ();

			else
				this .disable ();
		},
		enable: function ()
		{
			if (this .isActive_ .getValue ())
				return;

			var keyDeviceSensorNode = this .getBrowser () .getKeyDeviceSensorNode ();

			if (keyDeviceSensorNode)
			{
				keyDeviceSensorNode .enabled_  = false;
				keyDeviceSensorNode .isActive_ = false;
			}

			this .getBrowser () .setKeyDeviceSensorNode (this);

			this .isActive_ = true;
		},
		disable: function ()
		{
			if (! this .isActive_ .getValue ())
				return;

			this .getBrowser () .setKeyDeviceSensorNode (null);

			this .release ();

			this .isActive_ = false;
		},
		keydown: function () { },
		keyup: function () { },
		release: function () { },
	});

	return X3DKeyDeviceSensorNode;
});

