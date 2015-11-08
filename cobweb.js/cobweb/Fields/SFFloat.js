
define ([
	"jquery",
	"cobweb/Basic/X3DField",
	"cobweb/Bits/X3DConstants",
],
function ($, X3DField, X3DConstants)
{
"use strict";

	function SFFloat (value)
	{
		if (this instanceof SFFloat)
			return X3DField .call (this, arguments .length ? +value : 0);
		
		return X3DField .call (Object .create (SFFloat .prototype), arguments .length ? +value : 0);
	}

	SFFloat .prototype = $.extend (Object .create (X3DField .prototype),
	{
		constructor: SFFloat,
		copy: function ()
		{
			return new SFFloat (this .getValue ());
		},
		getTypeName: function ()
		{
			return "SFFloat";
		},
		getType: function ()
		{
			return X3DConstants .SFFloat;
		},
		set: function (value)
		{
			X3DField .prototype .set .call (this, +value);
		},
		valueOf: X3DField .prototype .getValue,
		toString: function ()
		{
			return String (this .getValue ());
		},
	});

	return SFFloat;
});
