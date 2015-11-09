
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

	function SliderJoint (executionContext)
	{
		X3DRigidJointNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .SliderJoint);
	}

	SliderJoint .prototype = $.extend (Object .create (X3DRigidJointNode .prototype),
	{
		constructor: SliderJoint,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",            new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "body1",               new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "body2",               new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "forceOutput",         new Fields .MFString ("NONE")),
			new X3DFieldDefinition (X3DConstants .inputOutput, "axis",                new Fields .SFVec3f (0, 1, 0)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "maxSeparation",       new Fields .SFFloat (1)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "minSeparation",       new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "stopBounce",          new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "stopErrorCorrection", new Fields .SFFloat (1)),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "separation",          new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "separationRate",      new Fields .SFFloat ()),
		]),
		getTypeName: function ()
		{
			return "SliderJoint";
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

	return SliderJoint;
});


