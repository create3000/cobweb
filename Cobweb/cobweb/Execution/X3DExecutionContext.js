
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Basic/X3DBaseNode",
	"cobweb/Bits/X3DConstants",
	"standard/Networking/URI",
],
function ($, Fields, X3DFieldDefinition, FieldDefinitionArray, X3DBaseNode, X3DConstants, URI)
{
	with (Fields)
	{
		function X3DExecutionContext (browser, executionContext)
		{
			X3DBaseNode .call (this, browser, executionContext);
			
			this .url                = new URI (window .location);
			this .uninitializedNodes = [ ];
		}

		X3DExecutionContext .prototype = $.extend (new X3DBaseNode (),
		{
			constructor: X3DExecutionContext,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .initializeOnly, "rootNodes", new MFNode ()),
			]),
			initialize: function ()
			{
				X3DBaseNode .prototype .initialize .call (this);
				
				for (var i = 0; i < this .uninitializedNodes .length; ++ i)
					this .uninitializedNodes [i] .setup ();

				this .uninitializedNodes .length = 0;
			},
			getWorldURL: function ()
			{
				return this .url;
			},
			createNode: function (typeName, initialize)
			{
				var node = new (this .getBrowser () .supportedNodes [typeName .toUpperCase ()]) (this);
				
				if (initialize === false)
					return node;

				return new SFNode (node);
			},
			addUninitializedNode: function (node)
			{
				this .uninitializedNodes .push (node);
			},
			setRootNodes: function () { },
			getRootNodes: function ()
			{
				return this .rootNodes_;
			},
		});

		Object .defineProperty (X3DExecutionContext .prototype, "worldURL",
		{
			get: function () { return this .url .location; },
			enumerable: true,
			configurable: false
		});

		Object .defineProperty (X3DExecutionContext .prototype, "rootNodes",
		{
			get: function () { return this .getRootNodes (); },
			set: function (value) { this .setRootNodes (value); },
			enumerable: true,
			configurable: false
		});

		return X3DExecutionContext;
	}
});
