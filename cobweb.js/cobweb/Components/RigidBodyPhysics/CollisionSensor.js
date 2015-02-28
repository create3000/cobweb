
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Core/X3DSensorNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DSensorNode, 
          X3DConstants)
{
	with (Fields)
	{
		function CollisionSensor (executionContext)
		{
			X3DSensorNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .CollisionSensor);
		}

		CollisionSensor .prototype = $.extend (new X3DSensorNode (),
		{
			constructor: CollisionSensor,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",      new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "enabled",       new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "isActive",      new SFBool ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "collider",      new SFNode ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "intersections", new MFNode ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "contacts",      new MFNode ()),
			]),
			getTypeName: function ()
			{
				return "CollisionSensor";
			},
			getComponentName: function ()
			{
				return "RigidBodyPhysics";
			},
			getContainerField: function ()
			{
				return "children";
			},
		});

		return CollisionSensor;
	}
});

