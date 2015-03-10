
define ([
	"jquery",
],
function ($)
{
	var push = Array .prototype .push;

	function MatrixStack (Type)
	{
		return $.extend ([ new Type () ],
		{
			set: function (matrix)
			{
				this [this .length - 1] .assign (matrix);
			},
			get: function (matrix)
			{
				return this [this .length - 1];
			},
			push: function ()
			{
				push .call (this, this [this .length - 1] .copy ());
			},
			identity: function ()
			{
				this [this .length - 1] .identity ();
			},
			multLeft: function (matrix)
			{
				this [this .length - 1] .multLeft (matrix);
			},
		});
	}

	return MatrixStack;
});
