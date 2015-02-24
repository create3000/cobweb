
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
		function CoordinateChaser (executionContext)
		{
			X3DChaserNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .CoordinateChaser);
		}

		CoordinateChaser .prototype = $.extend (new X3DChaserNode (),
		{
			constructor: CoordinateChaser,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",           new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "set_value",          new MFVec3f ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "set_destination",    new MFVec3f ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "initialValue",       new MFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "initialDestination", new MFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "duration",           new SFTime (1)),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "isActive",           new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "value_changed",      new MFVec3f ()),
			]),
			getTypeName: function ()
			{
				return "CoordinateChaser";
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

		return CoordinateChaser;
	}
});

