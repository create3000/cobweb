
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/ParticleSystems/X3DParticlePhysicsModelNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DParticlePhysicsModelNode, 
          X3DConstants)
{
	with (Fields)
	{
		function WindPhysicsModel (executionContext)
		{
			X3DParticlePhysicsModelNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .WindPhysicsModel);
		}

		WindPhysicsModel .prototype = $.extend (new X3DParticlePhysicsModelNode (),
		{
			constructor: WindPhysicsModel,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",   new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "enabled",    new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "direction",  new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "speed",      new SFFloat (0.1)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "gustiness",  new SFFloat (0.1)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "turbulence", new SFFloat ()),
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
		});

		return WindPhysicsModel;
	}
});

