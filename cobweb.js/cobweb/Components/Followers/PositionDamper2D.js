
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Followers/X3DDamperNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DDamperNode, 
          X3DConstants)
{
	with (Fields)
	{
		function PositionDamper2D (executionContext)
		{
			X3DDamperNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .PositionDamper2D);
		}

		PositionDamper2D .prototype = $.extend (Object .create (X3DDamperNode .prototype),
		{
			constructor: PositionDamper2D,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",           new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "set_value",          new SFVec2f ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "set_destination",    new SFVec2f ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "initialValue",       new SFVec2f (0, 0)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "initialDestination", new SFVec2f (0, 0)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "order",              new SFInt32 (3)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "tau",                new SFTime (0.3)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "tolerance",          new SFFloat (-1)),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "isActive",           new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "value_changed",      new SFVec2f ()),
			]),
			getTypeName: function ()
			{
				return "PositionDamper2D";
			},
			getComponentName: function ()
			{
				return "Followers";
			},
			getContainerField: function ()
			{
				return "children";
			},
		});

		return PositionDamper2D;
	}
});

