
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
		isExternal: function ()
		{
		   return this .scripts .length === 1;
		},
		getScriptStack: function ()
		{
			return this .scripts;
		}
	};

	return X3DScriptingContext;
});
