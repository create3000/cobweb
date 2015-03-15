
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
	function DirectionalLightContainer (light)
	{
		this .light     = light;
		this .direction = light .getBrowser () .getModelViewMatrix () .get () .multDirMatrix (light .direction_ .getValue () .copy ()) .normalize ();
	}

	DirectionalLightContainer .prototype =
	{
		use: function (gl, shader, i)
		{
			gl .uniform1i (shader .lightType [i],             0);
			gl .uniform1i (shader .lightOn [i],               true);
			gl .uniform3f (shader .lightColor [i],            this .light .color_ .r, this .light .color_ .g, this .light .color_ .b);
			gl .uniform1f (shader .lightIntensity [i],        this .light .intensity_ .getValue ()); // clamp
			gl .uniform1f (shader .lightAmbientIntensity [i], this .light .ambientIntensity_ .getValue ()); // clamp
			gl .uniform3f (shader .lightDirection [i],        this .direction .x, this .direction .y, this .direction .z);
			gl .uniform3f (shader .lightAttenuation [i],      1, 0, 0);
		},
	};

	with (Fields)
	{
		function DirectionalLight (executionContext)
		{
			X3DLightNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .DirectionalLight);
		}

		DirectionalLight .prototype = $.extend (new X3DLightNode (),
		{
			constructor: DirectionalLight,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",         new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "global",           new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "on",               new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "color",            new SFColor (1, 1, 1)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "intensity",        new SFFloat (1)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "ambientIntensity", new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "direction",        new SFVec3f (0, 0, -1)),
			]),
			getTypeName: function ()
			{
				return "DirectionalLight";
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
				return new DirectionalLightContainer (this);
			},
		});

		return DirectionalLight;
	}
});

