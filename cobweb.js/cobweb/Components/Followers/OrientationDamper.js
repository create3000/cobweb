
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
		function OrientationDamper (executionContext)
		{
			X3DDamperNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .OrientationDamper);
		}

		OrientationDamper .prototype = $.extend (Object .create (X3DDamperNode .prototype),
		{
			constructor: OrientationDamper,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",           new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "set_value",          new SFRotation ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "set_destination",    new SFRotation ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "initialValue",       new SFRotation (0, 0, 1, 0)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "initialDestination", new SFRotation (0, 0, 1, 0)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "order",              new SFInt32 (3)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "tau",                new SFTime (0.3)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "tolerance",          new SFFloat (-1)),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "isActive",           new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "value_changed",      new SFRotation ()),
			]),
			getTypeName: function ()
			{
				return "OrientationDamper";
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

		return OrientationDamper;
	}
});

