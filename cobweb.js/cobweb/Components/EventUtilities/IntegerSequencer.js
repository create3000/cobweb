
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/EventUtilities/X3DSequencerNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DSequencerNode, 
          X3DConstants)
{
	with (Fields)
	{
		function IntegerSequencer (executionContext)
		{
			X3DSequencerNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .IntegerSequencer);
		}

		IntegerSequencer .prototype = $.extend (Object .create (X3DSequencerNode .prototype),
		{
			constructor: IntegerSequencer,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",      new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,   "set_fraction",  new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,   "previous",      new SFBool ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,   "next",          new SFBool ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "key",           new MFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "keyValue",      new MFInt32 ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "value_changed", new SFInt32 ()),
			]),
			getTypeName: function ()
			{
				return "IntegerSequencer";
			},
			getComponentName: function ()
			{
				return "EventUtilities";
			},
			getContainerField: function ()
			{
				return "children";
			},
		});

		return IntegerSequencer;
	}
});

