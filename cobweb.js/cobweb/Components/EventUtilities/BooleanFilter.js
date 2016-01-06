
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Core/X3DChildNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DChildNode, 
          X3DConstants)
{
"use strict";

	function BooleanFilter (executionContext)
	{
		X3DChildNode .call (this, executionContext);

		this .addType (X3DConstants .BooleanFilter);
	}

	BooleanFilter .prototype = $.extend (Object .create (X3DChildNode .prototype),
	{
		constructor: BooleanFilter,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",    new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,   "set_boolean", new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "inputTrue",   new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "inputFalse",  new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "inputNegate", new Fields .SFBool ()),
		]),
		getTypeName: function ()
		{
			return "BooleanFilter";
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
			X3DChildNode .prototype .initialize .call (this);

			this .set_boolean_ .addInterest (this, "set_boolean__");
		},
		set_boolean__: function ()
		{
			var value = this .set_boolean_ .getValue ();

			if (value)
				this .inputTrue_ = true;
		
			else
				this .inputFalse_ = true;
		
			this .inputNegate_ = ! value;
		},
	});

	return BooleanFilter;
});


