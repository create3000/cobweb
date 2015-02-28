
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
		function SliderJoint (executionContext)
		{
			X3DRigidJointNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .SliderJoint);
		}

		SliderJoint .prototype = $.extend (new X3DRigidJointNode (),
		{
			constructor: SliderJoint,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",            new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "body1",               new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "body2",               new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "forceOutput",         new MFString ("NONE")),
				new X3DFieldDefinition (X3DConstants .inputOutput, "axis",                new SFVec3f (0, 1, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "maxSeparation",       new SFFloat (1)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "minSeparation",       new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "stopBounce",          new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "stopErrorCorrection", new SFFloat (1)),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "separation",          new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "separationRate",      new SFFloat ()),
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
	}
});

