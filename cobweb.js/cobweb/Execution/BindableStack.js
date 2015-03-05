
define ([
	"jquery",
	"cobweb/Basic/X3DBaseNode",
],
function ($, X3DBaseNode)
{
	function BindableStack (executionContext, bottom)
	{
		X3DBaseNode .call (this, executionContext .getBrowser (), executionContext);

		this .array = [ bottom ];
		this .setup ();
	}

	BindableStack .prototype = $.extend (new X3DBaseNode (),
	{
		top: function ()
		{
			return this .array [this .array .length - 1];
		},
		forcePush: function (node)
		{
			this .array .push (node);
			node .set_bind_ .setValue (true);
			node .isBound_ .setValue (true);
		},
	});

	Object .defineProperty (BindableStack .prototype, "length",
	{
		get: function () { return this .array .length; },
		enumerable: true,
		configurable: false
	});

	return BindableStack;
});