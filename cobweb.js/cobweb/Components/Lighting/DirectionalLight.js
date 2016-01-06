
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Lighting/X3DLightNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector3",
	"standard/Utility/ObjectCache",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DLightNode,
          X3DConstants,
          Vector3,
          ObjectCache)
{
"use strict";

	var DirectionalLights = ObjectCache (DirectionalLightContainer);
	
	function DirectionalLightContainer (light)
	{
		this .direction = new Vector3 (0, 0, 0);
	
		this .set (light);
	}

	DirectionalLightContainer .prototype =
	{
		constructor: DirectionalLightContainer,
		set: function (light)
		{
			this .color            = light .color_            .getValue ();
			this .intensity        = light .intensity_        .getValue ();
			this .ambientIntensity = light .ambientIntensity_ .getValue ();
	
			light .getBrowser () .getModelViewMatrix () .get () .multDirMatrix (this .direction .assign (light .direction_ .getValue ())) .normalize ();	      
		},
		use: function (gl, shader, i)
		{
			gl .uniform1i (shader .lightType [i],             1);
			gl .uniform3f (shader .lightColor [i],            this .color .r, this .color .g, this .color .b);
			gl .uniform1f (shader .lightIntensity [i],        this .intensity);        // clamp
			gl .uniform1f (shader .lightAmbientIntensity [i], this .ambientIntensity); // clamp
			gl .uniform3f (shader .lightAttenuation [i],      1, 0, 0);
			gl .uniform3f (shader .lightDirection [i],        this .direction .x, this .direction .y, this .direction .z);
		},
		recycle: function ()
		{
		   DirectionalLights .push (this);
		},
	};

	function DirectionalLight (executionContext)
	{
		X3DLightNode .call (this, executionContext);

		this .addType (X3DConstants .DirectionalLight);
	}

	DirectionalLight .prototype = $.extend (Object .create (X3DLightNode .prototype),
	{
		constructor: DirectionalLight,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",         new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "global",           new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "on",               new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "color",            new Fields .SFColor (1, 1, 1)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "intensity",        new Fields .SFFloat (1)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "ambientIntensity", new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "direction",        new Fields .SFVec3f (0, 0, -1)),
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
		getLights: function ()
		{
			return DirectionalLights;
		},
	});

	return DirectionalLight;
});


