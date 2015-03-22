
define ([
],
function ()
{
	function X3DRoutingContext ()
	{
		this .taintedFields = [ ];
		this .taintedNodes  = [ ];
	}

	X3DRoutingContext .prototype =
	{
		constructor: X3DRoutingContext,
		initialize: function () { },
		addTaintedField: function (field, event)
		{
			this .taintedFields .push (field, event);
		},
		addTaintedNode: function (node)
		{
			this .taintedNodes .push (node);
		},
		processEvents: function ()
		{
			do
			{
				do
				{
					var taintedFields = this .taintedFields;
					this .taintedFields = [ ];

					for (var i = 0; i < taintedFields .length; i += 2)
					{
						taintedFields [i] .processEvent (taintedFields [i + 1]);
					}
				}
				while (this .taintedFields .length);

				this .eventsProcessed ();
			}
			while (this .taintedFields .length);
		},
		eventsProcessed: function ()
		{
			do
			{
				var taintedNodes = this .taintedNodes;
				this .taintedNodes = [ ];

				for (var i = 0; i < taintedNodes .length; ++ i)
					taintedNodes [i] .eventsProcessed ();
			}
			while (this .taintedNodes .length && ! this .taintedFields .length);
		},
	};

	return X3DRoutingContext;
});
