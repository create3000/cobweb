
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Layering/X3DLayerNode",
	"cobweb/Components/Navigation/Viewpoint",
	"cobweb/Components/Grouping/Group",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DLayerNode,
          Viewpoint,
          Group,
          X3DConstants)
{
"use strict";

	function Layer (executionContext)
	{
		X3DLayerNode .call (this, executionContext .getBrowser (), executionContext, new Viewpoint (executionContext), new Group (executionContext));

		this .addType (X3DConstants .Layer);
	}

	Layer .prototype = $.extend (Object .create (X3DLayerNode .prototype),
	{
		constructor: Layer,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",       new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "isPickable",     new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "viewport",       new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,   "addChildren",    new Fields .MFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,   "removeChildren", new Fields .MFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "children",       new Fields .MFNode ()),
		]),
		getTypeName: function ()
		{
			return "Layer";
		},
		getComponentName: function ()
		{
			return "Layering";
		},
		getContainerField: function ()
		{
			return "layers";
		},
	});

	return Layer;
});


