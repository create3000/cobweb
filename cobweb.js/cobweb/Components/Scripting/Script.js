
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Scripting/X3DScriptNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DScriptNode, 
          X3DConstants)
{
	with (Fields)
	{
		function Script (executionContext)
		{
			X3DScriptNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .Script);
		}

		Script .prototype = $.extend (new X3DScriptNode (),
		{
			constructor: Script,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",     new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "url",          new MFString ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "directOutput", new SFBool (false)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "mustEvaluate", new SFBool (false)),
			]),
			getTypeName: function ()
			{
				return "Script";
			},
			getComponentName: function ()
			{
				return "Scripting";
			},
			getContainerField: function ()
			{
				return "children";
			},
		});

		return Script;
	}
});

