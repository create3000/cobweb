
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Basic/X3DBaseNode",
	"cobweb/Prototype/ExternProtoDeclarationArray",
	"cobweb/Prototype/ProtoDeclarationArray",
	"cobweb/Routing/RouteArray",
	"cobweb/Routing/X3DRoute",
	"cobweb/Bits/X3DCast",
	"cobweb/Bits/X3DConstants",
	"standard/Networking/URI",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DBaseNode,
          ExternProtoDeclarationArray,
          ProtoDeclarationArray,
          RouteArray,
          X3DRoute,
          X3DCast,
          X3DConstants,
          URI)
{
	with (Fields)
	{
		function X3DExecutionContext (browser, executionContext)
		{
			X3DBaseNode .call (this, browser, executionContext);

			this .addChildren ("rootNodes", new MFNode ());

			this .url                = new URI (window .location);
			this .uninitializedNodes = [ ];
			this .namedNodes         = { };
			this .protos             = new ProtoDeclarationArray ();
			this .externprotos       = new ExternProtoDeclarationArray ();
			this .routes             = new RouteArray ();
			this .routeIndex         = { };
		}

		X3DExecutionContext .prototype = $.extend (Object .create (X3DBaseNode .prototype),
		{
			constructor: X3DExecutionContext,
			setup: function ()
			{
				X3DBaseNode .prototype .setup .call (this);

				for (var i = 0; i < this .uninitializedNodes .length; ++ i)
					this .uninitializedNodes [i] .setup ();

				this .uninitializedNodes .length = 0;
			},
			isRootContext: function ()
			{
				return false;
			},
			setWorldURL: function (url)
			{
				this .url = url;
			},
			getWorldURL: function ()
			{
				return this .url;
			},
			createNode: function (typeName, xml)
			{
				switch (xml)
				{
					case undefined:
						var node = new (this .getBrowser () .supportedNodes .xml [typeName]) (this);
						node .setup ();
						return new SFNode (node);
					case true:
						return new (this .getBrowser () .supportedNodes .xml [typeName]) (this);
					case false:
						return new (this .getBrowser () .supportedNodes .dom [typeName .toUpperCase ()]) (this);
				}
			},
			createProto: function (name, setup)
			{
				var executionContext = this;

				do
				{
					var proto = executionContext .protos [name];
	
					if (proto)
						return proto .createInstance (setup);

					var externproto = executionContext .externprotos [name];

					if (externproto)
						return externproto .createInstance (setup);

					executionContext = executionContext .getExecutionContext ();
				}
				while (! executionContext .isRootContext ());

				throw new Error ("Unknown proto or externproto type '" + name + "'.");
			},
			addUninitializedNode: function (node)
			{
				this .uninitializedNodes .push (node);
			},
			addNamedNode: function (name, node)
			{
				if (this .namedNodes [name] !== undefined)
					throw Error ("Couldn't add named node: node name '" + name + "' is already in use.");

				this .updateNamedNode (name, node);
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
			addRoute: function (sourceNode, fromField, destinationNode, toField)
			{
				try
				{
					if (! sourceNode .getValue ())
						throw new Error ("Bad ROUTE specification: sourceNode is NULL.");

					if (! destinationNode .getValue ())
						throw new Error ("Bad ROUTE specification: destinationNode is NULL.");

					var
						sourceField      = sourceNode .getValue () .getField (fromField),
						destinationField = destinationNode .getValue () .getField (toField);

					if (! sourceField .isOutput ())
						throw new Error ("Bad ROUTE specification: Field named '" + sourceField .getName () + "' in node named '" + sourceNode .getNodeName () + "' of type " + sourceNode .getNodeTypeName () + " is not an output field.");

					if (! destinationField .isInput ())
						throw new Error ("Bad ROUTE specification: Field named '" + destinationField .getName () + "' in node named '" + destinationNode .getName () + "' of type " + destinationNode .getNodeTypeName () + " is not an input field.");

					var
						id    = sourceField .getId () + "." + destinationField .getId (),
						route = new X3DRoute (sourceNode, sourceField, destinationNode, destinationField);

					this .routes .getValue () .push (route);
					this .routeIndex [id] = route;

					return route;
				}
				catch (error)
				{
					throw new Error ("Bad ROUTE specification: " + error .message); 
				}
			},
			deleteRoute: function (route)
			{
				try
				{
					var
						sourceField      = route .sourceField_,
						destinationField = route .destinationField_;
						id               = sourceField .getId () + "." + destinationField .getId (),
						index            = this .routes .getValue () .indexOf (route);

					if (index !== -1)
						this .routes .getValue () .splice (index, 1);

					delete this .routeIndex [id];
				}
				catch (error)
				{
					console .log (error);
				}
			},
			getRoute: function (sourceNode, fromField, destinationNode, toField)
			{
				if (! sourceNode .getValue ())
					throw new Error ("Bad ROUTE specification: sourceNode is NULL.");

				if (! destinationNode .getValue ())
					throw new Error ("Bad ROUTE specification: destinationNode is NULL.");

				var
					sourceField      = sourceNode .getValue () .getField (fromField),
					destinationField = destinationNode .getValue () .getField (toField),
					id               = sourceField .getId () + "." + destinationField .getId ();

				return this .routeIndex [id];
			},
			changeViewpoint: function (name)
			{
				try
				{
					var namedNode = this .getNamedNode (name);
					var viewpoint = X3DCast (X3DConstants .X3DViewpointNode, namedNode);

					if (! viewpoint)
						throw Error ("Node named '" + name + "' is not a viewpoint node.");

					if (viewpoint .isBound_ .getValue ())
						viewpoint .transitionStart (null, viewpoint);

					else
						viewpoint .set_bind_ = true;
				}
				catch (error)
				{
					if (! this .isRootContext ())
						this .getExecutionContext () .changeViewpoint (name);
					else
						throw error;
				}
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
