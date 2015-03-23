
define ([
],
function ()
{
	function X3DScriptingContext ()
	{
		this .scripts = [ this ];
	}

	X3DScriptingContext .prototype =
	{
		initialize: function ()
		{
		},
		getScriptStack: function ()
		{
			return this .scripts;
		}
	};

	return X3DScriptingContext;
});
