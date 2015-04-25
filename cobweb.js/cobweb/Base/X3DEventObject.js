
define ([
	"jquery",
	"cobweb/Base/X3DChildObject",
],
function ($, X3DChildObject)
{
	function Event (field, sources)
	{
		return {
			field: field,
			sources: sources,
			copy: function ()
			{
				return Event (this .field, $.extend ({  }, this .sources));
			},
		};
	}

	function X3DEventObject (browser)
	{
		X3DChildObject .call (this);

		this .browser = browser;
	}

	X3DEventObject .prototype = $.extend (Object .create (X3DChildObject .prototype),
	{
		constructor: X3DEventObject,
		getBrowser: function ()
		{
			return this .browser;
		},
		getExtendedEventHandling: function ()
		{
			return true;
		},
		addEvent: function (field)
		{
			if (field .getTainted ())
				return;

			field .setTainted (true);

			this .addEventObject (field, Event (field, { }));
		},
		addEventObject: function (field, event)
		{
			this .getBrowser () .addBrowserEvent ();

			// Register for processEvent

			this .getBrowser () .addTaintedField (field, event);

			// Register for eventsProcessed

			if (this .getTainted ())
			   return;

			if (field .isInput () || (this .getExtendedEventHandling () && ! field .isOutput ()))
			{
				this .setTainted (true);
				this .getBrowser () .addTaintedNode (this);
			}
		},
		addNodeEvent: function ()
		{
			if (this .getTainted ())
			   return;

			this .setTainted (true);
			this .getBrowser () .addTaintedNode (this);
		},
		eventsProcessed: function ()
		{
			this .setTainted (false);
			this .processInterests ();
		},
	});

	return X3DEventObject;
});
