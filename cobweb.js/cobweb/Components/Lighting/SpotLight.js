
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
	function SpotLightContainer (light)
	{
		this .light     = light;
		this .location  = light .getBrowser () .getModelViewMatrix () .get () .multVecMatrix (light .location_ .getValue () .copy ());
		this .direction = light .getBrowser () .getModelViewMatrix () .get () .multDirMatrix (light .direction_ .getValue () .copy ()) .normalize ();
	}

	SpotLightContainer .prototype =
	{
		use: function (gl, shader, i)
		{
			var light = this .light;
		
			gl .uniform1i (shader .lightType [i],             2);
			gl .uniform1i (shader .lightOn [i],               true);
			gl .uniform3f (shader .lightColor [i],            light .color_ .r, light .color_ .g, light .color_ .b);
			gl .uniform1f (shader .lightIntensity [i],        light .intensity_ .getValue ()); // clamp
			gl .uniform1f (shader .lightAmbientIntensity [i], light .ambientIntensity_ .getValue ()); // clamp
			gl .uniform3f (shader .lightAttenuation [i],      light .attenuation_ .x, light .attenuation_ .y, light .attenuation_ .z); // max
			gl .uniform3f (shader .lightLocation [i],         this .location .x, this .location .y, this .location .z);
			gl .uniform3f (shader .lightDirection [i],        this .direction .x, this .direction .y, this .direction .z);
			gl .uniform1f (shader .lightBeamWidth [i],        light .beamWidth_ .getValue ()); // clamp
			gl .uniform1f (shader .lightCutOffAngle [i],      light .cutOffAngle_ .getValue ()); // clamp
			gl .uniform1f (shader .lightRadius [i],           light .radius_ .getValue ()); // max
		},
	};

	with (Fields)
	{
		function SpotLight (executionContext)
		{
			X3DLightNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .SpotLight);
		}

		SpotLight .prototype = $.extend (Object .create (X3DLightNode .prototype),
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
			getContainer: function ()
			{
				return new SpotLightContainer (this);
			},
		});

		return SpotLight;
	}
});

