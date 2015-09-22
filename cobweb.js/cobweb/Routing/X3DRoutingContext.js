
define ([
],
function ()
{
	function X3DRoutingContext ()
	{
		this .taintedFields     = [ ];
		this .taintedFieldsTemp = [ ];
		this .taintedNodes      = [ ];
		this .taintedNodesTemp  = [ ];
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
				// Process field events
				do
				{
					var taintedFields = this .taintedFields;

					// Swap tainted fields.
					this .taintedFields         = this .taintedFieldsTemp;
					this .taintedFields .length = 0;

					for (var i = 0, length = taintedFields .length; i < length; i += 2)
						taintedFields [i] .processEvent (taintedFields [i + 1]);

					// Don't know why this must be done after the for loop, otherwise a fatal error could be thrown.
					this .taintedFieldsTemp = taintedFields;
				}
				while (this .taintedFields .length);

				// Process node events
				do
				{
					var taintedNodes = this .taintedNodes;

					// Swap tainted nodes.
					this .taintedNodes         = this .taintedNodesTemp;
					this .taintedNodes .length = 0;

					for (var i = 0, length = taintedNodes .length; i < length; ++ i)
						taintedNodes [i] .processEvents ();
					
					// Don't know why this must be done after the for loop, otherwise a fatal error could be thrown.
					this .taintedNodesTemp = taintedNodes;
				}
				while (! this .taintedFields .length && this .taintedNodes .length);
			}
			while (this .taintedFields .length);
		},
	};

	return X3DRoutingContext;
});
