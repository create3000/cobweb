
define ([
	"jquery",
	"cobweb/Basic/X3DField",
	"cobweb/Bits/X3DConstants",
],
function ($, X3DField, X3DConstants)
{
	function SFFloat (value)
	{
		X3DField .call (this, arguments .length ? +value : 0);
	}

	SFFloat .prototype = $.extend (new X3DField (),
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
		valueOf: function ()
		{
			return this .getValue ();
		},
		toString: function ()
		{
			return String (this .getValue ());
		},
	});

	return SFFloat;
});