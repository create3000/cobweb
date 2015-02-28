
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
		function SurfaceEmitter (executionContext)
		{
			X3DParticleEmitterNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .SurfaceEmitter);
		}

		SurfaceEmitter .prototype = $.extend (new X3DParticleEmitterNode (),
		{
			constructor: SurfaceEmitter,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",    new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "speed",       new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "variation",   new SFFloat (0.25)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "mass",        new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "surfaceArea", new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "surface",     new SFNode ()),
			]),
			getTypeName: function ()
			{
				return "SurfaceEmitter";
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

		return SurfaceEmitter;
	}
});

