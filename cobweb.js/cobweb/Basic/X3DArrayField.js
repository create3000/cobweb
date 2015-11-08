
define ([
	"jquery",
	"cobweb/Basic/X3DField",
	"cobweb/Bits/X3DConstants",
	"cobweb/InputOutput/Generator",
],
function ($, X3DField, X3DConstants, Generator)
{
"use strict";

	var handler =
	{
		get: function (target, key)
		{
			try
			{
				if (key in target)
					return target [key];

				// value
				
				var array = target .getValue ();

				if (key >= array .length)
					target .resize (key + 1);

				return array [key] .valueOf ();
			}
			catch (error)
			{
				// if target not instance of X3DArrayField, then the constuctor is called as function.
				console .log (target, key, error);
			}
		},
		set: function (target, key, value)
		{
			try
			{
				if (key in target)
				{
					target [key] = value;
					return true;
				}

				var
					array = target .getValue (),
					index = parseInt (key);

				if (index >= array .length)
					target .resize (index + 1);

				array [index] .setValue (value);
				return true;
			}
			catch (error)
			{
				// if target not instance of X3DArrayField, then the constuctor is called as function.
				console .log (target, key, error);
				return false;
			}
		},
		has: function (target, key)
		{
			return key in target .getValue ();
		},
		enumerate: function (target)
		{
			var
				array = target .getValue (),
				keys  = [ ];

			for (var i = 0, length = array .length; i < length; ++ i)
				keys .push (i);

			return keys [Symbol.iterator] ();
		},
	};

	function X3DArrayField (value)
	{
		X3DField .call (this, [ ]);
		
		if (value [0] instanceof Array)
			value = value [0];

		for (var i = 0, length = value .length; i < length; ++ i)
			this .push (value [i]);

		return new Proxy (this, handler);
	}

	X3DArrayField .prototype = $.extend (new X3DField ([ ]),
	{
		constructor: X3DArrayField,
		copy: function ()
		{
			var
				copy  = new (this .constructor) (),
				array = this .getValue ();

			for (var i = 0, length = array .length; i < length; ++ i)
				copy .push (array [i]);

			return copy;
		},
		setValue: function (value)
		{
			this .set (value instanceof X3DArrayField ? value .getValue () : value);
			this .addEvent ();
		},
		set: function (value)
		{
			this .resize (value .length, undefined, true);

			var array = this .getValue ();

			for (var i = 0, length = value .length; i < length; ++ i)
				array [i] .set (value [i] instanceof X3DField ? value [i] .getValue () : value [i]);
		},
		unshift: function (value)
		{
			var
				array = this .getValue (),
				field = new (this .valueType_) ();

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
			var
				array = this .getValue (),
				field = new (this .valueType_) ();

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
				
			for (var i = 0, length = values .length; i < length; ++ i)
				values [i] .removeParent (this);
			
			this .addEvent ();
		},
		resize: function (size, value, silent)
		{
			var array = this .getValue ();
		
			if (size < array .length)
			{
				for (var i = size, length = array .length; i < length; ++ i)
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
			var
				array  = this .getValue (),
				string = "";

			switch (array .length)
			{
				case 0:
				{
					string += "[ ]";
					break;
				}
				case 1:
				{
					string += array [0] .toString ();
					break;
				}
				default:
				{
					string += "[\n";
					Generator .IncIndent ();
				
					for (var i = 0, length = array .length - 1; i < length; ++ i)
					{
						string += Generator .Indent ();
						string += array [i] .toString ();
						string += ",\n"
					}

					string += Generator .Indent ();
					string += array [length] .toString ();
					string += "\n";
					Generator .DecIndent ();
					string += Generator .Indent ();
					string += "]";
					break;
				}
			}

			return string;
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
