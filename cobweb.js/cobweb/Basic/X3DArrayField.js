
define ([
	"jquery",
	"cobweb/Basic/X3DField",
	"cobweb/Bits/X3DConstants",
],
function ($, X3DField, X3DConstants)
{
	var handler =
	{
		get: function (target, key)
		{
			if (key in target)
				return target [key];

			// value
			
			var array = target .getValue ();

			if (key >= array .length)
				target .resize (key + 1);

			return array [key] .valueOf ();
		},
		set: function (target, key, value)
		{
			if (key in target)
			{
				target [key] = value;
				return;
			}

			var array = target .getValue ();

			if (key >= array .length)
				target .resize (key + 1);

			array [key] .setValue (value);
			return true;
		},
	};

	function X3DArrayField (value)
	{
		X3DField .call (this, [ ]);
		
		if (value !== undefined)
		{
			if (value [0] instanceof Array)
				value = value [0];

			for (var i = 0; i < value .length; ++ i)
				this .push (value [i]);

			return new Proxy (this, handler);
		}
	}

	X3DArrayField .prototype = $.extend (new X3DField ([ ]),
	{
		constructor: X3DArrayField,
		copy: function (executionContext)
		{
			var copy  = new this .constructor ();
			var array = this .getValue ();
			
			for (var i = 0; i < array .length; ++ i)
				copy .push (array [i]);

			return copy;
		},
		setValue: function (value)
		{
			if (value instanceof X3DArrayField)
				value = value .getValue ();

			this .resize (value .length);

			var array = this .getValue ();

			for (var i = 0; i < value .length; ++ i)
				array [i] .setValue (value [i]);
		},
		set: function (value)
		{
			this .resize (value .length, undefined, true);

			var array = this .getValue ();

			for (var i = 0; i < value .length; ++ i)
				array [i] .set (value [i]);
		},
		unshift: function (value)
		{
			var array = this .getValue ();
			var field = new (this .valueType_) ();

			field .setValue (value);
			field .addParent (this);

			this .addEvent ();

			return array .unshift (field);
		},
		shift: function ()
		{
			var array = this .getValue ();

			if (array .length)
			{
				var field = array .shift ();
				field .removeParent (this);
				this .addEvent ();
				return field .valueOf ();
			}
		},
		push: function (value)
		{
			var array = this .getValue ();
			var field = new (this .valueType_) ();

			field .setValue (value);
			field .addParent (this);

			this .addEvent ();

			return array .push (field);
		},
		pop: function ()
		{
			var array = this .getValue ();

			if (array .length)
			{
				var field = array .pop ();
				field .removeParent (this);
				this .addEvent ();
				return field .valueOf ();
			}
		},
		insert: function (index, array, first, last)
		{
			var args = [index, 0];

			for (var i = first; i < last; ++ i)
			{
				var field = new (this .valueType_) ();

				field .setValue (array [i]);
				field .addParent (this);

				args .push (field);
			}

			Array .prototype .splice .apply (this .getValue (), args);

			this .addEvent ();
		},
		erase: function (first, last)
		{
			var values = this .getValue () .splice (first, last - first);
				
			for (var i = 0; i < values .length; ++ i)
				values [i] .removeParent (this);
			
			this .addEvent ();
		},
		resize: function (size, value, silent)
		{
			var array = this .getValue ();
		
			if (size < array .length)
			{
				for (var i = size; i < array .length; ++ i)
					array [i] .removeParent (this);

				array .length = size;

				if (! silent)
					this .addEvent ();
			}
			else if (size > array .length)
			{
				for (var i = array .length; i < size; ++ i)
				{
					var field = new (this .valueType_) ();

					if (value !== undefined)
						field .setValue (value);

					field .addParent (this);
					array .push (field);
				}

				if (! silent)
					this .addEvent ();
			}
		},
		toString: function ()
		{
			return "[object " + this .getTypeName () + "]";
		},
	});

	Object .defineProperty (X3DArrayField .prototype, "length",
	{
		get: function () { return this .getValue () .length; },
		set: function (value) { this .resize (value); },
		enumerable: false,
		configurable: false
	});

	return X3DArrayField;
});
