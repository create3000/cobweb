
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
		function UniversalJoint (executionContext)
		{
			X3DRigidJointNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .UniversalJoint);
		}

		UniversalJoint .prototype = $.extend (Object .create (X3DRigidJointNode .prototype),
		{
			constructor: UniversalJoint,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",             new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "body1",                new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "body2",                new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "forceOutput",          new MFString ("NONE")),
				new X3DFieldDefinition (X3DConstants .inputOutput, "anchorPoint",          new SFVec3f ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "axis1",                new SFVec3f ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "axis2",                new SFVec3f ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "stopBounce1",          new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "stop1ErrorCorrection", new SFFloat (0.8)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "stop2Bounce",          new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "stop2ErrorCorrection", new SFFloat (0.8)),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "body1AnchorPoint",     new SFVec3f ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "body1Axis",            new SFVec3f ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "body2AnchorPoint",     new SFVec3f ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "body2Axis",            new SFVec3f ()),
			]),
			getTypeName: function ()
			{
				return "UniversalJoint";
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

		return UniversalJoint;
	}
});

