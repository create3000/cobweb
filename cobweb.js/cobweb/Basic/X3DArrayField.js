
define ([
	"jquery",
	"cobweb/Basic/X3DField",
	"cobweb/Bits/X3DConstants",
],
function ($, X3DField, X3DConstants)
{
	function getValue (field)
	{
	   switch (field .getType ())
	   {
	      case X3DConstants .SFBool:
	      case X3DConstants .SFDouble:
	      case X3DConstants .SFFloat:
	      case X3DConstants .SFInt32:
	      case X3DConstants .SFString:
	      case X3DConstants .SFTime:
	      {
	         return field .getValue ();
	      }
	      case X3DConstants .SFNode:
	      {
	         if (field .getValue ())
	            return field;

	         return null;
	      }
	      default:
	         return field;
	   }
	}

	var handler =
	{
		get: function (target, key)
		{
			if (key in target)
				return target [key];

			// value

			if (key >= target .getValue () .length)
				target .resize (key + 1);

			return getValue (target .getValue () [key]);
		},
		set: function (target, key, value)
		{
			if (key in target)
			{
				target [key] = value;
				return;
			}

			if (key >= target .getValue () .length)
				target .resize (key + 1);
		
			target .getValue () [key] .setValue (value);
			return true;
		},
	};

	function X3DArrayField (value)
	{
		X3DField .call (this, [ ]);
		
		if (value !== undefined)
		{
			var array = new Proxy (this, handler);

			if (value [0] instanceof Array)
				value = value [0];

			for (var i = 0; i < value .length; ++ i)
				array .push (value [i]);

			return array;
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
			{
				var value = array [i] .copy ();
				value .addParent (this);
				copy .push (value);
			}

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
		},
		unshift: function (value)
		{
			var array = this .getValue ();
			var field = new this .valueType_ ();

			field .addParent (this);
			field .setValue (value);

			return array .unshift (field);
		},
		shift: function ()
		{
			var array = this .getValue ();

			if (array .length)
			{
				var field = array .shift ();
				field .removeParent (this);
				return getValue (field);
			}
			
			return;
		},
		push: function (value)
		{
			var array = this .getValue ();
			var field = new this .valueType_ ();

			field .addParent (this);
			field .setValue (value);

			return array .push (field);
		},
		pop: function ()
		{
			var array = this .getValue ();

			if (array .length)
			{
				var field = array .pop ();
				field .removeParent (this);
				return getValue (field);
			}

			return;
		},
		resize: function (size)
		{
			var array = this .getValue ();
		
			if (size < array .length)
			{
				for (var i = size; i < array .length; ++ i)
					field .removeParent (this);

				array .length = size;
				this .addEvent ();
			}
			else if (size > array .length)
			{
				for (var i = array .length; i < size; ++ i)
				{
					var field = new this .valueType_ ();
					field .addParent (this);
					array [i] = field;
				}

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
		set: function (value) { this .getValue () .length = value; },
		enumerable: false,
		configurable: false
	});

	return X3DArrayField;
});
