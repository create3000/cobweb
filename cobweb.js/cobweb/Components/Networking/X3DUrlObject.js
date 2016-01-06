
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DConstants)
{
"use strict";

	function X3DUrlObject (executionContext)
	{
		this .addType (X3DConstants .X3DUrlObject);
		
		this .addChildren ("loadState", new Fields .SFInt32 (X3DConstants .NOT_STARTED_STATE));
	}

	X3DUrlObject .prototype =
	{
		constructor: X3DUrlObject,
		initialize: function ()
		{
		},
		setLoadState: function (value, notify)
		{
			if (this .hasOwnProperty ("loadId"))
			{
				this .getBrowser () .removeLoadCount (this .loadId);
				
				delete this .loadId;
			}

			if (notify !== false && value === X3DConstants .IN_PROGRESS_STATE)
				this .loadId = this .getBrowser () .addLoadCount ();

			this .loadState_ = value;
		},
		checkLoadState: function ()
		{
			return this .loadState_ .getValue ();
		},
	};

	return X3DUrlObject;
});


