
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
		references_: { },
		fieldInterests_: { },
		fieldCallbacks_: { },
		accessType_: X3DConstants .initializeOnly,
		set_: null,
		uniformLocation_: null,
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
			this .accessType_ = value;
		},
		getAccessType: function ()
		{
			return this .accessType_;
		},
		isInitializable: function ()
		{
			return this .getAccessType () & X3DConstants .initializeOnly;
		},
		isInput: function ()
		{
			return this .getAccessType () & X3DConstants .inputOnly;
		},
		isOutput: function ()
		{
			return this .getAccessType () & X3DConstants .outputOnly;
		},
		isReadable: function ()
		{
			return this .getAccessType () !== X3DConstants .inputOnly;
		},
		isWritable: function ()
		{
			return this .getAccessType () !== X3DConstants .initializeOnly;
		},
		setSet: function (value)
		{
			// Boolean indication whether the value is set during parse, or undefined.
			return this .set_ = value;
		},
		getSet: function ()
		{
			return this .set_;
		},
		hasReferences: function ()
		{
			if (this .hasOwnProperty ("references_"))
				return ! $.isEmptyObject (this .references_);

			return false;
		},
		isReference: function (accessType)
		{
			return accessType === this .getAccessType () || accessType === X3DConstants .inputOutput;
		},
		addReference: function (reference)
		{
			var references = this .getReferences ();

			if (references [reference .getId ()])
				return;

			references [reference .getId ()] = reference;

			// Create IS relationship

			switch (this .getAccessType () & reference .getAccessType ())
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
			if (! this .hasOwnProperty ("references_"))
				this .references_ = { };

			return this .references_;
		},
		updateReferences: function ()
		{
			if (this .hasOwnProperty ("references_"))
			{
				for (var id in this .references_)
				{
					var reference = this .references_ [id];

					switch (this .getAccessType () & reference .getAccessType ())
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
			if (! this .hasOwnProperty ("fieldInterests_"))
				this .fieldInterests_ = { };

			this .fieldInterests_ [field .getId ()] = field;
		},
		removeFieldInterest: function (field)
		{
			delete this .fieldInterests_ [field .getId ()];
		},
		addFieldCallback: function (string, object)
		{
			if (! this .hasOwnProperty ("fieldCallbacks_"))
				this .fieldCallbacks_ = { };

			this .fieldCallbacks_ [string] = object;
		},
		removeFieldCallback: function (string)
		{
			delete this .fieldCallbacks_ [string];
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

			try
			{
			if (event .field !== this)
				this .set (event .field .getValue ());
			}
			catch (error)
			{
				console .log (event);
				throw error;
			}

			// Process interests

			this .processInterests ();

			// Process routes

			var
				fieldInterests = this .fieldInterests_,
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

			var fieldCallbacks = this .fieldCallbacks_;

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
