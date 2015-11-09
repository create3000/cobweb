
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Layering/X3DLayerNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DLayerNode, 
          X3DConstants)
{
"use strict";

	function LayoutLayer (executionContext)
	{
		X3DLayerNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .LayoutLayer);
	}

	LayoutLayer .prototype = $.extend (Object .create (X3DLayerNode .prototype),
	{
		constructor: LayoutLayer,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",       new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "isPickable",     new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "layout",         new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "viewport",       new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,   "addChildren",    new Fields .MFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,   "removeChildren", new Fields .MFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "children",       new Fields .MFNode ()),
		]),
		getTypeName: function ()
		{
			return "LayoutLayer";
		},
		getComponentName: function ()
		{
			return "Layout";
		},
		getContainerField: function ()
		{
			return "layers";
		},
	});

	return LayoutLayer;
});


