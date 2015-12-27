
define (function ()
{
"use strict";

	function X3DShadersContext ()
	{
		this .shaders = { };
	}

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
		addShader: function (shader)
		{
			this .shaders [shader .getId ()] = shader;
			shader .setShading (this .getBrowserOptions () .getShading ());
		},
		removeShader: function (shader)
		{
			delete this .shaders [shader .getId ()];
		},
		getShaders: function ()
		{
			return this .shaders;
		},
	};

	return X3DShadersContext;
});
