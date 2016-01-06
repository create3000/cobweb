
define ([
	"jquery",
],
function ($)
{
"use strict";

	var Events =
	{
		stack: [ ],
		create: function (field)
		{
			if (this .stack .length)
			{
				var event = this .stack .pop ();

				event .field = field;

				return event;
			}
            
			return {
				field: field,
				sources: { }, // Sparse arrays are much more expensive than plain objects!
			};
		},
		copy: function (event)
	   {
			if (this .stack .length)
			{
				var copy = this .stack .pop ();

				copy .field = event .field;
	      }
			else
			{
				var copy = {
					field: event .field,
					sources: { },
				};
			}

			var
				fromSources = event .sources,
				toSources   = copy .sources;

			for (var id in fromSources)
				toSources [id] = fromSources [id];

			return copy;
	   },
		push: function (event)
		{
		   var sources = event .sources;

		   for (var id in sources)
		      delete sources [id];

		   this .stack .push (event);
		},
	};

	return Events;
});
