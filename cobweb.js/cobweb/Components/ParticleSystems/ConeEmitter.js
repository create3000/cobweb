
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/ParticleSystems/X3DParticleEmitterNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Rotation4",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DParticleEmitterNode, 
          X3DConstants,
          Vector3,
          Rotation4)
{
"use strict";

	function ConeEmitter (executionContext)
	{
		X3DParticleEmitterNode .call (this, executionContext);

		this .addType (X3DConstants .ConeEmitter);

		this .rotation = new Rotation4 (0, 0, 1, 0);
	}

	ConeEmitter .prototype = $.extend (Object .create (X3DParticleEmitterNode .prototype),
	{
		constructor: ConeEmitter,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",    new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "position",    new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "direction",   new Fields .SFVec3f (0, 1, 0)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "angle",       new Fields .SFFloat (0.785398)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "speed",       new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "variation",   new Fields .SFFloat (0.25)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "mass",        new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "surfaceArea", new Fields .SFFloat ()),
		]),
		getTypeName: function ()
		{
			return "ConeEmitter";
		},
		getComponentName: function ()
		{
			return "ParticleSystems";
		},
		getContainerField: function ()
		{
			return "emitter";
		},
		initialize: function ()
		{
			X3DParticleEmitterNode .prototype .initialize .call (this);

			this .position_  .addInterest (this, "set_position__");
			this .direction_ .addInterest (this, "set_direction__");
			this .angle_     .addInterest (this, "set_angle__");

			this .set_position__ ();
			this .set_direction__ ();
			this .set_angle__ ();
		},
		set_position__: function ()
		{
			this .position = this .position_ .getValue ()
		},
		set_direction__: function ()
		{
			var direction = this .direction_ .getValue ();

			this .rotation .setFromToVec (Vector3 .zAxis, direction);

			if (direction .equals (Vector3 .Zero))
				this .getRandomVelocity = getSphericalRandomVelocity;
			else
				delete this .getRandomVelocity;
		},
		set_angle__: function ()
		{
			this .angle = this .angle_ .getValue ()
		},
		getRandomPosition: function (position)
		{
			return position .assign (this .position);
		},
		getRandomVelocity: function (velocity)
		{
			return this .rotation .multVecRot (this .getRandomNormalWithAngle (this .angle, velocity) .multiply (this .getRandomSpeed ()));
 		},
	});

	function getSphericalRandomVelocity (velocity)
	{
		return this .getRandomNormal (velocity) .multiply (this .getRandomSpeed ());
	}

	return ConeEmitter;
});


