
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DBaseNode",
],
function ($,
          Fields,
          X3DBaseNode)
{
"use strict";

	function X3DRoute (/* executionContext, */ sourceNode, sourceField, destinationNode, destinationField)
	{
		//X3DBaseNode .call (this, executionContext);
		
		this ._sourceNode       = sourceNode;
		this ._sourceField      = sourceField;
		this ._destinationNode  = destinationNode;
		this ._destinationField = destinationField;

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
			this ._sourceField .removeFieldInterest (this ._destinationField);
		},
		toString: function ()
		{
			return Object .prototype .toString (this);
		},
	};

	Object .defineProperty (X3DRoute .prototype, "sourceNode",
	{
		get: function ()
		{
			return new Fields .SFNode (this ._sourceNode);
		},
		enumerable: true,
		configurable: false
	});

	Object .defineProperty (X3DRoute .prototype, "sourceField",
	{
		get: function ()
		{
			return this ._sourceField .getName ();
		},
		enumerable: true,
		configurable: false
	});

	Object .defineProperty (X3DRoute .prototype, "destinationNode",
	{
		get: function ()
		{
			return new Fields .SFNode (this ._destinationNode);
		},
		enumerable: true,
		configurable: false
	});

	Object .defineProperty (X3DRoute .prototype, "destinationField",
	{
		get: function ()
		{
			return this ._destinationField .getName ();
		},
		enumerable: true,
		configurable: false
	});

	return X3DRoute;
});

