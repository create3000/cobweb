
define ([
	"jquery",
	"cobweb/Fields/SFString",
	"cobweb/Basic/X3DBaseNode",
],
function ($,
          SFString,
          X3DBaseNode)
{
	function Notification (executionContext)
	{
		X3DBaseNode .call (this, executionContext .getBrowser (), executionContext);
	}

	Notification .prototype = $.extend (Object .create (X3DBaseNode .prototype),
	{
		constructor: Notification,
		initialize: function ()
		{
			X3DBaseNode .prototype .initialize .call (this);

			this .addChildren ("string", new SFString ());

			this .element = $("<div/>") .addClass ("notification") .appendTo (this .getBrowser () .getXML () .find (".canvas"));

			this .string_ .addInterest (this, "set_string__");
		},
		set_string__: function ()
		{
			if (this .string_ .length === 0)
				return;

			this .element
				.text (this .string_ .getValue ())
				.stop (true, true)
				.fadeIn ()
				.animate ({"delay":1}, 4000)
				.fadeOut ();
		},
	});

	return Notification;
});
