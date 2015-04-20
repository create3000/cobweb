
define ([
	"jquery",
	"cobweb/Base/X3DChildObject",
	"cobweb/Bits/X3DConstants",
],
function ($, X3DChildObject, X3DConstants)
{
	function X3DField (value)
	{
		X3DChildObject .call (this);
	
		this .value_ = value;
	}

	X3DField .prototype = $.extend (Object .create (X3DChildObject .prototype),
	{
		constructor: X3DField,
		accessType_: X3DConstants .initializeOnly,
		fieldInterests_: { },
		fieldCallbacks_: { },
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
		isReadable: function ()
		{
			return this .accessType_ !== X3DConstants .inputOnly;
		},
		isWritable: function ()
		{
			return this .accessType_ !== X3DConstants .initializeOnly;
		},
		isInput: function ()
		{
			return this .accessType_ & X3DConstants .inputOnly;
		},
		isOutput: function ()
		{
			return this .accessType_ & X3DConstants .outputOnly;
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
			var parents = this .parents_;

			for (var key in parents)
				parents [key] .addEvent (this);
		},
		addEventObject: function (field, event)
		{
			var parents = this .parents_;
		
			for (var key in parents)
				parents [key] .addEventObject (this, event);
		},
		processEvent: function (event)
		{
			//console .log (this .getName ());

			if (this .getId () in event .sources)
				return;

			event .sources [this .getId ()] = true;

			this .setTainted (false);

			if (event .field !== this)
				this .set (event .field .getValue ());

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
					fieldInterests [key] .addEventObject (this, event .copy ());
			}

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
