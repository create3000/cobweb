
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Core/X3DNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DNode, 
          X3DConstants)
{
"use strict";

	function RigidBody (executionContext)
	{
		X3DNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .RigidBody);
	}

	RigidBody .prototype = $.extend (Object .create (X3DNode .prototype),
	{
		constructor: RigidBody,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",             new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "angularDampingFactor", new Fields .SFFloat (0.001)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "angularVelocity",      new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "autoDamp",             new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "autoDisable",          new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "centerOfMass",         new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "disableAngularSpeed",  new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "disableLinearSpeed",   new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "disableTime",          new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "enabled",              new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "finiteRotationAxis",   new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "fixed",                new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "forces",               new Fields .MFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "geometry",             new Fields .MFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "inertia",              new Fields .SFMatrix3f (1, 0, 0, 0, 1, 0, 0, 0, 1)),
		]),
		getTypeName: function ()
		{
			return "RigidBody";
		},
		getComponentName: function ()
		{
			return "RigidBodyPhysics";
		},
		getContainerField: function ()
		{
			return "bodies";
		},
	});

	return RigidBody;
});


