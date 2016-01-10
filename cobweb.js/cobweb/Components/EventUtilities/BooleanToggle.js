
define ("cobweb/Components/EventUtilities/BooleanToggle",
[
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

	function BooleanToggle (executionContext)
	{
		X3DChildNode .call (this, executionContext);

		this .addType (X3DConstants .BooleanToggle);
	}

	BooleanToggle .prototype = $.extend (Object .create (X3DChildNode .prototype),
	{
		constructor: BooleanToggle,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",    new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,   "set_boolean", new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "toggle",      new Fields .SFBool ()),
		]),
		getTypeName: function ()
		{
			return "BooleanToggle";
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
			if (this .set_boolean_ .getValue ())
				this .toggle_ = ! this .toggle_ .getValue ();
		},
	});

	return BooleanToggle;
});


