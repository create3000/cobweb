
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Core/X3DPrototypeInstance",
	"cobweb/Execution/X3DExecutionContext",
	"cobweb/Prototype/X3DProtoDeclarationNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DPrototypeInstance,
          X3DExecutionContext,
          X3DProtoDeclarationNode, 
          X3DConstants)
{
	with (Fields)
	{
		var fieldDefinitions = [
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata", new SFNode ()),
		];

		function X3DProtoDeclaration (executionContext)
		{
			this .fieldDefinitions = new FieldDefinitionArray (fieldDefinitions .slice (0));

			X3DExecutionContext     .call (this, executionContext .getBrowser (), executionContext);
			X3DProtoDeclarationNode .call (this, executionContext .getBrowser (), executionContext);

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
			getComponentName: function ()
			{
				return "Titania";
			},
			getContainerField: function ()
			{
				return "proto";
			},
			createInstance: function ()
			{
				return new X3DPrototypeInstance (this .getExecutionContext (), this);
			},
		});

		return X3DProtoDeclaration;
	}
});

