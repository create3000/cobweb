
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/ParticleSystems/X3DParticleEmitterNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DParticleEmitterNode, 
          X3DConstants)
{
	with (Fields)
	{
		function ExplosionEmitter (executionContext)
		{
			X3DParticleEmitterNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .ExplosionEmitter);
		}

		ExplosionEmitter .prototype = $.extend (Object .create (X3DParticleEmitterNode .prototype),
		{
			constructor: ExplosionEmitter,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",    new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "position",    new SFVec3f ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "speed",       new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "variation",   new SFFloat (0.25)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "mass",        new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "surfaceArea", new SFFloat ()),
			]),
			getTypeName: function ()
			{
				return "ExplosionEmitter";
			},
			getComponentName: function ()
			{
				return "ParticleSystems";
			},
			getContainerField: function ()
			{
				return "emitter";
			},
		});

		return ExplosionEmitter;
	}
});

