
define ([
	"jquery",
	"cobweb/Basic/X3DField",
],
function ($, X3DField)
{
"use strict";

	return function (Type)
	{
		return $.extend (Object .create (X3DField .prototype),
		{
			copy: function ()
			{
				return new (this .constructor) (this .getValue () .copy ());
			},
			equals: function (vector)
			{
				return this .getValue () .equals (vector .getValue ());
			},
			set: function (value)
			{
				this .getValue () .assign (value);
			},
			negate: function ()
			{
				return new (this .constructor) (Type .negate (this .getValue () .copy ()));
			},
			add: function (vector)
			{
				return new (this .constructor) (Type .add (this .getValue (), vector .getValue ()));
			},
			subtract: function (vector)
			{
				return new (this .constructor) (Type .subtract (this .getValue (), vector .getValue ()));
			},
			multiply: function (value)
			{
				return new (this .constructor) (Type .multiply (this .getValue (), value));
			},
			divide: function (value)
			{
				return new (this .constructor) (Type .divide (this .getValue (), value));
			},
			dot: function (vector)
			{
				return this .getValue () .dot (vector .getValue ());
			},
			normalize: function (vector)
			{
				return new (this .constructor) (Type .normalize (this .getValue ()));
			},
			length: function ()
			{
				return this .getValue () .abs ();
			},
			toString: function ()
			{
				return this .getValue () .toString ();
			},
		});
	};
});
