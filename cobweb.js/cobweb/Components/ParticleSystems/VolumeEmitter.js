
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
		function VolumeEmitter (executionContext)
		{
			X3DParticleEmitterNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .VolumeEmitter);
		}

		VolumeEmitter .prototype = $.extend (Object .create (X3DParticleEmitterNode .prototype),
		{
			constructor: VolumeEmitter,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",    new SFNode ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "internal",    new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "direction",   new SFVec3f (0, 1, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "speed",       new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "variation",   new SFFloat (0.25)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "mass",        new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "surfaceArea", new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "coordIndex",  new MFInt32 (-1)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "coord",       new SFNode ()),
			]),
			getTypeName: function ()
			{
				return "VolumeEmitter";
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

		return VolumeEmitter;
	}
});

