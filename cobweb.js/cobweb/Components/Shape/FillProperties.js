
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Shape/X3DAppearanceChildNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DAppearanceChildNode, 
          X3DConstants)
{
"use strict";

	function FillProperties (executionContext)
	{
		X3DAppearanceChildNode .call (this, executionContext);

		this .addType (X3DConstants .FillProperties);
	}

	FillProperties .prototype = $.extend (Object .create (X3DAppearanceChildNode .prototype),
	{
		constructor: FillProperties,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",   new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "filled",     new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "hatched",    new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "hatchStyle", new Fields .SFInt32 (1)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "hatchColor", new Fields .SFColor (1, 1, 1)),
		]),
		getTypeName: function ()
		{
			return "FillProperties";
		},
		getComponentName: function ()
		{
			return "Shape";
		},
		getContainerField: function ()
		{
			return "fillProperties";
		},
	});

	return FillProperties;
});


