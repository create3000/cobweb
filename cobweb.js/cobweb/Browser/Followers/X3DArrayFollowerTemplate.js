
define ("cobweb/Browser/Followers/X3DArrayFollowerTemplate",
function ()
{
"use strict";

	return function (Type)
	{
		function X3DArrayFollowerObject ()
		{
			this .array = this .getArray ();
		}
	
		X3DArrayFollowerObject .prototype =
		{
			getValue: function ()
			{
				return this .set_value_;
			},
			getDestination: function ()
			{
				return this .set_destination_;
			},
			getInitialValue: function ()
			{
				return this .initialValue_;
			},
			getInitialDestination: function ()
			{
				return this .initialDestination_;
			},
			assign: function (buffer, i, value)
			{
				buffer [i] .setValue (value);
			},
			equals: function (lhs, rhs, tolerance)
			{
				var
					a        = this .a,
					l        = lhs .getValue (),
					r        = rhs .getValue (),
					distance = 0;

				for (var i = 0, length = l .length; i < length; ++ i)
				  distance = Math .max (a .assign (l [i] .getValue ()) .subtract (r [i] .getValue ()) .abs ());
	
				return distance < tolerance;
			},
			interpolate: function (source, destination, weight)
			{
				var
					a = this .array .getValue (),
					s = source .getValue (),
					d = destination .getValue ();
	
				this .array .length = s .length;
	
				for (var i = 0, length = s .length; i < length; ++ i)
					a [i] .getValue () .assign (s [i] .getValue ()) .lerp (d [i] .getValue (), weight);
	
				return this .array;
			},
			set_value__: function ()
			{
				this .getBuffer () [0] .length = this .set_value_ .length;
	
				Type .prototype .set_value__ .call (this);
			},
			set_destination__: function ()
			{
				var
					buffer = this .getBuffer (),
					l      = this .set_destination_ .length;
	
				for (var i = 0, length = buffer .length; i < length; ++ i)
					buffer [i] .length = l;
				
				Type .prototype .set_destination__ .call (this);
			},
		};
	
		return X3DArrayFollowerObject;
	};
});


