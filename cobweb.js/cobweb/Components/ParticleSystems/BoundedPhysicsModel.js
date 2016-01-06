
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
"use strict";

	function BoundedPhysicsModel (executionContext)
	{
		X3DParticlePhysicsModelNode .call (this, executionContext);

		this .addType (X3DConstants .BoundedPhysicsModel);
	}

	BoundedPhysicsModel .prototype = $.extend (Object .create (X3DParticlePhysicsModelNode .prototype),
	{
		constructor: BoundedPhysicsModel,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata", new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "enabled",  new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "geometry", new Fields .SFNode ()),
		]),
		getTypeName: function ()
		{
			return "BoundedPhysicsModel";
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

	return BoundedPhysicsModel;
});


