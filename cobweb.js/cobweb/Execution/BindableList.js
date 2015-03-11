
define ([
	"jquery",
	"cobweb/Basic/X3DBaseNode",
],
function ($, X3DBaseNode)
{
	function equals (lhs, rhs)
	{
		if (lhs .length !== rhs .length)
			return false;

		for (var i = 0; i < lhs .length; ++ i)
		{
			if (lhs [i] !== rhs [i])
				return false
		}

		return true;
	}

	function BindableList (executionContext, layer)
	{
		X3DBaseNode .call (this, executionContext .getBrowser (), executionContext);

		this .layer     = layer;
		this .collected = [ ];
		this .array     = [ ];
		this .setup ();
	}

	BindableList .prototype = $.extend (new X3DBaseNode (),
	{
		get: function ()
		{
			return this .array;
		},
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
			if (! equals (this .collected, this .array))
			{
				for (var i = 0; i < this .array .length; ++ i)
					this .array [i] .set_bind_ .removeInterest (this, "set_bind__", this .array [i]);

				this .array     = this .collected;
				this .collected = [ ];

				for (var i = 0; i < this .array .length; ++ i)
					this .array [i] .set_bind_ .addInterest (this, "set_bind__", this .array [i]);
			}

			this .collected .length = 0;
		},
		set_bind__: function (value, node)
		{
			if (value .getValue ())
				node .bindToLayer (this .layer);

			else
				node .unbindFromLayer (this .layer);
		},
	});

	return BindableList;
});