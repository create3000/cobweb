
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
	with (Fields)
	{
		function Layer (executionContext)
		{
			X3DLayerNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .Layer);
		}

		Layer .prototype = $.extend (new X3DLayerNode (),
		{
			constructor: Layer,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",       new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "isPickable",     new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "viewport",       new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,   "addChildren",    new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,   "removeChildren", new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "children",       new MFNode ()),
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
	}
});

