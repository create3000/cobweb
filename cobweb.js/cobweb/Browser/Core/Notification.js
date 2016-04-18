
define ([
	"jquery",
	"cobweb/Fields/SFString",
	"cobweb/Basic/X3DBaseNode",
],
function ($,
          SFString,
          X3DBaseNode)
{
"use strict";
	
	$.fn.textWidth = function (string)
	{
		var children = $(this) .children ();
		var html     = $(this) .html ();
		var span     = '<span>' + html + '</span>';
		$(this) .html (span);
		var width = $(this) .find ('span:first') .width ();
		$(this) .empty ();
		$(this) .append (children);
		return width;
	};

   function Notification (executionContext)
	{
		X3DBaseNode .call (this, executionContext);
	}

	Notification .prototype = $.extend (Object .create (X3DBaseNode .prototype),
	{
		constructor: Notification,
		initialize: function ()
		{
			X3DBaseNode .prototype .initialize .call (this);

			this .addChildren ("string", new SFString ());

			this .element = $("<div/>")
				.addClass ("cobweb-notification")
				.appendTo (this .getBrowser () .getElement () .find (".cobweb-surface"))
				.animate ({ width: 0 });

			$("<span/>") .appendTo (this .element);

			this .string_ .addInterest (this, "set_string__");
		},
		set_string__: function ()
		{
			if (this .string_ .length === 0)
				return;

			//this .element
			//	.text (this .string_ .getValue ())
			//	.stop (true, true)
			//	.fadeIn ()
			//	.animate ({ "delay": 1 }, 4000)
			//	.fadeOut ();

			this .element .children () .text (this .string_ .getValue ());

			this .element 
				.stop (true, true)
				.fadeIn (0)
				.animate ({ width: this .element .textWidth () })
				.animate ({ "delay": 1 }, 5000)
				.animate ({ width: 0 })
				.fadeOut (0);
		},
	});

	return Notification;
});
