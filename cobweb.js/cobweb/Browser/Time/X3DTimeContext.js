
define ([
],
function ()
{
	function X3DTimeContext ()
	{
		this .advance ();
	}

	X3DTimeContext .prototype =
	{
		initialize: function ()
		{
		},
		getCurrentTime: function ()
		{
			return this .currentTime;
		},
		advance: function ()
		{
			this .currentTime = Date .now ();		
		},
	};

	return X3DTimeContext;
});
