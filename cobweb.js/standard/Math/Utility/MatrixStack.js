
define ([
	"jquery",
],
function ($)
{
	function MatrixStack (Type)
	{
		return $.extend ([ new Type () ],
		{
			last: 0,
			set: function (matrix)
			{
				this [this .last] .assign (matrix);
			},
			get: function (matrix)
			{
				return this [this .last];
			},
			push: function ()
			{
				++ this .last;

				if (this .last < this .length)
					this [this .last] .assign (this [this .last - 1]);
				else
					this [this .last] = this [this .last - 1] .copy ();
			},
			pop: function ()
			{
				-- this .last;
			},
			identity: function ()
			{
				this [this .last] .identity ();
			},
			multLeft: function (matrix)
			{
				this [this .last] .multLeft (matrix);
			},
		});
	}

	return MatrixStack;
});
