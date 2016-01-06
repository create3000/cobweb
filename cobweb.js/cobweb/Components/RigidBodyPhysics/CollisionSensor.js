
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
"use strict";

	function CollisionSensor (executionContext)
	{
		X3DSensorNode .call (this, executionContext);

		this .addType (X3DConstants .CollisionSensor);
	}

	CollisionSensor .prototype = $.extend (Object .create (X3DSensorNode .prototype),
	{
		constructor: CollisionSensor,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",      new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "enabled",       new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "isActive",      new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "collider",      new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "intersections", new Fields .MFNode ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "contacts",      new Fields .MFNode ()),
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
});


