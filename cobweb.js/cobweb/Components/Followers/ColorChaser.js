
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Followers/X3DChaserNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DChaserNode, 
          X3DConstants)
{
	with (Fields)
	{
		function ColorChaser (executionContext)
		{
			X3DChaserNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .ColorChaser);
		}

		ColorChaser .prototype = $.extend (new X3DChaserNode (),
		{
			constructor: ColorChaser,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",           new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "set_value",          new SFColor ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "set_destination",    new SFColor ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "initialValue",       new SFColor (0.8, 0.8, 0.8)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "initialDestination", new SFColor (0.8, 0.8, 0.8)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "duration",           new SFTime (1)),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "isActive",           new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "value_changed",      new SFColor ()),
			]),
			getTypeName: function ()
			{
				return "ColorChaser";
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

		return ColorChaser;
	}
});

