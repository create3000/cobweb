
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

	function X3DProtoDeclaration (executionContext)
	{
		X3DProtoDeclarationNode .call (this, executionContext);
		X3DExecutionContext     .call (this, executionContext);

		this .addType (X3DConstants .X3DProtoDeclaration);

		this .addChildren ("loadState", new Fields .SFInt32 (X3DConstants .NOT_STARTED_STATE));
	}

	X3DProtoDeclaration .prototype = $.extend (Object .create (X3DExecutionContext .prototype),
		X3DProtoDeclarationNode .prototype,
	{
		constructor: X3DProtoDeclaration,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata", new Fields .SFNode ()),
		]),
		getTypeName: function ()
		{
			return "PROTO";
		},
		getComponentName: function ()
		{
			return "Cobweb";
		},
		getContainerField: function ()
		{
			return "protos";
		},
		initialize: function ()
		{
			X3DProtoDeclarationNode .prototype .initialize .call (this);

			this .loadState_ = X3DConstants .COMPLETE_STATE;
		},
		getURL: function ()
		{
			return this .getExecutionContext () .getURL ();
		},
		getProtoDeclaration: function ()
		{
			return this;
		},
		checkLoadState: function ()
		{
			return this .loadState_ .getValue ();
		},
	});

	Object .defineProperty (X3DProtoDeclaration .prototype, "name",
	{
		get: function () { return this .getName (); },
		enumerable: true,
		configurable: false
	});

	Object .defineProperty (X3DProtoDeclaration .prototype, "fields",
	{
		get: function () { return this .getFieldDefinitions (); },
		enumerable: true,
		configurable: false
	});

	Object .defineProperty (X3DProtoDeclaration .prototype, "isExternProto",
	{
		get: function () { return false; },
		enumerable: true,
		configurable: false
	});

	return X3DProtoDeclaration;
});

