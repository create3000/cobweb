
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Components/Core/X3DNode",
	"cobweb/Components/Core/X3DPrototypeInstance",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DNode,
          X3DPrototypeInstance,
          X3DConstants)
{
"use strict";

	function X3DProtoDeclarationNode (browser, executionContext)
	{
		X3DNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DProtoDeclarationNode);

		this .instances = { };
	}

	X3DProtoDeclarationNode .prototype = $.extend (Object .create (X3DNode .prototype),
	{
		constructor: X3DProtoDeclarationNode,
		hasUserDefinedFields: function ()
		{
			return true;
		},
		createInstance: function (executionContext, setup)
		{
			var instance = new X3DPrototypeInstance (executionContext ? executionContext : this .getExecutionContext (), this);
			
			if (setup === false)
				return instance;

			instance .setup ();

			return new Fields .SFNode (instance);
		},
		addInstance: function (instance)
		{
			this .instances [instance .getId ()] = instance;
		},
		removeInstance: function (instance)
		{
			delete this .instances [instance .getId ()];
		},
		getInstances: function ()
		{
			return this .instances;
		},
	});

	return X3DProtoDeclarationNode;
});
