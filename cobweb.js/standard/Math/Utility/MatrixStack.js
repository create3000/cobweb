
define ([
	"jquery",
],
function ($)
{
	function MatrixStack (Type)
	{
		return $.extend ([ new Type () ],
		{
			top: 0,
			set: function (matrix)
			{
				this [this .top] .assign (matrix);
			},
			get: function (matrix)
			{
				return this [this .top];
			},
			push: function ()
			{
				var top = ++ this .top;
			
				if (top < this .length)
					this [top] .assign (this [top - 1]);
				else
					this [top] = this [top - 1] .copy ();
			},
			pop: function ()
			{
				-- this .top;
			},
			identity: function ()
			{
				this [this .top] .identity ();
			},
			multLeft: function (matrix)
			{
				this [this .top] .multLeft (matrix);
			},
		});
	}

	return MatrixStack;
});
