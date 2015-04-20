
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
		function ColorDamper (executionContext)
		{
			X3DDamperNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .ColorDamper);
		}

		ColorDamper .prototype = $.extend (Object .create (X3DDamperNode .prototype),
		{
			constructor: ColorDamper,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",           new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "set_value",          new SFColor ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "set_destination",    new SFColor ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "initialValue",       new SFColor (0.8, 0.8, 0.8)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "initialDestination", new SFColor (0.8, 0.8, 0.8)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "order",              new SFInt32 (3)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "tau",                new SFTime (0.3)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "tolerance",          new SFFloat (-1)),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "isActive",           new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "value_changed",      new SFColor ()),
			]),
			getTypeName: function ()
			{
				return "ColorDamper";
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

		return ColorDamper;
	}
});

