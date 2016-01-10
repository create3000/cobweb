
define ("cobweb/Components/EventUtilities/BooleanSequencer",
[
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
"use strict";

	function BooleanSequencer (executionContext)
	{
		X3DSequencerNode .call (this, executionContext);

		this .addType (X3DConstants .BooleanSequencer);
	}

	BooleanSequencer .prototype = $.extend (Object .create (X3DSequencerNode .prototype),
	{
		constructor: BooleanSequencer,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",      new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,   "set_fraction",  new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,   "previous",      new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,   "next",          new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "key",           new Fields .MFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "keyValue",      new Fields .MFBool ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "value_changed", new Fields .SFBool ()),
		]),
		getTypeName: function ()
		{
			return "BooleanSequencer";
		},
		getComponentName: function ()
		{
			return "EventUtilities";
		},
		getContainerField: function ()
		{
			return "children";
		},
		initialize: function ()
		{
			X3DSequencerNode .prototype .initialize .call (this);

			this .keyValue_ .addInterest (this, "set_index__");
		},
		getSize: function ()
		{
			return this .keyValue_ .length;
		},
		sequence: function (index)
		{
			this .value_changed_ = this .keyValue_ [index];
		},
	});

	return BooleanSequencer;
});


