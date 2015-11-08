
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Execution/X3DExecutionContext",
	"cobweb/Prototype/X3DProtoDeclarationNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DExecutionContext,
          X3DProtoDeclarationNode, 
          X3DConstants)
{
"use strict";

	var fieldDefinitions = [
		new X3DFieldDefinition (X3DConstants .inputOutput, "metadata", new Fields .SFNode ()),
	];

	function X3DProtoDeclaration (executionContext)
	{
		this .fieldDefinitions = new FieldDefinitionArray (fieldDefinitions .slice (0));

		X3DProtoDeclarationNode .call (this, executionContext .getBrowser (), executionContext);
		X3DExecutionContext     .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .X3DProtoDeclaration);
	}

	X3DProtoDeclaration .prototype = $.extend (Object .create (X3DExecutionContext .prototype),
		X3DProtoDeclarationNode .prototype,
	{
		constructor: X3DProtoDeclaration,
		getTypeName: function ()
		{
			return "PROTO";
		},
		/*
		getComponentName: function ()
		{
			return "Cobweb";
		},
		getContainerField: function ()
		{
			return "protos";
		},
		*/
		isExternProto: function ()
		{
			return false;
		},
		getWorldURL: function ()
		{
			return this .getExecutionContext () .getWorldURL ();
		},
	});

	return X3DProtoDeclaration;
});

