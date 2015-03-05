
define ([
	"jquery",
	"cobweb/Basic/X3DBaseNode",
],
function ($, X3DBaseNode)
{
	function BindableList (executionContext)
	{
		X3DBaseNode .call (this, executionContext .getBrowser (), executionContext);

		this .collected = [ ];
		this .array     = [ ];
		this .setup ();
	}

	BindableList .prototype = $.extend (new X3DBaseNode (),
	{
		getBound: function ()
		{
			for (var i = 1; i < this .array .length; ++ i)
			{
				var node = this .array [i];

				if (node .isBound_ .getValue ())
					return node;
			}

			if (this .array .length > 1)
				return this .array [1];

			return this .array [0];
		},
		push: function (node)
		{
			return this .collected .push (node);
		},
		update: function ()
		{
			this .array     = this .collected;
			this .collected = [ ];
		},
	});

	Object .defineProperty (BindableList .prototype, "length",
	{
		get: function () { return this .array .length; },
		enumerable: true,
		configurable: false
	});

	return BindableList;
});