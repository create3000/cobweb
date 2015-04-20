
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/RigidBodyPhysics/X3DRigidJointNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DRigidJointNode, 
          X3DConstants)
{
	with (Fields)
	{
		function SingleAxisHingeJoint (executionContext)
		{
			X3DRigidJointNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .SingleAxisHingeJoint);
		}

		SingleAxisHingeJoint .prototype = $.extend (Object .create (X3DRigidJointNode .prototype),
		{
			constructor: SingleAxisHingeJoint,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",            new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "body1",               new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "body2",               new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "forceOutput",         new MFString ("NONE")),
				new X3DFieldDefinition (X3DConstants .inputOutput, "anchorPoint",         new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "axis",                new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "maxAngle",            new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "minAngle",            new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "stopBounce",          new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "stopErrorCorrection", new SFFloat (0.8)),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "angle",               new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "angleRate",           new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "body1AnchorPoint",    new SFVec3f ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "body2AnchorPoint",    new SFVec3f ()),
			]),
			getTypeName: function ()
			{
				return "SingleAxisHingeJoint";
			},
			getComponentName: function ()
			{
				return "RigidBodyPhysics";
			},
			getContainerField: function ()
			{
				return "joints";
			},
		});

		return SingleAxisHingeJoint;
	}
});

