
define ([
	"jquery",
	"cobweb/Basic/X3DField",
	"cobweb/Bits/X3DConstants",
],
function ($, X3DField, X3DConstants)
{
	function SFDouble (value)
	{
		X3DField .call (this, arguments .length ? +value : 0);
	}

	SFDouble .prototype = $.extend (new X3DField (),
	{
		constructor: SFDouble,
		copy: function ()
		{
			return new SFDouble (this .getValue ());
		},
		getTypeName: function ()
		{
			return "SFDouble";
		},
		getType: function ()
		{
			return X3DConstants .SFDouble;
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

	return SFDouble;
});
