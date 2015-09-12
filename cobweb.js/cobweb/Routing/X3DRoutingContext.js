
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
					this .taintedFieldsTemp     = taintedFields;
					this .taintedFields .length = 0;

					for (var i = 0; i < taintedFields .length; i += 2)
					{
						taintedFields [i] .processEvent (taintedFields [i + 1]);
					}
				}
				while (this .taintedFields .length);

				// Process node events
				do
				{
					var taintedNodes = this .taintedNodes;

					// Swap tainted nodes.
					this .taintedNodes         = this .taintedNodesTemp;
					this .taintedNodesTemp     = taintedNodes;
					this .taintedNodes .length = 0;

					for (var i = 0; i < taintedNodes .length; ++ i)
						taintedNodes [i] .processEvents ();
				}
				while (this .taintedNodes .length && ! this .taintedFields .length);

			}
			while (this .taintedFields .length);
		},
	};

	return X3DRoutingContext;
});
