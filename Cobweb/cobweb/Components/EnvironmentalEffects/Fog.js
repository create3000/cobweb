
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Core/X3DBindableNode",
	"cobweb/Components/EnvironmentalEffects/X3DFogObject",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DBindableNode, 
          X3DFogObject, 
          X3DConstants)
{
	with (Fields)
	{
		function Fog (executionContext)
		{
			X3DBindableNode .call (this, executionContext .getBrowser (), executionContext);
			X3DFogObject .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .Fog);
		}

		Fog .prototype = $.extend (new X3DBindableNode (),new X3DFogObject (),
		{
			constructor: Fog,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",        new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,   "set_bind",        new SFBool ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "fogType",         new SFString ("LINEAR")),
				new X3DFieldDefinition (X3DConstants .inputOutput, "color",           new SFColor (1, 1, 1)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "visibilityRange", new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "isBound",         new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "bindTime",        new SFTime ()),
			]),
			getTypeName: function ()
			{
				return "Fog";
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

		return Fog;
	}
});

