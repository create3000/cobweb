
define ([
	"jquery",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DConstants)
{
	function X3DProgrammableShaderObject (browser, executionContext)
	{
		this .addType (X3DConstants .X3DProgrammableShaderObject);
	}

	X3DProgrammableShaderObject .prototype =
	{
		constructor: X3DProgrammableShaderObject,
		initialize: function () { },
		hasUserDefinedFields: function ()
		{
			return true;
		},
	};

	return X3DProgrammableShaderObject;
});

