
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
		function ScalarChaser (executionContext)
		{
			X3DChaserNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .ScalarChaser);
		}

		ScalarChaser .prototype = $.extend (new X3DChaserNode (),
		{
			constructor: ScalarChaser,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",           new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "set_value",          new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "set_destination",    new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "initialValue",       new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "initialDestination", new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "duration",           new SFTime (1)),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "isActive",           new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "value_changed",      new SFFloat ()),
			]),
			getTypeName: function ()
			{
				return "ScalarChaser";
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

		return ScalarChaser;
	}
});

