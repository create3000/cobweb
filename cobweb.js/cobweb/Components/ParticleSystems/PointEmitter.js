
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/ParticleSystems/X3DParticleEmitterNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector3",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DParticleEmitterNode, 
          X3DConstants,
          Vector3)
{
"use strict";

	function PointEmitter (executionContext)
	{
		X3DParticleEmitterNode .call (this, executionContext);

		this .addType (X3DConstants .PointEmitter);

		this .direction = new Vector3 (0, 0, 0);
	}

	PointEmitter .prototype = $.extend (Object .create (X3DParticleEmitterNode .prototype),
	{
		constructor: PointEmitter,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",    new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "position",    new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "direction",   new Fields .SFVec3f (0, 1, 0)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "speed",       new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "variation",   new Fields .SFFloat (0.25)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "mass",        new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "surfaceArea", new Fields .SFFloat ()),
		]),
		getTypeName: function ()
		{
			return "PointEmitter";
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

			this .set_position__ ();
			this .set_direction__ ();
		},
		set_position__: function ()
		{
			this .position = this .position_ .getValue ()
		},
		set_direction__: function ()
		{
			this .direction .assign (this .direction_ .getValue ()) .normalize ();

			if (this .direction .equals (Vector3 .Zero))
				this .getRandomVelocity = getSphericalRandomVelocity;
			else
				delete this .getRandomVelocity;
		},
		getRandomPosition: function (position)
		{
			return position .assign (this .position);
		},
		getRandomVelocity: function (velocity)
		{
			var
				direction = this .direction,
				speed     = this .getRandomSpeed ();

			velocity .x = direction .x * speed;
			velocity .y = direction .y * speed;
			velocity .z = direction .z * speed;

			return velocity;
 		},
	});

	function getSphericalRandomVelocity (velocity)
	{
		return this .getRandomNormal (velocity) .multiply (this .getRandomSpeed ());
	}

	return PointEmitter;
});


