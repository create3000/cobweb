
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/RigidBodyPhysics/X3DNBodyCollidableNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DNBodyCollidableNode, 
          X3DConstants)
{
"use strict";

	function CollidableShape (executionContext)
	{
		X3DNBodyCollidableNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .CollidableShape);
	}

	CollidableShape .prototype = $.extend (Object .create (X3DNBodyCollidableNode .prototype),
	{
		constructor: CollidableShape,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",    new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxSize",    new Fields .SFVec3f (-1, -1, -1)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxCenter",  new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "enabled",     new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "rotation",    new Fields .SFRotation ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "translation", new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "shape",       new Fields .SFNode ()),
		]),
		getTypeName: function ()
		{
			return "CollidableShape";
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

	return CollidableShape;
});


