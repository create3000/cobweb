
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
			this .namedNodes         = { };
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
			createNode: function (typeName, setup)
			{
				var node = new (this .getBrowser () .supportedNodes [typeName .toUpperCase ()]) (this);
				
				if (setup === false)
					return node;

				node .setup ();

				return new SFNode (node);
			},
			addUninitializedNode: function (node)
			{
				this .uninitializedNodes .push (node);
			},
			addNamedNode: function (name, node)
			{
				if (this .namedNodes [name] !== undefined)
					throw Error ("Couldn't add named node: node name '" + name + "' is already in use.");
				
				this .addNamedNode (name, node);
			},
			updateNamedNode: function (name, node)
			{
				name = String (name);
				
				if (node instanceof X3DBaseNode)
					node = new SFNode (node);				

				if (! (node instanceof SFNode))
					throw Error ("Couldn't update named node: node must be of type SFNode.");

				if (! node .getValue ())
					throw Error ("Couldn't update named node: node IS NULL.");

				if (node .getValue () .getExecutionContext () !== this)
					throw Error ("Couldn't update named node: the node does not belong to this execution context.");

				if (name .length === 0)
					throw Error ("Couldn't update named node: node name is empty.");

				// Remove named node.

				this .removeNamedNode (node .getValue () .getName ());
				this .removeNamedNode (name);

				// Update named node.

				node .getValue () .setName (name);

				this .namedNodes [name] = new SFNode (node .getValue ());
			},
			removeNamedNode: function (name)
			{
				delete this .namedNodes [name];
			},
			getNamedNode: function (name)
			{
				var node = this .namedNodes [name];

				if (node !== undefined)
					return node;

				throw Error ("Named node '" + name + "' not found.");
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
