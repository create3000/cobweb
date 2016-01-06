
define ([
	"jquery",
	"cobweb/Base/X3DEventObject",
	"cobweb/Base/Events",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Fields",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DEventObject,
          Events,
          X3DFieldDefinition,
          Fields,
          X3DConstants)
{
"use strict";

	function X3DBaseNode (browser, executionContext)
	{
		if (this .hasOwnProperty ("executionContext"))
			return;

		X3DEventObject .call (this, browser);

		this .executionContext  = executionContext;
		this .type              = [ X3DConstants .X3DBaseNode ];
		this .fields            = { };
		this .preDefinedFields  = { };
		this .userDefinedFields = { };
		
		this .addChildren ("isLive", new Fields .SFBool (true));

		var fieldDefinitions = this .fieldDefinitions;

		for (var i = 0, length = fieldDefinitions .length; i < length; ++ i)
			this .addField (fieldDefinitions [i]);
	}

	X3DBaseNode .prototype = $.extend (Object .create (X3DEventObject .prototype),
	{
		constructor: X3DBaseNode,
		fieldDefinitions: [ ],
		$initialized: false,
		create: function (executionContext)
		{
			return new (this .constructor) (executionContext);
		},
		getScene: function ()
		{
			var executionContext = this .executionContext;

			while (! executionContext .isRootContext ())
				executionContext = executionContext .getExecutionContext ();

			return executionContext;
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
			return this .$initialized;
		},
		isLive: function ()
		{
		   return this .isLive_;
		},
		setup: function ()
		{
			if (this .$initialized)
				return;

			this .$initialized = true;

			var fieldDefinitions = this .fieldDefinitions;

			for (var i = 0, length = fieldDefinitions .length; i < length; ++ i)
			{
				var field = this .fields [fieldDefinitions [i] .name];
				field .updateReferences ();
				field .setTainted (false);
			}

			this .initialize ();
		},
		initialize: function () { },
		eventsProcessed: function () { },
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

			// Default fields

			for (var i = 0, length = copy .fieldDefinitions .length; i < length; ++ i)
			{
				try
				{
					var
						fieldDefinition = copy .fieldDefinitions [i],
						field1          = this .preDefinedFields [fieldDefinition .name],
						field2          = copy .getField (fieldDefinition .name);
						
					field2 .setSet (field1 .getSet ());

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
				catch (error)
				{
					console .log (error .message);
				}
			}

			// User-defined fields

			for (var name in this .userDefinedFields)
			{
				var
					field1 = this .userDefinedFields [name],
					field2 = field1 .copy (executionContext);

				copy .addUserDefinedField (field1 .getAccessType (),
				                           field1 .getName (),
				                           field2);

				field2 .setSet (field1 .getSet ());

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

			executionContext .addUninitializedNode (copy);
			return copy;
		},
		addChildren: function (name, field)
		{
			for (var i = 0, length = arguments .length; i < length; i += 2)
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
				field      = fieldDefinition .value .clone ();

			field .setTainted (true);
			field .addParent (this);
			field .setName (name);
			field .setAccessType (accessType);

			this .addAlias (name, field, fieldDefinition .userDefined);
		},
		addAlias: function (name, field, userDefined)
		{
			this .fields [name]           = field;
			this .preDefinedFields [name] = field;

			if (field .getAccessType () === X3DConstants .inputOutput)
			{
				this .fields ["set_" + name]     = field;
				this .fields [name + "_changed"] = field;
			}

			if (userDefined)
				return;

			Object .defineProperty (this, name + "_",
			{
				get: function () { return this; } .bind (field),
				set: field .setValue .bind (field),
				enumerable: true,
				configurable: false,
			});
		},
		removeField: function (name /*, completely */)
		{
			var field = this .fields [name];

			//if (completely && field .getAccessType () === X3DConstants .inputOutput)
			//{
			//	delete this .fields ["set_" + field .getName ()];
			//	delete this .fields [field .getName () + "_changed"];
			//}

			delete this .fields [name];
			delete this .userDefinedFields [name];

			var fieldDefinitions = this .fieldDefinitions .getValue ();

			for (var i = 0, length = fieldDefinitions .length; i < length; ++ i)
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

			throw new Error ("Unkown field '" + name + "' in node class " + this .getTypeName () + ".");
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
			if (this .fields [name])
				this .removeField (name);

			field .setTainted (true);
			field .addParent (this);
			field .setName (name);
			field .setAccessType (accessType);

			this .fieldDefinitions .getValue () .push (new X3DFieldDefinition (accessType, name, field, true));

			this .fields [name]            = field;
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
		beginUpdate: function ()
		{
		   if (this .isLive () .getValue ())
		      return;

		   this .isLive () .setValue (true);
			this .isLive () .processEvent (Events .create (this .isLive ()));
		},
		endUpdate: function ()
		{
		   if (this .isLive () .getValue ())
		   {
		      this .isLive () .setValue (false);
				this .isLive () .processEvent (Events .create (this .isLive ()));
			}
		},
		toString: function ()
		{
			return this .getTypeName () + " { }";
		},
	});

	return X3DBaseNode;
});
