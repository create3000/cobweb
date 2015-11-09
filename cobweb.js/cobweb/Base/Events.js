
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
				sources: { },
			};
	   },
	   copy: function (event)
	   {
	      if (this .stack .length)
	      {
	         var copy = this .stack .pop ();

				copy .field = event .field;

            $.extend (copy .sources, event .sources);

            return copy;
	      }

	      return {
				field: event .field,
				sources: $.extend ({ }, event .sources),
			};
	   },
		push: function (event)
		{
		   var sources = event .sources;

		   for (var id in sources)
		      delete event .sources [id];

		   this .stack .push (event);
		},
	};

	return Events;
});
