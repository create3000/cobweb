
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
	with (Fields)
	{
		function CollidableOffset (executionContext)
		{
			X3DNBodyCollidableNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .CollidableOffset);
		}

		CollidableOffset .prototype = $.extend (Object .create (X3DNBodyCollidableNode .prototype),
		{
			constructor: CollidableOffset,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",    new SFNode ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxSize",    new SFVec3f (-1, -1, -1)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxCenter",  new SFVec3f ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "enabled",     new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "rotation",    new SFRotation ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "translation", new SFVec3f ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "collidable",  new SFNode ()),
			]),
			getTypeName: function ()
			{
				return "CollidableOffset";
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

		return CollidableOffset;
	}
});

