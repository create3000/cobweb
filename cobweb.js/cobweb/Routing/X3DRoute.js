
define ([
	"jquery",
	"cobweb/Basic/X3DBaseNode"
],
function ($, X3DBaseNode)
{
"use strict";

	function X3DRoute (/* executionContext, */ sourceNode, sourceField, destinationNode, destinationField)
	{
		//X3DBaseNode .call (this, executionContext);
		
		this .sourceNode        = sourceNode;
		this .sourceField_      = sourceField;
		this .destinationNode   = destinationNode;
		this .destinationField_ = destinationField;

		//if (! (this .getExecutionContext () instanceof X3DProtoDeclaration))
			sourceField .addFieldInterest (destinationField);

		Object .preventExtensions (this);
		Object .freeze (this);
		Object .seal (this);
	}

	X3DRoute .prototype =
	{
		disconnect: function ()
		{
			this .sourceField_ .removeFieldInterest (this .destinationField_);
		},
		toString: function ()
		{
			return Object .prototype .toString (this);
		},
	};

	Object .defineProperty (X3DRoute .prototype, "sourceField",
	{
		get: function ()
		{
			return this .sourceField_ .getName ();
		},
		enumerable: true,
		configurable: false
	});

	Object .defineProperty (X3DRoute .prototype, "destinationField",
	{
		get: function ()
		{
			return this .destinationField_ .getName ();
		},
		enumerable: true,
		configurable: false
	});

	return X3DRoute;
});