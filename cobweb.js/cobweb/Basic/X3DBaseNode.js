
define ([
	"jquery",
	"cobweb/Base/X3DEventObject",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Fields",
	"cobweb/Bits/X3DConstants",
],
function ($, X3DEventObject, X3DFieldDefinition, Fields, X3DConstants)
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

		X3DBaseNode .prototype = $.extend (new X3DEventObject (),
		{
			constructor: X3DBaseNode,
			fieldDefinitions: [ ],
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
					this .fields [this .fieldDefinitions [i] .name] .setTainted (false);

				this .initialize ();
			},
			initialize: function () { },
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
			getField: function (name)
			{
				var field = this .fields [name];
				
				if (field)
					return field;

				throw Error ("Unkown field '" + name + "' in node class " + this .getTypeName ());
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
