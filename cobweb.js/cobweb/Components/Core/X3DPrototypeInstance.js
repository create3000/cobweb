
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
   with (Fields)
	{
		function X3DPrototypeInstance (executionContext, protoNode)
		{
			this .protoNode        = protoNode;
			this .fieldDefinitions = new FieldDefinitionArray (protoNode .getFieldDefinitions () .getValue () .slice (0));

			X3DExecutionContext .call (this, executionContext .getBrowser (), executionContext);
			X3DNode             .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .X3DPrototypeInstance);

			this .addChildren ("isLiveX3DPrototypeInstance", new SFBool (true));

			if (protoNode .isExternProto ())
				protoNode .requestAsyncLoad (this .construct .bind (this));

			else
				this .construct (protoNode);
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
			construct: function (proto)
			{
				this .proto = proto;

				if (proto)
				{
					if (this .protoNode .isExternProto ())
					{
						var fieldDefinitions = proto .getFieldDefinitions ();

						for (var i = 0, length = fieldDefinitions .length; i < length; ++ i)
						{
							var
								fieldDefinition = fieldDefinitions [i],
								protoField      = proto .getField (fieldDefinition .name);

							try
							{
								var field = this .getField (fieldDefinition .name);

								// Return if something is wrong.
								if (field .getAccessType () !== protoField .getAccessType ())
									return;

								// Return if something is wrong.
								if (field .getType () !== protoField .getType ())
									return;

								if (! (field .getAccessType () & X3DConstants .initializeOnly))
									continue;

								if (field .getFieldValue () === true)
									continue;

								field .set (protoField .getValue ());
							}
							catch (error)
							{
								// Definition exists in proto but does not has exist in extern proto.
								this .addField (fieldDefinition);
							}
						}
					}

					// Assign metadata.

					this .setWorldURL (proto .getWorldURL ());
					this .metadata_ = proto .metadata_;

					// Assign extern protos.
					
					for (var i = 0, length = proto .externprotos .length; i < length; ++ i)
						this .externprotos .push (proto .externprotos [i]);

					// Assign protos.

					for (var i = 0, length = proto .protos .length; i < length; ++ i)
						this .protos .push (proto .protos [i]);

					// Assign root nodes.

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
			},
			setup: function ()
			{
				X3DExecutionContext .prototype .setup .call (this);
				X3DNode             .prototype .setup .call (this);
			},
			initialize: function ()
			{
				if (this .proto)
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
				}
				
				this .getExecutionContext () .isLive () .addInterest (this, "set_live__");
				this .isLive () .addInterest (this, "set_live__");

				this .set_live__ ();

				// Now initialize bases.

				X3DExecutionContext .prototype .initialize .call (this);
				X3DNode             .prototype .initialize .call (this);
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

			   if (live !== this .isLive () .getValue ())
			      this .isLive () .setValue (live);
			},
		});

		return X3DPrototypeInstance;
	}
});

