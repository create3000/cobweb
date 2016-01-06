
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
"use strict";

	function MotorJoint (executionContext)
	{
		X3DRigidJointNode .call (this, executionContext);

		this .addType (X3DConstants .MotorJoint);
	}

	MotorJoint .prototype = $.extend (Object .create (X3DRigidJointNode .prototype),
	{
		constructor: MotorJoint,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",             new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "body1",                new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "body2",                new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "forceOutput",          new Fields .MFString ("NONE")),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "axis1Angle",           new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "axis1Torque",          new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "axis2Angle",           new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "axis2Torque",          new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "axis3Angle",           new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "axis3Torque",          new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "enabledAxes",          new Fields .SFInt32 (1)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "motor1Axis",           new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "motor2Axis",           new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "motor3Axis",           new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "stop1Bounce",          new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "stop1ErrorCorrection", new Fields .SFFloat (0.8)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "stop2Bounce",          new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "stop2ErrorCorrection", new Fields .SFFloat (0.8)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "stop3Bounce",          new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "stop3ErrorCorrection", new Fields .SFFloat (0.8)),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "motor1Angle",          new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "motor1AngleRate",      new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "motor2Angle",          new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "motor2AngleRate",      new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "motor3Angle",          new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "motor3AngleRate",      new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "autoCalc",             new Fields .SFBool ()),
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
});


