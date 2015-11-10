
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

	var SpotLights = ObjectCache (SpotLightContainer);
	
	function SpotLightContainer (light)
	{
		this .location  = new Vector3 (0, 0, 0);
		this .direction = new Vector3 (0, 0, 0);

	   this .set (light);
	}

	SpotLightContainer .prototype =
	{
	   set: function (light)
	   {
			var modelViewMatrix = light .getBrowser () .getModelViewMatrix () .get ();
	
			this .color            = light .color_ .getValue ();
			this .intensity        = light .intensity_ .getValue ();
			this .ambientIntensity = light .ambientIntensity_ .getValue ();
			this .attenuation      = light .attenuation_ .getValue ();
			this .beamWidth        = light .beamWidth_ .getValue ();
			this .cutOffAngle      = light .cutOffAngle_ .getValue ();
			this .radius           = light .radius_ .getValue ();
	
			modelViewMatrix .multVecMatrix (this .location .assign (light .location_ .getValue ()));
			modelViewMatrix .multDirMatrix (this .direction .assign (light .direction_ .getValue ())) .normalize ();
	   },
		use: function (gl, shader, i)
		{
			gl .uniform1i (shader .lightType [i],             2);
			gl .uniform1i (shader .lightOn [i],               true);
			gl .uniform3f (shader .lightColor [i],            this .color .r, this .color .g, this .color .b);
			gl .uniform1f (shader .lightIntensity [i],        this .intensity);                                                  // clamp
			gl .uniform1f (shader .lightAmbientIntensity [i], this .ambientIntensity);                                           // clamp
			gl .uniform3f (shader .lightAttenuation [i],      this .attenuation .x, this .attenuation .y, this .attenuation .z); // max
			gl .uniform3f (shader .lightLocation [i],         this .location .x, this .location .y, this .location .z);
			gl .uniform3f (shader .lightDirection [i],        this .direction .x, this .direction .y, this .direction .z);
			gl .uniform1f (shader .lightBeamWidth [i],        this .beamWidth);                                                  // clamp
			gl .uniform1f (shader .lightCutOffAngle [i],      this .cutOffAngle);                                                // clamp
			gl .uniform1f (shader .lightRadius [i],           this .radius);                                                     // max
		},
		recycle: function ()
		{
		   SpotLights .push (this);
		},
	};

	function SpotLight (executionContext)
	{
		X3DLightNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .SpotLight);
	}

	SpotLight .prototype = $.extend (Object .create (X3DLightNode .prototype),
	{
		constructor: SpotLight,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",         new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "global",           new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "on",               new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "color",            new Fields .SFColor (1, 1, 1)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "intensity",        new Fields .SFFloat (1)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "ambientIntensity", new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "attenuation",      new Fields .SFVec3f (1, 0, 0)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "location",         new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "direction",        new Fields .SFVec3f (0, 0, -1)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "radius",           new Fields .SFFloat (100)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "beamWidth",        new Fields .SFFloat (0.785398)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "cutOffAngle",      new Fields .SFFloat (1.5708)),
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
		getLights: function ()
		{
			return SpotLights;
		},
	});

	return SpotLight;
});


