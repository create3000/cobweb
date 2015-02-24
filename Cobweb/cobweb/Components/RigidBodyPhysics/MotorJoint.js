
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
		function MotorJoint (executionContext)
		{
			X3DRigidJointNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .MotorJoint);
		}

		MotorJoint .prototype = $.extend (new X3DRigidJointNode (),
		{
			constructor: MotorJoint,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",             new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "body1",                new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "body2",                new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "forceOutput",          new MFString ("NONE")),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "axis1Angle",           new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "axis1Torque",          new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "axis2Angle",           new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "axis2Torque",          new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "axis3Angle",           new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "axis3Torque",          new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "enabledAxes",          new SFInt32 (1)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "motor1Axis",           new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "motor2Axis",           new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "motor3Axis",           new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "stop1Bounce",          new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "stop1ErrorCorrection", new SFFloat (0.8)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "stop2Bounce",          new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "stop2ErrorCorrection", new SFFloat (0.8)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "stop3Bounce",          new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "stop3ErrorCorrection", new SFFloat (0.8)),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "motor1Angle",          new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "motor1AngleRate",      new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "motor2Angle",          new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "motor2AngleRate",      new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "motor3Angle",          new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "motor3AngleRate",      new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "autoCalc",             new SFBool (false)),
			]),
			getTypeName: function ()
			{
				return "MotorJoint";
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

		return MotorJoint;
	}
});

