
define ([
	"jquery",
	"cobweb/Base/X3DChildObject",
	"cobweb/Bits/X3DConstants",
	"cobweb/Base/Events",
],
function ($,
	       X3DChildObject,
	       X3DConstants,
	       Events)
{
"use strict";

	function X3DField (value)
	{
		X3DChildObject .call (this);
	
		this .value_ = value;

		return this;
	}

	X3DField .prototype = $.extend (Object .create (X3DChildObject .prototype),
	{
		constructor: X3DField,
		references: { },
		fieldInterests: { },
		fieldCallbacks: { },
		accessType: X3DConstants .initializeOnly,
		isSet: null,
		clone: function ()
		{
			return this .copy ();
		},
		equals: function (value)
		{
			return this .getValue () == value .valueOf ();
		},
		setValue: function (value)
		{
			this .set (value instanceof this .constructor ? value .getValue () : value);
			this .addEvent ();
		},
		set: function (value)
		{
			this .value_ = value;
		},
		getValue: function ()
		{
			return this .value_;
		},
		setAccessType: function (value)
		{
			this .accessType = value;
		},
		getAccessType: function ()
		{
			return this .accessType;
		},
		isInitializable: function ()
		{
			return this .accessType & X3DConstants .initializeOnly;
		},
		isInput: function ()
		{
			return this .accessType & X3DConstants .inputOnly;
		},
		isOutput: function ()
		{
			return this .accessType & X3DConstants .outputOnly;
		},
		isReadable: function ()
		{
			return this .accessType !== X3DConstants .inputOnly;
		},
		isWritable: function ()
		{
			return this .accessType !== X3DConstants .initializeOnly;
		},
		setSet: function (value)
		{
			// Boolean indication whether the value is set during parse, or undefined.
			return this .isSet = value;
		},
		getSet: function ()
		{
			return this .isSet;
		},
		hasReferences: function ()
		{
			if (this .hasOwnProperty ("references"))
				return ! $.isEmptyObject (this .references);

			return false;
		},
		addReference: function (reference)
		{
			var references = this .getReferences ();

			if (references [reference .getId ()])
				return;

			references [reference .getId ()] = reference;

			// Create IS relationship

			switch (this .accessType & reference .getAccessType ())
			{
				case X3DConstants .initializeOnly:
					this .set (reference .getValue ());
					return;
				case X3DConstants .inputOnly:
					reference .addFieldInterest (this);
					return;
				case X3DConstants .outputOnly:
					this .addFieldInterest (reference);
					return;
				case X3DConstants .inputOutput:
					reference .addFieldInterest (this);
					this .addFieldInterest (reference);
					this .set (reference .getValue ());
					return;
			}
		},
		getReferences: function ()
		{
			if (! this .hasOwnProperty ("references"))
				this .references = { };

			return this .references;
		},
		updateReferences: function ()
		{
			if (this .hasOwnProperty ("references"))
			{
				for (var id in this .references)
				{
					var reference = this .references [id];

					switch (this .accessType & reference .getAccessType ())
					{
						case X3DConstants .inputOnly:
						case X3DConstants .outputOnly:
							continue;
						case X3DConstants .initializeOnly:
						case X3DConstants .inputOutput:
							this .set (reference .getValue ());
							continue;
					}
				}
			}
		},
		addFieldInterest: function (field)
		{
			if (! this .hasOwnProperty ("fieldInterests"))
				this .fieldInterests = { };

			this .fieldInterests [field .getId ()] = field;
		},
		removeFieldInterest: function (field)
		{
			delete this .fieldInterests [field .getId ()];
		},
		addFieldCallback: function (string, object)
		{
			if (! this .hasOwnProperty ("fieldCallbacks"))
				this .fieldCallbacks = { };

			this .fieldCallbacks [string] = object;
		},
		removeFieldCallback: function (string)
		{
			delete this .fieldCallbacks [string];
		},
		addEvent: function ()
		{
			var parents = this .getParents ();

			for (var key in parents)
				parents [key] .addEvent (this);
		},
		addEventObject: function (field, event)
		{
			var parents = this .getParents ();

			for (var key in parents)
				parents [key] .addEventObject (this, event);
		},
		processEvent: function (event)
		{
			if (event .sources .hasOwnProperty (this .getId ()))
				return;

			event .sources [this .getId ()] = true;

			this .setTainted (false);
			this .setSet (true);

			if (event .field !== this)
				this .set (event .field .getValue ());

			// Process interests

			this .processInterests ();

			// Process routes

			var
				fieldInterests = this .fieldInterests,
				first          = true;

			for (var key in fieldInterests)
			{
				if (first)
				{
					first = false;
					fieldInterests [key] .addEventObject (this, event);
				}
				else
					fieldInterests [key] .addEventObject (this, Events .copy (event));
			}

			if (first)
			   Events .push (event);

			// Process field callbacks

			var fieldCallbacks = this .fieldCallbacks;

			for (var key in fieldCallbacks)
				fieldCallbacks [key] (this .valueOf ());
		},
		valueOf: function ()
		{
			return this;
		},
	});

	return X3DField;
});
