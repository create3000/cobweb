
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

	function DoubleAxisHingeJoint (executionContext)
	{
		X3DRigidJointNode .call (this, executionContext);

		this .addType (X3DConstants .DoubleAxisHingeJoint);
	}

	DoubleAxisHingeJoint .prototype = $.extend (Object .create (X3DRigidJointNode .prototype),
	{
		constructor: DoubleAxisHingeJoint,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",                  new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "body1",                     new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "body2",                     new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "forceOutput",               new Fields .MFString ("NONE")),
			new X3DFieldDefinition (X3DConstants .inputOutput, "anchorPoint",               new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "axis1",                     new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "axis2",                     new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "desiredAngularVelocity1",   new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "desiredAngularVelocity2",   new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "maxAngle1",                 new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "maxTorque1",                new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "maxTorque2",                new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "minAngle1",                 new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "stopBounce1",               new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "stopConstantForceMix1",     new Fields .SFFloat (0.001)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "stopErrorCorrection1",      new Fields .SFFloat (0.8)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "suspensionErrorCorrection", new Fields .SFFloat (0.8)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "suspensionForce",           new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "body1AnchorPoint",          new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "body1Axis",                 new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "body2AnchorPoint",          new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "body2Axis",                 new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "hinge1Angle",               new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "hinge1AngleRate",           new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "hinge2Angle",               new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "hinge2AngleRate",           new Fields .SFFloat ()),
		]),
		getTypeName: function ()
		{
			return "DoubleAxisHingeJoint";
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

	return DoubleAxisHingeJoint;
});


