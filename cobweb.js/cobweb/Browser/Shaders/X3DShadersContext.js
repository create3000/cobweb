
define (function ()
{
	function X3DShadersContext () { }

	X3DShadersContext .prototype =
	{
		initialize: function () { },
		getShadingLanguageVersion: function ()
		{
			return this .getContext () .getParameter (this .getContext () .SHADING_LANGUAGE_VERSION);
		},
		getMaxVertexUniformVectors: function ()
		{
			return this .getContext () .getParameter (this .getContext () .MAX_VERTEX_UNIFORM_VECTORS);
		},
		getMaxFragmentUniformVectors: function ()
		{
			return this .getContext () .getParameter (this .getContext () .MAX_FRAGMENT_UNIFORM_VECTORS);
		},
		getMaxVertexAttribs: function ()
		{
			return this .getContext () .getParameter (this .getContext () .MAX_VERTEX_ATTRIBS);
		},
	};

	return X3DShadersContext;
});
