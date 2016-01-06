
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Core/X3DNode",
	"cobweb/Components/Layering/Layer",
	"cobweb/Bits/X3DCast",
	"cobweb/Bits/TraverseType",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DNode,
          Layer,
          X3DCast,
          TraverseType,
          X3DConstants)
{
"use strict";

	function LayerSet (executionContext)
	{
		X3DNode .call (this, executionContext);

		this .addType (X3DConstants .LayerSet);

		this .layerNodes      = [ new Layer (executionContext) ];
		this .layerNode0      = this .layerNodes [0];
		this .activeLayerNode = null;
	}

	LayerSet .prototype = $.extend (Object .create (X3DNode .prototype),
	{
		constructor: LayerSet,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",    new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "activeLayer", new Fields .SFInt32 ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "order",       new Fields .MFInt32 (0)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "layers",      new Fields .MFNode ()),
		]),
		getTypeName: function ()
		{
			return "LayerSet";
		},
		getComponentName: function ()
		{
			return "Layering";
		},
		getContainerField: function ()
		{
			return "children";
		},
		initialize: function ()
		{
			X3DNode .prototype .initialize .call (this);

			this .layerNode0 .setup ();
			this .layerNode0 .isLayer0 (true);

			this .activeLayer_ .addInterest (this, "set_activeLayer");
			this .order_       .addInterest (this, "set_layers");
			this .layers_      .addInterest (this, "set_layers");

			this .set_layers ();
		},
		getActiveLayer: function ()
		{
			return this .activeLayerNode;
		},
		setLayer0: function (value)
		{
			this .layerNode0 = value;

			this .set_layers ();
		},
		getLayer0: function ()
		{
			return this .layerNode0;
		},
		getLayers: function ()
		{
			return this .layerNodes;
		},
		set_activeLayer: function ()
		{
			if (this .activeLayer_ .getValue () === 0)
			{
				if (this .activeLayerNode !== this .layerNode0)
					this .activeLayerNode = this .layerNode0;
			}
			else
			{
				var index = this .activeLayer_ - 1;

				if (index >= 0 && index < this .layers_ .length)
				{
					if (this .activeLayerNode !== this .layers_ [index] .getValue ())
						this .activeLayerNode = this .layers_ [index] .getValue ();
				}
				else
				{
					if (this .activeLayerNode !== null)
						this .activeLayerNode = null;
				}
			}
		},
		set_layers: function ()
		{
			var layers = this .layers_ .getValue ();

			this .layerNodes .length = 0;

			for (var i = 0; i < this .order_ .length; ++ i)
			{
				var index = this .order_ [i];

				if (index === 0)
					this .layerNodes .push (this .layerNode0);
					
				else
				{
					-- index;

					if (index >= 0 && index < layers .length)
					{
						var layerNode = X3DCast (X3DConstants .X3DLayerNode, layers [index]);

						if (layerNode)
							this .layerNodes .push (layerNode);
					}
				}
			}

			this .set_activeLayer ();
		},
		bind: function ()
		{
			var layers = this .layers_ .getValue ();

			this .layerNode0 .bind ();

			for (var i = 0, length = layers .length; i < length; ++ i)
			{
				var layerNode = X3DCast (X3DConstants .X3DLayerNode, layers [i]);

				if (layerNode)
					layerNode .bind ();
			}
		},
		traverse: function (type)
		{
			var layerNodes = this .layerNodes;

			if (type === TraverseType .POINTER)
			{
				for (var i = 0, length = layerNodes .length; i < length; ++ i)
				{
					this .getBrowser () .setLayerNumber (i);
					layerNodes [i] .traverse (type);
				}
			}
			else
			{
				for (var i = 0, length = layerNodes .length; i < length; ++ i)
				{
					layerNodes [i] .traverse (type);
				}
			}
		},
	});

	return LayerSet;
});


