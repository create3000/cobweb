
define ([
	"jquery",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Fields",
	"cobweb/Base/X3DChildObject",
	"cobweb/Components/Core/X3DNode",
	"cobweb/Execution/X3DExecutionContext",
	"cobweb/Bits/X3DConstants",
],
function ($,
          FieldDefinitionArray,
          Fields,
          X3DChildObject,
          X3DNode,
          X3DExecutionContext,
          X3DConstants)
{
"use strict";

	function X3DPrototypeInstance (executionContext, protoNode)
	{
		this .protoNode        = protoNode;
		this .fieldDefinitions = new FieldDefinitionArray (protoNode .getFieldDefinitions () .getValue () .slice ());

		this .addChildren ("isLiveX3DPrototypeInstance", new Fields .SFBool (true));

		X3DNode             .call (this, executionContext);
		X3DExecutionContext .call (this, executionContext);

		this .addType (X3DConstants .X3DPrototypeInstance);
		this .getRootNodes () .setAccessType (X3DConstants .initializeOnly);

		this .getScene () .addLoadCount (this);

		if (protoNode .isExternProto ())
			protoNode .requestAsyncLoad (this .construct .bind (this));

		else
			this .construct ();
	}

	X3DPrototypeInstance .prototype = $.extend (Object .create (X3DExecutionContext .prototype),
		X3DNode .prototype,
	{
		constructor: X3DPrototypeInstance,
		create: function (executionContext)
		{
			return new X3DPrototypeInstance (executionContext, this .protoNode);
		},
		getTypeName: function ()
		{
			return this .protoNode .getName ();
		},
		getComponentName: function ()
		{
			return "Core";
		},
		getContainerField: function ()
		{
			return "children";
		},
		construct: function ()
		{
			this .getScene () .removeLoadCount (this);

			var proto = this .protoNode .getProtoDeclaration ();

			if (proto)
			{
				// If there is a proto the externproto is completely loaded.
			
				this .metadata_ = proto .metadata_;

				if (this .protoNode .isExternProto ())
				{
					var fieldDefinitions = proto .getFieldDefinitions ();

					for (var i = 0, length = fieldDefinitions .length; i < length; ++ i)
					{
						try
						{
							var
								fieldDefinition = fieldDefinitions [i],
                        field           = this .getField (fieldDefinition .name),
								protoField      = proto .getField (fieldDefinition .name);

							// Continue if something is wrong.
							if (field .getAccessType () !== protoField .getAccessType ())
								continue;

							// Continue if something is wrong.
							if (field .getType () !== protoField .getType ())
								continue;

							// Continue if field is eventIn or eventOut.
							if (! (field .getAccessType () & X3DConstants .initializeOnly))
								continue;

							// Is set during parse.	
							if (field .getSet ())
								continue;

							// Has IS references.
							if (field .hasReferences ())
								continue;

							field .set (protoField .getValue ());
						}
						catch (error)
						{
							// Definition exists in proto but does not exist in extern proto.
							this .addField (fieldDefinition);
						}
					}
				}

				// Assign metadata.

				this .setURL (proto .getURL ());

				this .importExternProtos (proto .externprotos);
				this .importProtos       (proto .protos);
				this .copyRootNodes      (proto .rootNodes);

				if (this .isInitialized ())
				{
					this .setup ();
					X3DChildObject .prototype .addEvent .call (this);
				}
			}
		},
		setup: function ()
		{
			X3DNode             .prototype .setup .call (this);
			X3DExecutionContext .prototype .setup .call (this);
		},
		initialize: function ()
		{
			try
			{
				var proto = this .protoNode .getProtoDeclaration ();

				if (proto)
				{
					//this .copyImportedNodes (proto);
					this .copyRoutes (proto .routes);
				}
				
				this .getExecutionContext () .isLive () .addInterest (this, "set_live__");
				this .isLive () .addInterest (this, "set_live__");
	
				this .set_live__ ();
	
				// Now initialize bases.
	
				X3DNode             .prototype .initialize .call (this);
				X3DExecutionContext .prototype .initialize .call (this);
			}
			catch (error)
			{
				console .error (error .message);
			}
		},
		getExtendedEventHandling: function ()
		{
			return false;
		},
		isLive: function ()
		{
		   return this .isLiveX3DPrototypeInstance_;
		},
		getInnerNode: function ()
		{
			var rootNodes = this .getRootNodes () .getValue ();
			
			if (rootNodes .length)
			{
				var rootNode = rootNodes [0];
				
				if (rootNode)
					return rootNode .getValue () .getInnerNode ();
			}

			throw new Error ("Root node not available.");
		},
		set_live__: function ()
		{
			var live = this .getExecutionContext () .isLive () .getValue () && X3DNode .prototype .isLive .call (this) .getValue ();

			if (live)
				this .beginUpdate ();
			else
				this .endUpdate ();
		},
		importExternProtos: function (externprotos)
		{
			for (var i = 0, length = externprotos .length; i < length; ++ i)
				this .externprotos .add (externprotos [i] .getName (), externprotos [i]);
		},
		importProtos: function (protos)
		{
			for (var i = 0, length = protos .length; i < length; ++ i)
				this .protos .add (protos [i] .getName (), protos [i]);
		},
		copyRootNodes: function (rootNodes)
		{
			var
				rootNodes1 = rootNodes .getValue (),
				rootNodes2 = this  .getRootNodes () .getValue ();

			for (var i = 0, length = rootNodes1 .length; i < length; ++ i)
			{
				var value = rootNodes1 [i] .copy (this);
				value .addParent (this .getRootNodes ());
				rootNodes2 .push (value);
			}
		},
		copyRoutes: function (routes)
		{
			for (var i = 0, length = routes .length; i < length; ++ i)
			{
				try
				{
					var route = routes [i];

					// new Route ... addUninitializedNode ...
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
		},
	});

	return X3DPrototypeInstance;
});


