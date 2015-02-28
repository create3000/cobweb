
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Shaders/X3DShaderNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DShaderNode, 
          X3DConstants)
{
	with (Fields)
	{
		function ProgramShader (executionContext)
		{
			X3DShaderNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .ProgramShader);
		}

		ProgramShader .prototype = $.extend (new X3DShaderNode (),
		{
			constructor: ProgramShader,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",   new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "activate",   new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "isSelected", new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "isValid",    new SFBool ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "language",   new SFString ("")),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "programs",   new MFNode ()),
			]),
			getTypeName: function ()
			{
				return "ProgramShader";
			},
			getComponentName: function ()
			{
				return "Shaders";
			},
			getContainerField: function ()
			{
				return "shaders";
			},
		});

		return ProgramShader;
	}
});

