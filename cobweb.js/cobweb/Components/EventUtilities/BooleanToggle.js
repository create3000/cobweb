
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

	function BooleanToggle (executionContext)
	{
		X3DChildNode .call (this, executionContext .getBrowser (), executionContext);

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
	});

	return BooleanToggle;
});


