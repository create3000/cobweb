
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Shape/X3DShapeNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DShapeNode, 
          X3DConstants)
{
	with (Fields)
	{
		function ParticleSystem (executionContext)
		{
			X3DShapeNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .ParticleSystem);
		}

		ParticleSystem .prototype = $.extend (Object .create (X3DShapeNode .prototype),
		{
			constructor: ParticleSystem,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",          new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "enabled",           new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "geometryType",      new SFString ("QUAD")),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "createParticles",   new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "maxParticles",      new SFInt32 (200)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "particleLifetime",  new SFFloat (5)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "lifetimeVariation", new SFFloat (0.25)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "particleSize",      new SFVec2f (0.02, 0.02)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "colorKey",          new MFFloat ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "texCoordKey",       new MFFloat ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "isActive",          new SFBool ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxSize",          new SFVec3f (-1, -1, -1)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxCenter",        new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "emitter",           new SFNode ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "colorRamp",         new SFNode ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "texCoordRamp",      new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "appearance",        new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "geometry",          new SFNode ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "physics",           new MFNode ()),
			]),
			getTypeName: function ()
			{
				return "ParticleSystem";
			},
			getComponentName: function ()
			{
				return "ParticleSystems";
			},
			getContainerField: function ()
			{
				return "children";
			},
			set_bbox__: function ()
			{
			},
		});

		return ParticleSystem;
	}
});

