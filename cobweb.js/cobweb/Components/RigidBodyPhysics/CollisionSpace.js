
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/RigidBodyPhysics/X3DNBodyCollisionSpaceNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DNBodyCollisionSpaceNode, 
          X3DConstants)
{
"use strict";

	function CollisionSpace (executionContext)
	{
		X3DNBodyCollisionSpaceNode .call (this, executionContext);

		this .addType (X3DConstants .CollisionSpace);
	}

	CollisionSpace .prototype = $.extend (Object .create (X3DNBodyCollisionSpaceNode .prototype),
	{
		constructor: CollisionSpace,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",    new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "enabled",     new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "useGeometry", new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxSize",    new Fields .SFVec3f (-1, -1, -1)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxCenter",  new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "collidables", new Fields .MFNode ()),
		]),
		getTypeName: function ()
		{
			return "CollisionSpace";
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

	return CollisionSpace;
});


