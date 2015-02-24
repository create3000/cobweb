
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
	with (Fields)
	{
		function RigidBody (executionContext)
		{
			X3DNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .RigidBody);
		}

		RigidBody .prototype = $.extend (new X3DNode (),
		{
			constructor: RigidBody,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",             new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "angularDampingFactor", new SFFloat (0.001)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "angularVelocity",      new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "autoDamp",             new SFBool (false)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "autoDisable",          new SFBool (false)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "centerOfMass",         new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "disableAngularSpeed",  new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "disableLinearSpeed",   new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "disableTime",          new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "enabled",              new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "finiteRotationAxis",   new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "fixed",                new SFBool (false)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "forces",               new MFVec3f ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "geometry",             new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "inertia",              new SFMatrix3f (1, 0, 0, 0, 1, 0, 0, 0, 1)),
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
	}
});

