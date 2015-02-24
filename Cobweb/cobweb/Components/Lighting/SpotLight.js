
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Lighting/X3DLightNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DLightNode, 
          X3DConstants)
{
	with (Fields)
	{
		function SpotLight (executionContext)
		{
			X3DLightNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .SpotLight);
		}

		SpotLight .prototype = $.extend (new X3DLightNode (),
		{
			constructor: SpotLight,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",         new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "global",           new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "on",               new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "color",            new SFColor (1, 1, 1)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "intensity",        new SFFloat (1)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "ambientIntensity", new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "attenuation",      new SFVec3f (1, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "location",         new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "direction",        new SFVec3f (0, 0, -1)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "radius",           new SFFloat (100)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "beamWidth",        new SFFloat (0.785398)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "cutOffAngle",      new SFFloat (1.5708)),
			]),
			getTypeName: function ()
			{
				return "SpotLight";
			},
			getComponentName: function ()
			{
				return "Lighting";
			},
			getContainerField: function ()
			{
				return "children";
			},
		});

		return SpotLight;
	}
});

