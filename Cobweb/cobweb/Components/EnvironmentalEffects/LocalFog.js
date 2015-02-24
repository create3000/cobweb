
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Core/X3DChildNode",
	"cobweb/Components/EnvironmentalEffects/X3DFogObject",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DChildNode, 
          X3DFogObject, 
          X3DConstants)
{
	with (Fields)
	{
		function LocalFog (executionContext)
		{
			X3DChildNode .call (this, executionContext .getBrowser (), executionContext);
			X3DFogObject .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .LocalFog);
		}

		LocalFog .prototype = $.extend (new X3DChildNode (),new X3DFogObject (),
		{
			constructor: LocalFog,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",        new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "enabled",         new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "fogType",         new SFString ("LINEAR")),
				new X3DFieldDefinition (X3DConstants .inputOutput, "color",           new SFColor (1, 1, 1)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "visibilityRange", new SFFloat ()),
			]),
			getTypeName: function ()
			{
				return "LocalFog";
			},
			getComponentName: function ()
			{
				return "EnvironmentalEffects";
			},
			getContainerField: function ()
			{
				return "children";
			},
		});

		return LocalFog;
	}
});

