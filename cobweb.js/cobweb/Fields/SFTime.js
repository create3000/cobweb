
define ([
	"jquery",
	"cobweb/Basic/X3DField",
	"cobweb/Bits/X3DConstants",
],
function ($, X3DField, X3DConstants)
{
"use strict";

	function SFTime (value)
	{
		if (this instanceof SFTime)
			return X3DField .call (this, arguments .length ? +value : 0);
	
		return X3DField .call (Object .create (SFTime .prototype), arguments .length ? +value : 0);
	}

	SFTime .prototype = $.extend (Object .create (X3DField .prototype),
	{
		constructor: SFTime,
		copy: function ()
		{
			return new SFTime (this .getValue ());
		},
		getTypeName: function ()
		{
			return "SFTime";
		},
		getType: function ()
		{
			return X3DConstants .SFTime;
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

	return SFTime;
});
