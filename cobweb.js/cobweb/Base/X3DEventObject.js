
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

	X3DEventObject .prototype = $.extend (new X3DChildObject (),
	{
		constructor: X3DEventObject,
		extendedEventHandling: true,
		getBrowser: function ()
		{
			return this .browser;
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

			if (! this .getTainted ())
			{
				if (field .isInput () || (this .extendedEventHandling && ! field .isOutput ()))
				{
					this .setTainted (true);
					this .getBrowser () .addTaintedNode (this);
				}
			}
		},
		addNodeEvent: function ()
		{
			if (! this .getTainted ())
			{
				this .setTainted (true);
				this .getBrowser () .addTaintedNode (this);
			}
		},
		eventsProcessed: function ()
		{
			this .setTainted (false);
			this .processInterests ();
		},
	});

	return X3DEventObject;
});
