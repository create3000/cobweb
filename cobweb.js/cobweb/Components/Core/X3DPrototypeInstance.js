
define ([
	"jquery",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Core/X3DNode",
	"cobweb/Execution/X3DExecutionContext",
	"cobweb/Bits/X3DConstants",
],
function ($,
          FieldDefinitionArray,
          X3DNode,
          X3DExecutionContext,
          X3DConstants)
{
	function X3DPrototypeInstance (executionContext, proto)
	{
		this .proto            = proto;
		this .metadata_        = proto .metadata_;
		this .fieldDefinitions = new FieldDefinitionArray (proto .getFieldDefinitions () .getValue () .slice (0));

		X3DExecutionContext .call (this, executionContext .getBrowser (), executionContext);
		X3DNode             .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .X3DPrototypeInstance);
		this .setExtendedEventHandling (false);

		// Assign protos and root nodes

		for (var i = 0, length = proto .externprotos .length; i < length; ++ i)
			this .externprotos .push (proto .externprotos [i]);

		for (var i = 0, length = proto .protos .length; i < length; ++ i)
			this .protos .push (proto .protos [i]);

		var
			rootNodes1 = proto .getRootNodes () .getValue (),
			rootNodes2 = this  .getRootNodes () .getValue ();

		for (var i = 0, length = rootNodes1 .length; i < length; ++ i)
		{
			var value = rootNodes1 [i] .copy (this);
			value .addParent (this .getRootNodes ());
			rootNodes2 .push (value);
		}
	}

	X3DPrototypeInstance .prototype = $.extend (Object .create (X3DExecutionContext .prototype),
		X3DNode .prototype,
	{
		constructor: X3DPrototypeInstance,
		create: function (executionContext)
		{
			return new X3DPrototypeInstance (executionContext, this .proto);
		},
		getTypeName: function ()
		{
			return this .proto .getName ();
		},
		getComponentName: function ()
		{
			return "Core";
		},
		getContainerField: function ()
		{
			return "children";
		},
		setup: function ()
		{
			X3DExecutionContext .prototype .setup .call (this);
			X3DNode             .prototype .setup .call (this);
		},
		initialize: function ()
		{
			// Copy imported nodes.

			// ...

			// Copy routes.

			var routes = this .proto .routes;

			for (var i = 0, length = routes .length; i < length; ++ i)
			{
				try
				{
					var route = routes [i];

					this .addRoute (this .getNamedNode (route .sourceNode .getNodeName ()),
					                route .sourceField,
					                this .getNamedNode (route .destinationNode .getNodeName ()),
					                route .destinationField);
				}
				catch (error)
				{
					console .log (error .message);
				}
			}
			
			// Now initialize bases.

			X3DExecutionContext .prototype .initialize .call (this);
			X3DNode             .prototype .initialize .call (this);
		},
		getInnerNode: function ()
		{
			var rootNodes = this .getRootNodes ();
			
			if (rootNodes .length)
			{
				var rootNode = rootNodes [0];
				
				if (rootNode)
					return rootNode .getValue () .getInnerNode ();
			}

			throw new Error ("Root node not available.");
		},
	});

	return X3DPrototypeInstance;
});

