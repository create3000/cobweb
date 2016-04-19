
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/ParticleSystems/X3DParticlePhysicsModelNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Algorithm",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DParticlePhysicsModelNode, 
          X3DConstants,
          Vector3,
          Algorithm)
{
"use strict";

	var normal = new Vector3 (0, 0, 0);

	function WindPhysicsModel (executionContext)
	{
		X3DParticlePhysicsModelNode .call (this, executionContext);

		this .addType (X3DConstants .WindPhysicsModel);
	}

	WindPhysicsModel .prototype = $.extend (Object .create (X3DParticlePhysicsModelNode .prototype),
	{
		constructor: WindPhysicsModel,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",   new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "enabled",    new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "direction",  new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "speed",      new Fields .SFFloat (0.1)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "gustiness",  new Fields .SFFloat (0.1)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "turbulence", new Fields .SFFloat ()),
		]),
		getTypeName: function ()
		{
			return "WindPhysicsModel";
		},
		getComponentName: function ()
		{
			return "ParticleSystems";
		},
		getContainerField: function ()
		{
			return "physics";
		},
		getRandomSpeed: function (emitterNode)
		{
			var
				s           = Math .max (0, this .speed_ .getValue ()),
				variation   = s * Math .max (0, this .gustiness_ .getValue ());
		
			return emitterNode .getRandomValue (Math .max (0, s - variation), s + variation);
		},
		addForce: function (i, emitterNode, forces, turbulences)
		{
			var surfaceArea = emitterNode .surfaceArea_ .getValue ()

			if (this .enabled_ .getValue ())
			{
				var
					randomSpeed = this .getRandomSpeed (emitterNode),
					pressure    = Math .pow (10, 2 * Math .log (randomSpeed)) * 0.64615;
		
				if (this .direction_ .getValue () .equals (Vector3 .Zero))
					emitterNode .getRandomNormal (normal);
				else
					normal .assign (this .direction_ .getValue ()) .normalize ();
		
				forces      [i] = normal .multiply (surfaceArea * pressure) .copy ();
				turbulences [i] = Math .PI * Algorithm .clamp (this .turbulence_ .getValue (), 0, 1);
			}
		},
	});

	return WindPhysicsModel;
});


