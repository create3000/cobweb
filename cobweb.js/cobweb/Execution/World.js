
define ([
	"jquery",
	"cobweb/Fields/SFNode",
	"cobweb/Basic/X3DBaseNode",
	"cobweb/Components/Layering/LayerSet",
	"cobweb/Components/Layering/Layer",
	"cobweb/Bits/X3DCast",
	"cobweb/Bits/X3DConstants",
],
function ($,
          SFNode,
          X3DBaseNode,
          LayerSet,
          Layer,
          X3DCast,
          X3DConstants)
{
"use strict";

	function World (executionContext)
	{
		X3DBaseNode .call (this, executionContext .getBrowser (), executionContext);

		this .layerSet        = new LayerSet (executionContext);
		this .defaultLayerSet = this .layerSet;
		this .layer0          = new Layer (executionContext);
		
		this .addChildren ("activeLayer", new SFNode (this .layer0));
	}

	World .prototype = $.extend (Object .create (X3DBaseNode .prototype),
	{
		constructor: World,
		getTypeName: function ()
		{
			return "World";
		},
		initialize: function ()
		{
			X3DBaseNode .prototype .initialize .call (this);

			this .layerSet .setup ();
			this .layerSet .setLayer0 (this .layer0);
			this .layerSet .activeLayer_ .addInterest (this, "set_activeLayer");

			this .getExecutionContext () .getRootNodes () .addInterest (this, "set_rootNodes");
			this .getExecutionContext () .setup ();

			this .set_rootNodes (); // This can happen twice when rootNodes is tainted

			this .layer0 .isLayer0 (true);
			this .layer0 .setup ();

			this .bind ();
		},
		getLayerSet: function ()
		{
			return this .layerSet;
		},
		getActiveLayer: function ()
		{
			return this .activeLayer_ .getValue ();
		},
		set_rootNodes: function ()
		{
			var oldLayerSet = this .layerSet;
			this .layerSet  = this .defaultLayerSet;

			var rootNodes = this .getExecutionContext () .getRootNodes ();

			this .layer0 .children_ = rootNodes;

			for (var i = 0; i < rootNodes .length; ++ i)
			{
				var rootLayerSet = X3DCast (X3DConstants .LayerSet, rootNodes [i]);

				if (rootLayerSet)
				{
					rootLayerSet .setLayer0 (this .layer0);
					this .layerSet = rootLayerSet;
				}
			}

			if (this .layerSet !== oldLayerSet)
			{
				oldLayerSet    .activeLayer_ .removeInterest (this, "set_activeLayer");
				this .layerSet .activeLayer_ .addInterest    (this, "set_activeLayer");

				this .set_activeLayer ();
			}

			this .traverse = this .layerSet .traverse .bind (this .layerSet);
		},
		set_activeLayer: function ()
		{
			this .activeLayer_ = this .layerSet .getActiveLayer ();
		},
		bind: function ()
		{
			// Bind first X3DBindableNodes found in each layer.

			this .layerSet .bind ();

			// Bind viewpoint from URL.

			try
			{
				var fragment = this .getExecutionContext () .getURL () .fragment;

				if (fragment .length)
					this .getExecutionContext () .changeViewpoint (fragment);
			}
			catch (error)
			{ }
		},
	});

	return World;
});
