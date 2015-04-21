
define ([
	"jquery",
	"cobweb/Base/X3DEventObject",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Fields",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DEventObject,
          X3DFieldDefinition,
          Fields,
          X3DConstants)
{
	with (Fields)
	{
		function X3DBaseNode (browser, executionContext)
		{
			if (this .hasOwnProperty ("executionContext"))
				return;

			X3DEventObject .call (this, browser);

			this .executionContext  = executionContext;
			this .type              = [ X3DConstants .X3DBaseNode ];
			this .fields            = { };
			this .userDefinedFields = { };

			for (var i = 0; i < this .fieldDefinitions .length; ++ i)
				this .addField (this .fieldDefinitions [i]);
		}

		X3DBaseNode .prototype = $.extend (Object .create (X3DEventObject .prototype),
		{
			constructor: X3DBaseNode,
			fieldDefinitions: [ ],
			create: function (executionContext)
			{
				return new (this .constructor) (executionContext);
			},
			getExecutionContext: function ()
			{
				return this .executionContext;
			},
			addType: function (value)
			{
				this .type .push (value);
			},
			getType: function ()
			{
				return this .type;
			},
			getInnerNode: function ()
			{
				return this;
			},
			isInitialized: function ()
			{
				return this .hasOwnProperty ("isLive_");
			},
			setup: function ()
			{
				if (this .isInitialized ())
					return;

				this .addChildren ("isLive", new SFBool (true));

				for (var i = 0; i < this .fieldDefinitions .length; ++ i)
				{
					var field = this .fields [this .fieldDefinitions [i] .name];
					field .updateReferences ();
					field .setTainted (false);
				}

				this .initialize ();
			},
			initialize: function () { },
			copy: function (executionContext)
			{
				// First try to get a named node with the node's name.

				var name = this .getName ();
			
				if (name .length)
				{
					try
					{
						return executionContext .getNamedNode (name) .getValue ();
					}
					catch (error)
					{ }
				}

				// Create copy.

				var copy = this .create (executionContext);

				if (name .length)
					executionContext .updateNamedNode (name, copy);

				for (var i = 0, length = this .fieldDefinitions .length; i < length; ++ i)
				{
					var
						fieldDefinition = this .fieldDefinitions [i],
						field1          = this .getField (fieldDefinition .name);
	
					try
					{
						// Default fields

						var field2 = copy .getField (fieldDefinition .name);

						if (field2 .getAccessType () === field1 .getAccessType () && field2 .getType () === field1 .getType ())
						{
							if (field1 .hasReferences ())
							{
								// IS relationship
								for (var id in field1 .getReferences ())
								{
									var originalReference = field1 .getReferences () [id];

									try
									{
										field2 .addReference (executionContext .getField (originalReference .getName ()));
									}
									catch (error)
									{
										console .log (error .message);
									}
								}
							}
							else
							{
								if (field1 .getAccessType () & X3DConstants .initializeOnly)
									field2 .set (field1 .copy (executionContext) .getValue ());
							}
						}
						else
							throw false; /// XXX: Why?
					}
					catch (error)
					{
						// User defined fields from Script and Shader

						var field2 = field1 .copy (executionContext);

						copy .addUserDefinedField (fieldDefinition .accessType,
						                           fieldDefinition .name,
						                           field2);

						if (field1 .hasReferences ())
						{
							// IS relationship

							for (var id in field1 .getReferences ())
							{
								var originalReference = field1 .getReferences () [id];

								try
								{
									field2 .addReference (executionContext .getField (originalReference .getName ()));
								}
								catch (error)
								{
									console .log ("No reference '" + originalReference .getName () + "' inside execution context " + executionContext .getTypeName () + " '" + executionContext .getName () + "'.");
								}
							}
						}
					}
				}

				executionContext .addUninitializedNode (copy);
				return copy;
			},
			addChildren: function (name, field)
			{
				for (var i = 0; i < arguments .length; i += 2)
					this .addChild (arguments [i + 0], arguments [i + 1]);
			},
			addChild: function (name, field)
			{
				field .addParent (this);
				field .setName (name);

				Object .defineProperty (this, name + "_",
				{
					get: function () { return this; } .bind (field),
					set: field .setValue .bind (field),
					enumerable: true,
					configurable: false,
				});
			},
			addField: function (fieldDefinition)
			{
				var
					accessType = fieldDefinition .accessType,
					name       = fieldDefinition .name,
					field      = fieldDefinition .value .copy ();
				
				field .setTainted (true);
				field .addParent (this);
				field .setName (name);
				field .setAccessType (accessType);

				this .addAlias (name, field);
			},
			addAlias: function (name, field)
			{
				this .fields [name] = field;
				
				if (field .getAccessType () === X3DConstants .inputOutput)
				{
					this .fields ["set_" + name]     = field;
					this .fields [name + "_changed"] = field;
				}

				Object .defineProperty (this, name + "_",
				{
					get: function () { return this; } .bind (field),
					set: field .setValue .bind (field),
					enumerable: true,
					configurable: false,
				});
			},
			removeField: function (field)
			{
				var name = field .getName ();

				delete this .fields [name];
				delete this .fields ["set_" + name];
				delete this .fields [name + "_changed"];
				delete this .userDefinedFields [name];

				var fieldDefinitions = this .fieldDefinitions .getValue ();

				for (var i = 0; i < fieldDefinitions .length; ++ i)
				{
					if (fieldDefinitions [i] .name === name)
					{
						fieldDefinitions .splice (i, 1);
						break;
					}
				}
			},
			getField: function (name)
			{
				var field = this .fields [name];
				
				if (field)
					return field;

				throw Error ("Unkown field '" + name + "' in node class " + this .getTypeName () + ".");
			},
			getFieldDefinitions: function ()
			{
				return this .fieldDefinitions;
			},
			hasUserDefinedFields: function ()
			{
				return false;
			},
			addUserDefinedField: function (accessType, name, field)
			{
				var current = this .fields [name];

				if (current)
					this .removeField (current);

				field .setTainted (true);
				field .addParent (this);
				field .setName (name);
				field .setAccessType (accessType);

				this .fieldDefinitions .getValue () .push (new X3DFieldDefinition (accessType, name, field));
				this .fields [name] = field;
				this .userDefinedFields [name] = field;

				if (field .getAccessType () === X3DConstants .inputOutput)
				{
					this .fields ["set_" + name]     = field;
					this .fields [name + "_changed"] = field;
				}
			},
			getUserDefinedFields: function ()
			{
				return this .userDefinedFields;
			},
			getCDATA: function ()
			{
				return null;
			},
			traverse: function () { },
			toString: function ()
			{
				return this .getTypeName () + " { }";
			},
		});

		return X3DBaseNode;
	}
});
