
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
	
		this ._value = value;

		return this;
	}

	X3DField .prototype = $.extend (Object .create (X3DChildObject .prototype),
	{
		constructor: X3DField,
		_value: undefined,
		_references: { },
		_fieldInterests: { },
		_fieldCallbacks: { },
		_accessType: X3DConstants .initializeOnly,
		_set: false,
		_uniformLocation: null,
		clone: function ()
		{
			return this .copy ();
		},
		equals: function (value)
		{
			return this ._value === value .valueOf ();
		},
		setValue: function (value)
		{
			this .set (value instanceof this .constructor ? value .getValue () : value);
			this .addEvent ();
		},
		set: function (value)
		{
			this ._value = value;
		},
		getValue: function ()
		{
			return this ._value;
		},
		setAccessType: function (value)
		{
			this ._accessType = value;
		},
		getAccessType: function ()
		{
			return this ._accessType;
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
			return this ._set = value;
		},
		getSet: function ()
		{
			return this ._set;
		},
		hasReferences: function ()
		{
			if (this .hasOwnProperty ("_references"))
				return ! $.isEmptyObject (this ._references);

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
			if (! this .hasOwnProperty ("_references"))
				this ._references = { };

			return this ._references;
		},
		updateReferences: function ()
		{
			if (this .hasOwnProperty ("_references"))
			{
				for (var id in this ._references)
				{
					var reference = this ._references [id];

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
			if (! this .hasOwnProperty ("_fieldInterests"))
				this ._fieldInterests = { };

			this ._fieldInterests [field .getId ()] = field;
		},
		removeFieldInterest: function (field)
		{
			delete this ._fieldInterests [field .getId ()];
		},
		getFieldInterests: function ()
		{
			return this ._fieldInterests;
		},
		addFieldCallback: function (string, object)
		{
			if (! this .hasOwnProperty ("_fieldCallbacks"))
				this ._fieldCallbacks = { };

			this ._fieldCallbacks [string] = object;
		},
		removeFieldCallback: function (string)
		{
			delete this ._fieldCallbacks [string];
		},
		getFieldCallbacks: function ()
		{
			return this ._fieldCallbacks;
		},
		processEvent: function (event)
		{
			if (event .sources [this .getId ()])
				return;

			event .sources [this .getId ()] = true;

			this .setTainted (false);

			if (event .field !== this)
				this .set (event .field .getValue ());

			// Process interests

			this .processInterests ();

			// Process routes

			var
				fieldInterests = this ._fieldInterests,
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

			var fieldCallbacks = this ._fieldCallbacks;

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
