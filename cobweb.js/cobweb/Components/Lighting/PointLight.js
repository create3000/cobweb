
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
	function PointLightContainer (light)
	{
		this .light    = light;
		this .location = light .getBrowser () .getModelViewMatrix () .get () .multVecMatrix (light .location_ .getValue () .copy ());
	}

	PointLightContainer .prototype =
	{
		use: function (gl, shader, i)
		{
			var light = this .light;
		
			gl .uniform1i (shader .lightType [i],             1);
			gl .uniform1i (shader .lightOn [i],               true);
			gl .uniform3f (shader .lightColor [i],            light .color_ .r, light .color_ .g, light .color_ .b);
			gl .uniform1f (shader .lightIntensity [i],        light .intensity_ .getValue ()); // clamp
			gl .uniform1f (shader .lightAmbientIntensity [i], light .ambientIntensity_ .getValue ()); // clamp
			gl .uniform3f (shader .lightAttenuation [i],      light .attenuation_ .x, light .attenuation_ .y, light .attenuation_ .z); // max
			gl .uniform3f (shader .lightLocation [i],         this .location .x, this .location .y, this .location .z);
			gl .uniform1f (shader .lightRadius [i],           light .radius_ .getValue ());

			// For correct results the radius must be transform by the modelViewMatrix. This can only be done in the shader.
			// distanceOfLightToFragmentInLightSpace = |(FragmentPosition - LightPosition) * inverseModelViewMatrixOfLight|
			// distanceOfLightToFragmentInLightSpace can then be compared with radius.
		},
	};

	with (Fields)
	{
		function PointLight (executionContext)
		{
			X3DLightNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .PointLight);
		}

		PointLight .prototype = $.extend (new X3DLightNode (),
		{
			constructor: PointLight,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",         new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "global",           new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "on",               new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "color",            new SFColor (1, 1, 1)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "intensity",        new SFFloat (1)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "ambientIntensity", new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "attenuation",      new SFVec3f (1, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "location",         new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "radius",           new SFFloat (100)),
			]),
			getTypeName: function ()
			{
				return "PointLight";
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
				return new PointLightContainer (this);
			},
		});

		return PointLight;
	}
});

