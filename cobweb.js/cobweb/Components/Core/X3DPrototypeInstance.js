
define ([
	"jquery",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Fields",
	"cobweb/Components/Core/X3DNode",
	"cobweb/Execution/X3DExecutionContext",
	"cobweb/Bits/X3DConstants",
],
function ($,
          FieldDefinitionArray,
          Fields,
          X3DNode,
          X3DExecutionContext,
          X3DConstants)
{
"use strict";

	function X3DPrototypeInstance (executionContext, protoNode)
	{
		this .protoNode        = protoNode;
		this .fieldDefinitions = new FieldDefinitionArray (protoNode .getFieldDefinitions () .getValue () .slice (0));

		this .addChildren ("isLiveX3DPrototypeInstance", new Fields .SFBool (true));

		X3DNode             .call (this, executionContext);
		X3DExecutionContext .call (this, executionContext);

		this .addType (X3DConstants .X3DPrototypeInstance);
		this .getRootNodes () .setAccessType (X3DConstants .initializeOnly);

		protoNode .addInstance (this);

		if (protoNode .isExternProto ())
		{
			if (protoNode .checkLoadState () === X3DConstants .COMPLETE_STATE)
				this .construct ();
		}
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
								protoField      = proto .getField (fieldDefinition .name);

							var field = this .getField (fieldDefinition .name);

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

				this .importExternProtos (proto);
				this .importProtos (proto);
				this .copyRootNodes (proto);
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
				if (this .protoNode .isExternProto ())
					this .construct ();
	
				if (this .protoNode .checkLoadState () === X3DConstants .COMPLETE_STATE)
				{
					var proto = this .protoNode .getProtoDeclaration ();

					if (proto)
					{
						//this .copyImportedNodes (proto);
						this .copyRoutes (proto);
					}
				}
				
				this .getExecutionContext () .isLive () .addInterest (this, "set_live__");
				this .isLive () .addInterest (this, "set_live__");
	
				this .set_live__ ();
	
				// Now initialize bases.
	
				X3DExecutionContext .prototype .initialize .call (this);
				X3DNode             .prototype .initialize .call (this);
			}
			catch (error)
			{
				console .log (error);
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
			var rootNodes = this .getRootNodes ();
			
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
		importExternProtos: function (executionContext)
		{
			var externprotos = executionContext .externprotos;

			for (var i = 0, length = externprotos .length; i < length; ++ i)
				this .externprotos .add (externprotos [i] .getName (), externprotos [i]);
		},
		importProtos: function (executionContext)
		{
			var protos = executionContext .protos;

			for (var i = 0, length = protos .length; i < length; ++ i)
				this .protos .add (protos [i] .getName (), protos [i]);
		},
		copyRootNodes: function (executionContext)
		{
			var
				rootNodes1 = executionContext .getRootNodes () .getValue (),
				rootNodes2 = this  .getRootNodes () .getValue ();

			for (var i = 0, length = rootNodes1 .length; i < length; ++ i)
			{
				var value = rootNodes1 [i] .copy (this);
				value .addParent (this .getRootNodes ());
				rootNodes2 .push (value);
			}
		},
		copyRoutes: function (executionContext)
		{
			// Copy routes.

			var routes = executionContext .routes;

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


